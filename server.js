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

// Créer la table des produits si elle n'existe pas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL
    )`);
});

// Ajouter des produits d'exemple (à exécuter une seule fois)
/*
 db.serialize(() => {
     const stmt = db.prepare("INSERT INTO revendre (name, image) VALUES (?, ?)");
     stmt.run("Produit 1", "url_de_l_image");
     stmt.run("Produit 2", "url_de_l_image");
     stmt.finalize();
 });
 */


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

app.get('/api/revendre', (req, res) => {
    db.all("SELECT * FROM revendre", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});