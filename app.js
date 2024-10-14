const express = require('express');
const app = express();
const userModel = require("./models/user.js")

app.set('view engine', 'ejs');


app.use (express.static('public'));


app.get('/', async function (req, res) {
  try {
    const user = await userModel.getUserById(2);
    console.log(user);
    res.render('index', {user});
  } catch (err) {
    console.log(err);
    res.status(500).send('Erreur lors de la récupération des données');
  }
});


app.use(function (req, res){
    res.status(404).render('404');

});

app.listen(3000, function(){
    console.log('Server is running on port 3000');
});