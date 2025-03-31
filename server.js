const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('recipes.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Create tables if they don't exist
        db.run(`CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ingredients TEXT NOT NULL,
            instructions TEXT NOT NULL,
            mood TEXT NOT NULL
        )`);

        // Insert some sample data if the table is empty
        db.get("SELECT COUNT(*) as count FROM recipes", [], (err, row) => {
            if (row.count === 0) {
                const sampleRecipes = [
                    {
                        name: "Comforting Mac and Cheese",
                        ingredients: "Macaroni, cheddar cheese, milk, butter, flour, salt, pepper",
                        instructions: "1. Cook macaroni\n2. Make cheese sauce\n3. Combine and bake",
                        mood: "sad"
                    },
                    {
                        name: "Energizing Smoothie Bowl",
                        ingredients: "Banana, berries, spinach, yogurt, granola, honey",
                        instructions: "1. Blend fruits and spinach\n2. Top with granola and honey",
                        mood: "tired"
                    },
                    {
                        name: "Spicy Thai Curry",
                        ingredients: "Coconut milk, curry paste, vegetables, tofu, rice",
                        instructions: "1. Cook curry paste\n2. Add coconut milk\n3. Add vegetables and tofu",
                        mood: "cold"
                    },
                    {
                        name: "Colorful Buddha Bowl",
                        ingredients: "Quinoa, avocado, cherry tomatoes, chickpeas, cucumber, tahini dressing",
                        instructions: "1. Cook quinoa\n2. Chop vegetables\n3. Arrange in bowl\n4. Drizzle with tahini dressing",
                        mood: "happy"
                    },
                    {
                        name: "Fresh Fruit Parfait",
                        ingredients: "Greek yogurt, mixed berries, granola, honey",
                        instructions: "1. Layer yogurt\n2. Add berries\n3. Top with granola and honey",
                        mood: "happy"
                    }
                ];

                const stmt = db.prepare("INSERT INTO recipes (name, ingredients, instructions, mood) VALUES (?, ?, ?, ?)");
                sampleRecipes.forEach(recipe => {
                    stmt.run(recipe.name, recipe.ingredients, recipe.instructions, recipe.mood);
                });
                stmt.finalize();
            }
        });
    }
});

// Routes
app.get('/api/recipe/:mood', (req, res) => {
    const mood = req.params.mood;
    db.all("SELECT * FROM recipes WHERE mood = ? ORDER BY RANDOM() LIMIT 1", [mood], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows[0]);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 