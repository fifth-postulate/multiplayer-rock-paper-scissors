const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();

const port = 3000;

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', './views');

app.use(express.static('resources'));

app.post('/start', function(req, res){
    res.render('landing', { id: 37 });
});

app.get('/join', function(req, res){
    console.log(req);
    res.render('round', { id: 37, round: 1 });
});

app.post('/respond', function(req, res){
    res.render('finish', {});
});

app.listen(port, function(){
    console.log('listening on port', port);
});
