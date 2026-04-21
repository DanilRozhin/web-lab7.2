const express = require('express');
const multer = require('multer');
const { PNG } = require('pngjs');
const mongoose = require('mongoose');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.urlencoded({ extended: true }));

const LOGIN = 'danilrozhin';

const UserSchema = new mongoose.Schema({
    login: String,
    password: String
});

const User = mongoose.model('User', UserSchema, 'users');

app.get('/login/', (req, res) => {
    res.send(LOGIN);
});

app.post('/insert/', async (req, res) => {
    try {
        const { login, password, URL } = req.body;

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        const user = new User({ login, password });
        await user.save();

        res.status(201).json({ 
            message: 'User inserted successfully',
            user: { login, password }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Database error',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
