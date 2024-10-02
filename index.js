const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const usermodel = require('./Model/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:5173', 'https://mycardifyfrontend.vercel.app'], // Frontend URLs (local and production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow credentials such as cookies, authorization headers, etc.
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.post('/signup', async (req, res) => {
    console.log(req.body);
    const { email, firstName, lastName, phone, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUserTask = await usermodel.create({ email, firstName, lastName, phone, password: hashedPassword });
        res.status(200).json(createUserTask);
        console.log('submitted successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.post('/login', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User is not registered' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1m' });
        const expirationTime = Date.now() + 1 * 60 * 1000;
        res.status(200).json({ token, expirationTime });
    } catch (error) {
        console.log(error, 'error login');
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/firstName', async (req, res) => {
    const { email } = req.query;
    try {
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.status(200).json({ firstName: user.firstName });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

let port = 4000;

async function start() {
    try {
        await mongoose.connect('mongodb+srv://heyfey:Olakandeji7886@cardifypoject.nxleaep.mongodb.net/?retryWrites=true&w=majority&appName=CardifyPoject/signup');
        console.log('connected to db');
        app.listen(port, async () => {
            console.log('Server is running on ' + port);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
