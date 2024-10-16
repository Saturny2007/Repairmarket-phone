const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt'); // Pour hasher les mots de passe
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware pour servir les fichiers statiques et analyser les requêtes POST
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Créer ou ouvrir la base de données SQLite
const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
});

// Créer la table des utilisateurs si elle n'existe pas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`);
});

// Route pour gérer le formulaire de contact
app.post('/api/contact', (req, res) => {
    const { nom, email, sujet, message } = req.body;

    if (!nom || !email || !sujet || !message) {
        return res.status(400).send('Tous les champs sont requis');
    }

    const query = `INSERT INTO contacts (nom, email, sujet, message) VALUES (?, ?, ?, ?)`;
    db.run(query, [nom, email, sujet, message], function (err) {
        if (err) {
            return res.status(500).send('Erreur lors de l\'enregistrement du message');
        }

        res.json({ message: 'Merci, votre message a été envoyé avec succès.' });
    });
});


// Route pour gérer l'inscription
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
            res.status(500).send('Erreur de serveur');
        } else if (row) {
            res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
                if (err) {
                    res.status(500).send('Erreur lors de l\'inscription');
                } else {
                    res.json({ message: 'Inscription réussie !' });
                }
            });
        }
    });
});


// Route pour la connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            return res.status(500).send('Erreur lors de la recherche de l\'utilisateur');
        }

        if (!user) {
            return res.status(400).send('Email ou mot de passe incorrect');
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).send('Erreur lors de la vérification du mot de passe');
            }

            if (!result) {
                return res.status(400).send('Email ou mot de passe incorrect');
            }

            // Connexion réussie
            res.status(200).send({ message: 'Connexion réussie', redirect: '/' });
        });
    });
});

// Route pour récupérer les produits
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
