const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));
app.use(express.json());

// Créer ou ouvrir la base de données SQLite
const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
});

// Créer les tables si elles n'existent pas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`);
});

// Route pour récupérer les produits
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

// Route d'inscription
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;

    console.log('Email:', email);  // Ajoutez ceci pour voir ce qui est récupéré
    console.log('Mot de Passe:', password);  // Ajoutez ceci pour voir ce qui est récupéré

    // Vérifier si l'utilisateur existe déjà
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            console.error('Erreur lors de la recherche de l\'utilisateur:', err);
            return res.status(500).send('Erreur lors de la recherche de l\'utilisateur');
        }

        if (user) {
            return res.status(400).send('L\'email est déjà utilisé');
        }

        // Insérer l'utilisateur dans la base de données
        db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, password], function(err) {
            if (err) {
                console.error('Erreur lors de l\'insertion de l\'utilisateur:', err);
                return res.status(500).send('Erreur lors de l\'inscription');
            }

            // Inscription réussie
            res.status(201).send({ message: 'Inscription réussie' });
        });
    });
});

// Route pour la connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            return res.status(500).send('Erreur lors de la recherche de l\'utilisateur');
        }

        // Vérifiez si l'utilisateur existe
        if (!user) {
            return res.status(400).send('Email ou mot de passe incorrect');
        }

        // Vérification simple du mot de passe
        if (user.password !== password) {
            return res.status(400).send('Email ou mot de passe incorrect');
        }

        // Connexion réussie
        res.status(200).send({ message: 'Connexion réussie', redirect: '/' });
    });
});

// Route pour récupérer les produits à revendre
app.get('/api/revendre', (req, res) => {
    db.all("SELECT * FROM revendre", [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
