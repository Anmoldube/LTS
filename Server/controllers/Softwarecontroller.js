const SoftwareModel = require("../models/SoftwareModel");
const moment = require("moment");

const getAllSoftware = async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;
    const software = await SoftwareModel.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
      userid: req.body.userid,
      ...(type !== "all" && { type }),
    });
    res.status(200).json(software);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteSoftware = async (req, res) => {
  try {
    await SoftwareModel.findOneAndDelete({ _id: req.body.SoftwareId });
    res.status(200).send("Software Deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const editSoftware = async (req, res) => {
  try {
    await SoftwareModel.findOneAndUpdate(
      { _id: req.body.SoftwareId },
      req.body.payload
    );
    res.status(200).send("Edit Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addSoftware = async (req, res) => {
  try {
    const newSoftware = new SoftwareModel(req.body);
    await newSoftware.save();
    res.status(201).send("Software Created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllSoftware,
  addSoftware,
  editSoftware,
  deleteSoftware,
};
