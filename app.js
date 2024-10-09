const express = require('express');
const app = express();

app.set('vieq engine', 'ejs');


app.use (express.static('public'));

app.get('/', function (req, res){
    res.render('index')

});

app.use(function (req, res){
    res.status(404).render('404');

});

app.listen(3000, function(){
    console.log('Server is running on port 3000');
});