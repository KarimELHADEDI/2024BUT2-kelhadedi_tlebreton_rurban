const express = require('express');
const app = express();
const userModel = require("./models/user.js")
const http = require('http');
const session = require('express-session');
const db = require('./models/database.js');
const md5 = require('md5')

// Configurer le moteur de vue
app.set('view engine', 'ejs');

// Middleware pour analyser les données du formulaire
app.use(express.urlencoded({ extended: false }));

// Configurer les sessions
app.use(session({
    secret: 'pamplemousse',
    resave: false,
    saveUninitialized: false,
}));

// Fichiers statiques
app.use(express.static('public'));

// Routes principales
app.get('/', function (req, res) {
    res.render('index', { error: null });
});

app.get('/produit', function (req, res) {
    res.render('produit');
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
    res.render('login', { error: null });
});

// Gestion de la connexion
app.post('/login', async function (req, res) {
    const login = req.body.login;
    const password = md5(req.body.password); // Hasher le mot de passe

    try {
        const user = await userModel.checkLogin(login);
        if (user && user.password === password) {
            // Stocker l'utilisateur dans la session
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


app.get('/register', function (req, res) {
    res.render('register');
});

// Gestion de l'inscription
app.post('/register', async function (req, res) {
    const { username, password, lastname, firstname, birthdate, email } = req.body;

    try {
        // Hasher le mot de passe
        const hashedPassword = md5(password);

        // Créer l'utilisateur dans la base de données
        await userModel.createUser({
            username,
            password: hashedPassword,
            lastname,
            firstname,
            birthdate,
            email
        });

        // Rediriger vers la page de connexion
        res.redirect('/login');
    } catch (err) {
        console.error('Erreur lors de l’inscription :', err);
        res.status(500).send("Erreur serveur. Veuillez réessayer.");
    }
});

// Gestion des pages non trouvées
app.use(function (req, res) {
    res.status(404).render('404');
});

// Démarrer le serveur
app.listen(3000, function () {
    console.log('Server is running on port 3000');
});

