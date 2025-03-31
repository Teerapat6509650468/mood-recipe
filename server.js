const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const dbPath = 'recipes.db';

// Delete existing database file if it exists
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
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
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                // Insert sample data
                const sampleRecipes = [
                    // Sad mood recipes
                    {
                        name: "Comforting Mac and Cheese",
                        ingredients: "Macaroni, cheddar cheese, milk, butter, flour, salt, pepper, breadcrumbs",
                        instructions: "1. Cook macaroni\n2. Make cheese sauce with butter, flour, milk, and cheese\n3. Combine pasta and sauce\n4. Top with breadcrumbs and bake until golden",
                        mood: "sad"
                    },
                    {
                        name: "Chocolate Lava Cake",
                        ingredients: "Dark chocolate, butter, eggs, sugar, flour, vanilla extract, salt",
                        instructions: "1. Melt chocolate and butter\n2. Mix in eggs and sugar\n3. Fold in flour\n4. Bake until edges are set but center is gooey",
                        mood: "sad"
                    },
                    {
                        name: "Creamy Tomato Soup",
                        ingredients: "Tomatoes, cream, butter, onion, garlic, basil, salt, pepper",
                        instructions: "1. Sauté onions and garlic\n2. Add tomatoes and simmer\n3. Blend until smooth\n4. Add cream and season",
                        mood: "sad"
                    },
                    {
                        name: "Warm Apple Pie",
                        ingredients: "Apples, cinnamon, sugar, pie crust, butter, flour, lemon juice",
                        instructions: "1. Peel and slice apples\n2. Mix with sugar and spices\n3. Fill pie crust\n4. Bake until golden and bubbly",
                        mood: "sad"
                    },
                    // Tired mood recipes
                    {
                        name: "Energizing Smoothie Bowl",
                        ingredients: "Banana, berries, spinach, yogurt, granola, honey, chia seeds",
                        instructions: "1. Blend fruits and spinach\n2. Top with granola and honey\n3. Sprinkle chia seeds\n4. Add fresh berries",
                        mood: "tired"
                    },
                    {
                        name: "Green Power Bowl",
                        ingredients: "Quinoa, kale, avocado, edamame, cucumber, tahini dressing, pumpkin seeds",
                        instructions: "1. Cook quinoa\n2. Massage kale with olive oil\n3. Arrange bowl with all ingredients\n4. Drizzle with tahini dressing",
                        mood: "tired"
                    },
                    {
                        name: "Protein-Packed Breakfast Burrito",
                        ingredients: "Eggs, black beans, spinach, whole wheat tortilla, cheese, salsa",
                        instructions: "1. Scramble eggs with spinach\n2. Warm tortilla\n3. Fill with eggs and beans\n4. Top with cheese and salsa",
                        mood: "tired"
                    },
                    {
                        name: "Overnight Oats with Berries",
                        ingredients: "Oats, almond milk, chia seeds, honey, mixed berries, almonds",
                        instructions: "1. Mix oats with milk and chia\n2. Add honey and stir\n3. Refrigerate overnight\n4. Top with berries and almonds",
                        mood: "tired"
                    },
                    // Cold mood recipes
                    {
                        name: "Spicy Thai Curry",
                        ingredients: "Coconut milk, curry paste, vegetables, tofu, rice, lime, basil",
                        instructions: "1. Cook curry paste\n2. Add coconut milk\n3. Add vegetables and tofu\n4. Serve with rice and lime",
                        mood: "cold"
                    },
                    {
                        name: "Hot and Sour Soup",
                        ingredients: "Chicken broth, mushrooms, tofu, bamboo shoots, vinegar, chili oil",
                        instructions: "1. Heat broth\n2. Add mushrooms and bamboo\n3. Add tofu\n4. Season with vinegar and chili oil",
                        mood: "cold"
                    },
                    {
                        name: "Spicy Ramen Bowl",
                        ingredients: "Ramen noodles, spicy broth, egg, seaweed, green onions, chili oil",
                        instructions: "1. Cook noodles\n2. Prepare spicy broth\n3. Add toppings\n4. Drizzle with chili oil",
                        mood: "cold"
                    },
                    {
                        name: "Jalapeño Poppers",
                        ingredients: "Jalapeños, cream cheese, cheddar, bacon, breadcrumbs, spices",
                        instructions: "1. Hollow out jalapeños\n2. Fill with cheese mixture\n3. Top with breadcrumbs\n4. Bake until golden",
                        mood: "cold"
                    },
                    // Happy mood recipes
                    {
                        name: "Colorful Buddha Bowl",
                        ingredients: "Quinoa, avocado, cherry tomatoes, chickpeas, cucumber, tahini dressing",
                        instructions: "1. Cook quinoa\n2. Chop vegetables\n3. Arrange in bowl\n4. Drizzle with tahini dressing",
                        mood: "happy"
                    },
                    {
                        name: "Fresh Fruit Parfait",
                        ingredients: "Greek yogurt, mixed berries, granola, honey, mint leaves",
                        instructions: "1. Layer yogurt\n2. Add berries\n3. Top with granola and honey\n4. Garnish with mint",
                        mood: "happy"
                    },
                    {
                        name: "Rainbow Poke Bowl",
                        ingredients: "Sushi rice, raw fish, mango, avocado, cucumber, seaweed, sesame seeds",
                        instructions: "1. Cook sushi rice\n2. Arrange fish and vegetables\n3. Add toppings\n4. Drizzle with sauce",
                        mood: "happy"
                    },
                    {
                        name: "Mediterranean Platter",
                        ingredients: "Hummus, falafel, tabbouleh, olives, feta, pita bread",
                        instructions: "1. Arrange hummus in center\n2. Add falafel and tabbouleh\n3. Garnish with olives and feta\n4. Serve with warm pita",
                        mood: "happy"
                    }
                ];

                const stmt = db.prepare("INSERT INTO recipes (name, ingredients, instructions, mood) VALUES (?, ?, ?, ?)");
                sampleRecipes.forEach(recipe => {
                    stmt.run(recipe.name, recipe.ingredients, recipe.instructions, recipe.mood, (err) => {
                        if (err) {
                            console.error('Error inserting recipe:', err);
                        }
                    });
                });
                stmt.finalize();
            }
        });
    }
});

// Track last recipe shown for each mood
const lastRecipes = {
    sad: null,
    tired: null,
    cold: null,
    happy: null
};

// Routes
app.get('/api/recipe/:mood', (req, res) => {
    const mood = req.params.mood;
    const lastRecipe = lastRecipes[mood];
    
    // Query to get a random recipe that's not the last one shown
    const query = lastRecipe 
        ? "SELECT * FROM recipes WHERE mood = ? AND name != ? ORDER BY RANDOM() LIMIT 1"
        : "SELECT * FROM recipes WHERE mood = ? ORDER BY RANDOM() LIMIT 1";
    
    const params = lastRecipe ? [mood, lastRecipe] : [mood];
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (!rows || rows.length === 0) {
            res.status(404).json({ error: 'No recipe found for this mood' });
            return;
        }
        
        // Update last recipe shown
        lastRecipes[mood] = rows[0].name;
        res.json(rows[0]);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 