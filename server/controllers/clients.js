const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ClientModel = require("../models/ClientModel.js");
const dotenv = require("dotenv");

dotenv.config();
const SECRET = process.env.SECRET;

const getClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await ClientModel.findById(id);

    res.status(200).json(client);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getClients = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;

    const total = await ClientModel.countDocuments({});
    const clients = await ClientModel.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: clients,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createClient = async (req, res) => {
  const client = req.body;
  const newClient = new ClientModel({
    ...client,
    createdAt: new Date().toISOString(),
  });

  try {
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(409).json(error.message);
  }
};

const updateClient = async (req, res) => {
  const { id: _id } = req.params;
  const client = req.body;

  try {
    const updatedClient = await ClientModel.findByIdAndUpdate(
      _id,
      { ...client, _id },
      { new: true }
    );

    res.json(updatedClient);
  } catch (error) {
    res.status(500).send("Error deleting customer");
  }
};

const deleteClient = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await ClientModel.findByIdAndDelete(_id);
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).send("Error deleting Client");
  }
};

const getClientsByUser = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const clients = await ClientModel.find({ userId: searchQuery });

    res.json({ data: clients });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getClient,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientsByUser,
};
