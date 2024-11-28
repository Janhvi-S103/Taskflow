const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Important: Add these middleware before routes
app.use(express.json()); // For parsing JSON payloads
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded bodies

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Serve static files from public directory
app.use(express.static('public'));

// The routes should be mounted at /api
app.use('/api', require('./routes/tasks'));

const PORT = process.env.PORT || 5500;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://janhvis103:apAaLtgAGgPJYtL2<db_password>@cluster1.6ycji.mongodb.net/';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Add error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});