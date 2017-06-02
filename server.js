const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();

const Game = require('./src/game');

const port = 3000;

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', './views');

app.use(express.static('resources'));

app.post('/start', function(req, res){
    let game = new Game();
    res.render('landing', { id: game.id });
});

app.get('/join', function(req, res){
    const gameId = req.query.id;
    // TODO retrieve game and register player
    res.render('round', { id: gameId, round: 1 });
});

app.post('/respond', function(req, res){
    res.render('finish', {});
});

app.listen(port, function(){
    console.log('listening on port', port);
});
