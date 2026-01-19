const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = "1122"; 

// আপনার MongoDB লিঙ্ক এখানে দিন (পাসওয়ার্ডসহ)
const MONGO_URI = "mongodb+srv://prantosarkar0130_db_user:tepimim420@trial.1iz7hrg.mongodb.net/?appName=Trial"; 

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.error("❌ Connection Error:", err));

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: String, thumb: String, year: String, rating: String,
    category: String, genre: String, desc: String, watchUrl: String,
    seasons: Object, dateAdded: { type: Date, default: Date.now }
}));

// API Routes
app.get('/api/series', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ dateAdded: -1 });
        res.json(movies);
    } catch (err) { res.status(500).json({ error: "Failed" }); }
});

app.post('/api/series', async (req, res) => {
    const { password, data } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Wrong Password" });
    try {
        const newMovie = new Movie(data);
        await newMovie.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Save Error" }); }
});

app.delete('/api/series/:id', async (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// HTML Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/details', (req, res) => res.sendFile(path.join(__dirname, 'public', 'details.html')));
app.get('/series', (req, res) => res.sendFile(path.join(__dirname, 'public', 'series.html')));
app.get('/watch', (req, res) => res.sendFile(path.join(__dirname, 'public', 'watch.html')));


app.listen(PORT, () => console.log(`🚀 Live on Port: ${PORT}`));

