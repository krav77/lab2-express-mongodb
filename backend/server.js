const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/ecodatabase')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const airQualitySchema = new mongoose.Schema({
    station_name: String,
    city_name: String,
    pm25: Number,
    pm10: Number,
    measurement_time: String
});

const AirQuality = mongoose.model("AirQuality", airQualitySchema, "AirQuality");

app.get('/measurements', async (req, res) => {
    const data = await AirQuality.find();
    res.json(data);
});

app.post('/measurements', async (req, res) => {
    const item = new AirQuality(req.body);
    await item.save();
    res.json(item);
});

app.delete('/measurements/:id', async (req, res) => {
    try {
        const deletedItem = await AirQuality.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Not found" });
        }

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete error", error });
    }
});

app.listen(3001, () => console.log("Server running on port 3001"));

