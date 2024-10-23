const express = require('express');
const app = express();
const userModel = require("./models/user_pg.js")
const http = require('http');

const session = require ('express-session');
const md5 = require('md5')

app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: false}));

app.use(session({
	secret:'pamplemousse',
	resave : false,
	saveUninitialized : false,
}));


app.use (express.static('public'));


app.get('/',  function (req, res) {
	res.render('index', {error : null});

});

app.get('/produit', function (req, res){
  res.render('produit');
})

app.get('/catalogue', function (req, res){
  res.render('catalogue');
})

app.get('/login', function (req, res) {
	res.render('login', {error : null});
});


app.post('/login', function (req,res) {
	const login = req.body.login;
	let mdp = req.body.password;
	
	const user = userModel.checkLogin(login);
	
	if (user != false && user.password == md5(mdp)){
		req.session.userId = user.id;
		req.session.role = user.type_utilisateur;
		return res.redirect("/");
	};
	res.render('login', {error : "Erreur dans le login/mdp"});
});


app.use(function (req, res){
  res.status(404).render('404');
});

app.listen(3000, function(){
    console.log('Server is running on port 3000');
});
