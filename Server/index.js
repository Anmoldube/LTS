const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const nodemailer = require("nodemailer");
const UserModel = require("./models/userModel");
dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

app.use(morgan("dev"));

// User Routes
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.user = { id: user._id, name: user.name, email: user.email };
        res.json("Success");
      } else {
        res.status(401).json("Password doesn't match");
      }
    } else {
      res.status(404).json("No Records found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to logout" });
      } else {
        res.status(200).json("Logout successful");
      }
    });
  } else {
    res.status(400).json({ error: "No session found" });
  }
});

app.get("/user", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json("Not authenticated");
  }
});

const schemaData = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    StartDate: { type: Date, required: true },
    EXP: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Define the model
const SoftwareData = mongoose.model("SoftwareData", schemaData);

// Create data
app.post("/UserInfo/SoftwareData/create", async (req, res) => {
  try {
    const { Name, StartDate, EXP } = req.body;

    // Convert date strings to Date objects
    const parsedStartDate = new Date(StartDate);
    const parsedEXP = new Date(EXP);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEXP.getTime())) {
      return res.status(400).send({
        success: false,
        message: "Invalid date format",
      });
    }

    const newData = new SoftwareData({
      Name,
      StartDate: parsedStartDate,
      EXP: parsedEXP,
    });

    const savedData = await newData.save();
    res.send({
      success: true,
      message: "Data saved successfully",
      data: savedData,
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send({
      success: false,
      message: "Failed to save data",
      error: error.message,
    });
  }
});

// Update data
app.patch("/UserInfo/SoftwareData/update/:id", async (req, res) => {
  try {
    const { Name, StartDate, EXP } = req.body;
    const parsedStartDate = new Date(StartDate);
    const parsedEXP = new Date(EXP);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEXP.getTime())) {
      return res.status(400).send({
        success: false,
        message: "Invalid date format",
      });
    }

    const data = await SoftwareData.findByIdAndUpdate(
      req.params.id,
      {
        Name,
        StartDate: parsedStartDate,
        EXP: parsedEXP,
      },
      { new: true }
    );

    res.send({
      success: true,
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send({
      success: false,
      message: "Failed to update data",
      error: error.message,
    });
  }
});

// Delete data
app.delete("/UserInfo/SoftwareData/delete/:id", async (req, res) => {
  try {
    const data = await SoftwareData.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Data deleted successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).send({
      success: false,
      message: "Failed to delete data",
      error: error.message,
    });
  }
});

// Get all data
app.get("/UserInfo/SoftwareData", async (req, res) => {
  try {
    const data = await SoftwareData.find();
    res.send({ success: true, data: data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch data",
      error: error.message,
    });
  }
});

// Email notification setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to check expiry dates and send email
const checkExpiryDates = async () => {
  try {
    const now = new Date();
    const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    console.log(
      `Checking for software expiring between ${now} and ${tenDaysFromNow}`
    );

    const expiringSoon = await SoftwareData.find({
      EXP: { $lte: tenDaysFromNow, $gte: now },
    });

    if (expiringSoon.length > 0) {
      console.log("Found expiring software:", expiringSoon);

      const mailOptions = {
        from: '"Anmol Dube This is a reminder for you pay👻" <dubea9514@gmail.com>', // sender address
        to: "nmoldube@gmail.com", // list of receivers
        subject: "Software Expiry Notification", // Subject line
        text: `The following software is expiring within 10 days:\n\n${expiringSoon
          .map((data) => `Name: ${data.Name}, Expiry Date: ${data.EXP}`)
          .join("\n")}`, // plain text body
        // plain text body
        html: `<b>The following software is expiring within 10 days:</b>
          <h6>Action Required:</h6>
          <p>
          Please ensure that any necessary actions are taken to renew or extend the license before the expiration date.
          If the software has been updated or renewed, kindly update the expiration date in the system to reflect the most recent information.
          Keeping your software licenses up to date helps maintain uninterrupted service and compliance with legal and organizational standards.
          </p>
          <p>
          <strong>How to Update:</strong>
          <br>
          To update the license details, log in to the Software Management Portal and navigate to the "License Management" section. Edit the relevant software details and save the changes.
          </p>
          <p>
          If you have any questions or need assistance, please do not hesitate to contact our support team at [Support Email] or [Support Phone Number].
          </p>
          <p>
          Thank you for your prompt attention to this matter.
          </p>
          <br>
          <br>
          <b>Expiring Software:</b>
          <ul>
          ${expiringSoon
            .map(
              (data) => `<li>Name: ${data.Name}, Expiry Date: ${data.EXP}</li>`
            )
            .join("")}
          </ul>`, // html body
      };

      await transporter.sendMail(mailOptions);
      console.log("Expiry notification email sent.");
    } else {
      console.log("No software expiring within 10 days.");
    }
  } catch (error) {
    console.error("Error checking expiry dates or sending email:", error);
  }
};

// Schedule the checkExpiryDates function to run every day
setInterval(checkExpiryDates, 24 * 60 * 60 * 1000); // 24 hours

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
