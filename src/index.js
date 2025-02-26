const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root path to login page
app.get("/", (req, res) => {
    res.redirect("/login");  
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        const username = req.body.username.trim();
        const password = req.body.password.trim();

        if (!username || !password) {
            return res.send("Username and Password are required!");
        }

        const existingUser = await collection.findOne({ username });

        if (existingUser) {
            return res.send("User already exists. Please choose a different username.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await collection.create({ username, password: hashedPassword });

        res.send("User registered successfully! Go and login again.");
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).send("Error signing up. Please try again.");
    }
});

app.post("/login", async (req, res) => {
    try {
        const username = req.body.username.trim();
        const password = req.body.password.trim();

        if (!username || !password) {
            return res.send("Username and Password are required!");
        }

        const user = await collection.findOne({ username });

        if (!user) {
            return res.send("User not found.");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            return res.render("home");  // Redirect to home page after successful login
        } else {
            return res.send("Wrong password.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Error processing request.");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
