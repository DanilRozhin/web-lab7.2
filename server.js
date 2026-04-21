const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, ngrok-skip-browser-warning');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const LOGIN = 'danilrozhin';

app.get('/login/', (req, res) => {
    res.send(LOGIN);
});

app.post('/insert/', async (req, res) => {
    const { login, password, URL } = req.body;
    let client;
    
    try {
        if (!login || !password || !URL) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        
        client = new MongoClient(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        await client.connect();
        const db = client.db();
        await db.collection('users').insertOne({ login, password });
        
        res.status(201).json({ message: 'User inserted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) await client.close();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
