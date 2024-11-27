const express = require('express');
const app = express();
const userModel = require("./models/user.js");
const http = require('http');
const session = require('express-session');
const db = require('./models/database.js');
const md5 = require('md5')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({
    secret: 'pamplemousse',
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static('public'));


app.get('/', function (req, res) {
    res.render('index', { user: req.session.userId || null });
});

app.get('/logout', function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            return res.status(500).send("Erreur lors de la déconnexion");
        }
        res.redirect('/login');
    });
});



app.get('/catalogue', function (req, res) {
    db.query('SELECT * FROM produit', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits :', err);
            return res.status(500).render('error', { message: 'Erreur interne. Veuillez réessayer plus tard.' });
        }

        res.render('catalogue', { produits: results || [] });
    });
});


app.get('/login', function (req, res) {
    if (req.session.userId) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
});

app.post('/login', async function (req, res) {
    const login = req.body.login;
    const password = md5(req.body.password);

    try {
        const user = await userModel.checkLogin(login);
        if (user && user.password === password) {
            req.session.userId = user.id;
            req.session.role = user.type_utilisateur;
            return res.redirect('/');
        }
        res.render('login', { error: "Erreur dans le login/mot de passe" });
    } catch (err) {
        console.error('Erreur lors de la connexion :', err);
        res.status(500).send("Erreur serveur. Veuillez réessayer.");
    }
});



app.get('/gestion_locations', function (req, res) {
    const type = req.params.type;

    db.query('SELECT produit.id, produit.description, produit.marque, produit.prix_location, produit.etat FROM location INNER JOIN produit WHERE location.produit_id = produit.id', [type], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits par type:', err);
            return res.status(500).render('error', { message: 'Erreur interne. Veuillez réessayer plus tard.' });
        }

        res.render('gestionloc', { produits: results || [] });
    });
});



app.get('/catalogue/:type', function (req, res) {
    const type = req.params.type;

    db.query('SELECT * FROM produit WHERE type = ?', [type], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits par type:', err);
            return res.status(500).render('error', { message: 'Erreur interne. Veuillez réessayer plus tard.' });
        }

        res.render('catalogue', { produits: results || [] });
    });
});

app.get('/produit/:id', function (req, res) {
    const id = req.params.id;

    db.query('SELECT * FROM produit WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits par type:', err);
            return res.status(500).render('error', { message: 'Erreur interne. Veuillez réessayer plus tard.' });
        }
        res.render('produit', { produit: results[0] || [] });
    });
});


app.get('/register', function (req, res) {
    res.render('register');
});


app.get('/agentCrea', function (req, res) {
    res.render('agentCrea');
});

app.get('/panier', function (req, res) {
    const query = `
        SELECT location.*, produit.id AS produit_id 
        FROM location 
        JOIN produit ON location.produit_id = produit.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des données de location :', err);
            return res.status(500).render('404', { message: 'Erreur interne. Veuillez réessayer plus tard.' });
        }

        res.render('panier', { locations: results || [] });
    });
});



app.post('/register', async function (req, res) {
    console.log("Fonction register exécutée");

    const user = {
        login: req.body.username, password: md5(req.body.password), nom: req.body.lastname, prenom: req.body.firstname, ddn: req.body.birthdate, email: req.body.email, type_utilisateur: 'client'
    };

    try {
        const userId = await userModel.createUser(user);
        console.log(`Utilisateur créé avec l'ID : ${userId}`);
        res.redirect('/login');
    } catch (err) {
        console.error("Erreur dans POST /register :", err);
        res.status(500).render('register', {
            error: "Erreur lors de l'inscription",
            values: req.body
        });
    }
});

app.post('/agentCrea', async function (req, res) {
    console.log('Headers:', req.headers);
    console.log('Body brut:', req.body);

    const { login, password, lastname, firstname, birthdate, email } = req.body;

    if (!login || !password || !lastname || !firstname || !birthdate || !email) {
        console.error('Données manquantes:', { login, password, lastname, firstname, birthdate, email });
        return res.status(400).send("Tous les champs sont obligatoires");
    }

    try {
        const userData = {
            login: login,
            password: md5(password), nom: lastname, prenom: firstname, ddn: birthdate,
            email: email, type_utilisateur: 'agent'
        };

        console.log('Données à insérer:', userData);

        await userModel.createUser(userData);
        res.render('agentCrea', { message: 'Agent créé avec succès !' });
    } catch (err) {
        console.error('Erreur détaillée:', err);
        res.render('agentCrea', { message: "Erreur lors de la création de l'agent" });
    }
});


app.use(function (req, res) {
    res.status(404).render('404');
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});