const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();

const Game = require('./src/game');
const Repository = require('./src/repository');

const port = 3000;
const repository = new Repository() ;

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('resources'));

app.post('/start', function(req, res){
    let game = new Game();
    repository.save(game);
    res.render('landing', { gameId: game.id });
});

app.get('/join', function(req, res){
    const gameId = req.query.gameId;
    const game = repository.load(gameId);
    const playerId = game.registerPlayer();
    res.render('round', { gameId: gameId, playerId: playerId });
});

app.post('/respond', function(req, res){
    const gameId = req.body.gameId;
    const playerId = req.body.playerId;
    const choice = req.body.choice;
    res.render('finish', { gameId: gameId, playerId: playerId, choice: choice });
});

app.listen(port, function(){
    console.log('listening on port', port);
});
