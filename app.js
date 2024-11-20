const express = require('express');
const app = express();
const userModel = require("./models/user.js")
const http = require('http');
const session = require('express-session');
const db = require('./models/database.js');
const md5 = require('md5')

app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }));

app.use(session({
	secret: 'pamplemousse',
	resave: false,
	saveUninitialized: false,
}));


app.use(express.static('public'));


app.get('/', function (req, res) {
	res.render('index', { error: null });

});

app.get('/produit', function (req, res) {
	res.render('produit');
})

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


app.post('/login', function (req, res) {
	const login = req.body.login;
	let mdp = req.body.password;

	const user = userModel.checkLogin(login);

	if (user != false && user.password == md5(mdp)) {
		req.session.userId = user.id;
		req.session.role = user.type_utilisateur;
		return res.redirect("/");
	};
	res.render('login', { error: "Erreur dans le login/mdp" });
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
})

app.post('/register', function (req, res) {
	let username = req.body.username;
	let password = req.body.password;
	let lastname = req.body.lastname;
	let firstname = req.body.firstname;
	let birthdate = req.body.birthdate;
	let email = req.body.email;

	const user = userModel.createUser(username, password, lastname, firstname, birthdate, email);



	res.render('index');
})

app.use(function (req, res) {
	res.status(404).render('404');
});

app.listen(3000, function () {
	console.log('Server is running on port 3000');
});

