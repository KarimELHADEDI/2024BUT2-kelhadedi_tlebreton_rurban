const express = require('express');
const app = express();
const userModel = require("./models/user.js")
const session = require('express-session');
const db = require('./models/database.js');
const md5 = require('md5');

const checkAgentAdmin = (req, res, next) => {
    if (!req.session.userId || (req.session.type_utilisateur !== 'agent' && req.session.type_utilisateur !== 'admin')) {
        return res.redirect('/');
    }
    next();
};

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({
    secret: 'pamplemousse',
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static('public'));

app.use((req, res, next) => {
    res.locals.user = req.session.userId || null;
    res.locals.userType = req.session.type_utilisateur || null;
    next();
});

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

// Route vers la page catalogue classique (tous les produits)
app.get('/catalogue', function (req, res) {
    db.query('SELECT * FROM produit', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits :', err);
            return res.status(500).render('error', { message: 'Erreur interne. Veuillez réessayer plus tard.' });
        }

        res.render('catalogue', { 
            produits: results || [],
            user: req.session.userId || null,
            userType: req.session.type_utilisateur || null 
        });
    });
});

// Route vers la page de connexion, si connecté, redirige vers l'accueil
app.get('/login', function (req, res) {
    if (req.session.userId) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
});

// Route pour la page catalogue PAR TYPE DE MACHINE
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

// Route pour la page produit
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

// Route et paramètres pour le formulaire de login
app.post('/login', async function (req, res) {
    const login = req.body.login;
    const password = md5(req.body.password);

    try {
        const user = await userModel.checkLogin(login);
        if (user && user.password === password) {
            req.session.userId = user.id;
            req.session.type_utilisateur = user.type_utilisateur;
            return res.redirect('/');
        }
        res.render('login', { error: "Erreur dans le login/mot de passe" });
    } catch (err) {
        console.error('Erreur lors de la connexion :', err);
        res.status(500).send("Erreur serveur. Veuillez réessayer.");
    }
});

// Route pour la page de création de compte/register
app.get('/register', function (req, res) {
    res.render('register');
});

// Route pour la page de création d'agent (uniquement accessible par un admin)
app.get('/agentCrea', function (req, res) {
    res.render('agentCrea');
});

// Route vers la gestion de location (affiche les locations) EN CONSTRUCTION
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

// Route vers la gestion de location (formulaire, foreach récupération des locations, etc...) EN CONSTRUCTION
app.get('/gestionloc', function(req, res) {
    db.query(`
        SELECT 
            l.id as location_id,
            l.date_debut,
            l.date_fin,
            l.id_produit,
            p.id as produit_id,
            p.marque,
            p.modele,
            p.description,
            p.prix_location,
            p.etat
        FROM location l
        JOIN produit p ON l.id_produit = p.id
    `, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des données :', err);
            return res.status(500).send('Erreur serveur.');
        }
        console.log('Résultats:', results);

        res.render('gestionloc', { 
            produits: results,
            user: req.session.userId || null,
            userType: req.session.type_utilisateur || null 
        });
    });
});

// Route pour le panier
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

// Route pour la supression/validation/récupération d'une location EN CONSTRUCTION
app.post('/location/delete/:id', (req, res) => {
    const locationId = req.params.id;

    const deleteQuery = 'DELETE FROM location WHERE id = ?';
    db.query(deleteQuery, [locationId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de la location:', err);
            return res.status(500).send('Erreur serveur.');
        }
        res.redirect('/gestionloc');
    });
});

// Route pour le formulaire de création de compte/register
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

// Route pour la page de profil EN CONSTRUCTION
app.get('/profile', async function (req, res) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const user = await userModel.getUserById(req.session.userId);
        
        res.render('profile', { 
            user: user,
            error: null,
            message: null  // Ajout de message
        });
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).render('error', { 
            message: "Erreur lors du chargement du profil",
            error: true
        });
    }
});


// Route de suppression de compte utilisateur (impossible pour admin et agent) EN CONSTRUCTION
app.post('/user/delete/:id', async function(req, res) {
    try {
        const userId = req.params.id;
        
        if (req.session.userId != userId) {
            return res.render('profile', {
                user: await userModel.getUserById(req.session.userId),
                error: true,
                message: "Non autorisé"
            });
        }

        const hasRentals = await userModel.hasActiveRentals(userId);
        if (hasRentals) {
            return res.render('profile', {
                user: await userModel.getUserById(req.session.userId),
                error: true,
                message: "Impossible de supprimer le compte : vous avez des locations en cours"
            });
        }

        await db.query('DELETE FROM utilisateur WHERE id = ?', [userId]);
        req.session.destroy();
        res.redirect('/');
    } catch (err) {
        console.error('Erreur:', err);
        res.render('profile', {
            user: await userModel.getUserById(req.session.userId),
            error: true,
            message: "Erreur lors de la suppression du compte"
        });
    }
});

// Route pour la suppression d'un produit
app.post('/produit/delete/:id', checkAgentAdmin, async function(req, res) {
    try {
        const id = req.params.id;
        await db.query('DELETE FROM produit WHERE id = ?', [id]);
        res.redirect('/catalogue');
    } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        res.redirect('/catalogue');
    }
});

// Route vers la page d'ajout de produit (uniquement accessible par un admin et agent)
app.get('/productAdd', checkAgentAdmin, function(req, res) {
    res.render('productAdd');
});

// Route pour l'ajout d'un produit (forumlaire)
app.post('/productAdd', checkAgentAdmin, async function(req, res) {
    try {
        const produit = {
            type: req.body.type,
            description: req.body.description,
            marque: req.body.marque,
            modele: req.body.modele,
            prix_location: req.body.prix_location,
            etat: 'Disponible'
        };

        if (!produit.type || !produit.description || !produit.marque || 
            !produit.modele || !produit.prix_location) {
            return res.render('productAdd', { 
                error: "Tous les champs sont obligatoires" 
            });
        }

        await db.query('INSERT INTO produit SET ?', produit);

        res.redirect('/catalogue');

    } catch (err) {
        console.error("Erreur :", err);
        res.render('productAdd', { 
            error: "Erreur lors de l'ajout du produit" 
        });
    }
});


// Redirection vers la page 404 si la route n'existe pas
app.use(function (req, res) {
    res.status(404).render('404', {
        user: req.session.userId || null,
        userType: req.session.type_utilisateur || null
    });
});

// Lancement du serveur
app.listen(3000, function () {
    console.log('Server is running on port 3000');
});