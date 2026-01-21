const express = require('express');
const mongoose = require('mongoose'); // Eta define kora thakte hobe
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = "1122"; 

// --- MongoDB Atlas Connection String ---
const MONGO_URI = "mongodb+srv://prantosarkar0130_db_user:tepimim420@trial.1iz7hrg.mongodb.net/?appName=Trial"; 

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Database Schema
const movieSchema = new mongoose.Schema({
    title: String, 
    thumb: String,
    langTag: { type: String, default: "" }, 
    year: String, 
    rating: String,
    category: String, 
    genre: String, 
    desc: String, 
    watchUrl: String, 
    seasons: { type: Object, default: {} }, 
    dateAdded: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', movieSchema);

// --- API ROUTES ---

// 1. Get All Movies/Series
app.get('/api/series', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ dateAdded: -1 });
        res.json(movies);
    } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
});

// 2. Add New Content (Movie or Series)
app.post('/api/series', async (req, res) => {
    const { password, data } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Wrong Password" });
    try {
        const newMovie = new Movie(data);
        await newMovie.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Save Error" }); }
});

// 3. Update Content (Adding new episodes/seasons)
app.put('/api/series/:id', async (req, res) => {
    const { password, data } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Wrong Password" });
    try {
        await Movie.findByIdAndUpdate(req.params.id, data);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Update Error" }); }
});

// 4. Delete Content
app.delete('/api/series/:id', async (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Delete Error" }); }
});

// Default Route to serve index.html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`🚀 Server running on: http://localhost:${PORT}`));