import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Link,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsFormValid(name !== "" && email !== "" && password !== "");
  }, [name, email, password]);

  const handleSignup = (e) => {
    e.preventDefault();
    if (isFormValid) {
      axios
        .post("http://localhost:3001/signup", { name, email, password })
        .then((result) => {
          if (result.status === 201) {
            navigate("/login");
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 400) {
            setErrorMessage(
              "Email already exists. Please use a different email."
            );
          } else {
            console.log(err);
            setErrorMessage("An error occurred. Please try again.");
          }
        });
    }
  };

  const paperStyle = {
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
  };
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "2rem" };
  const btnStyle = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "blue",
    borderRadius: "0.5rem",
  };

  return (
    <div>
      <Grid align="center" className="wrapper">
        <Paper
          style={paperStyle}
          sx={{
            width: {
              xs: "80vw",
              sm: "50vw",
              md: "40vw",
              lg: "30vw",
              xl: "20vw",
            },
            height: {
              lg: "60vh",
            },
          }}
        >
          <Typography component="h1" variant="h5" style={heading}>
            Signup
          </Typography>
          <form onSubmit={handleSignup}>
            <TextField
              style={row}
              sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
              fullWidth
              type="text"
              label="Enter Name"
              name="name"
              required
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              style={row}
              sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              placeholder="Enter Email"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              style={row}
              sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              placeholder="Enter Password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              style={btnStyle}
              variant="contained"
              type="submit"
              disabled={!isFormValid}
            >
              SignUp
            </Button>
            {errorMessage && (
              <Typography
                color="error"
                variant="body2"
                style={{ marginTop: "1rem" }}
              >
                {errorMessage}
              </Typography>
            )}
          </form>
          <p>
            Already have an account?<Link href="/login"> Login</Link>
          </p>
        </Paper>
      </Grid>
    </div>
  );
}

export default SignUp;
