const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

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
    repository.save(game, function(error){
        if (error) { /* TODO handle error while saving */ }
        res.render('landing', { gameId: game.id });
    });
});

app.get('/join', function(req, res){
    const gameId = req.query.gameId;
    repository.load(gameId, function(error, game){
        if (error) { /* TODO handle error while registering player */ }
        const playerId = game.registerPlayer();
        res.render('round', { gameId: gameId, playerId: playerId });
    });
});

app.post('/respond', function(req, res){
    const gameId = req.body.gameId;
    const playerId = req.body.playerId;
    const choice = req.body.choice;
    repository.load(gameId, function(error, game){
        if (error) { /* TODO handle error while player responding */ }
        game.pick(playerId, choice);
        res.render('finish', { gameId: gameId, playerId: playerId, choice: choice });
    });
});

app.post('/resolve', function(req, res){
    const gameId = req.query.gameId;
    repository.load(gameId, function(error, game){
        if (error) { /* TODO handle error while resolving game */ }
        game.resolve();
        res.status(200).send(game.id);
        res.end();
    });
});

http.listen(port, function(){
    console.log('listening on port', port);
});

const playerSockets = {};
io.on('connection', function(socket){
    console.log('connection established');

    socket.on('admin', function(data){
        const gameId = data.gameId;
        const game = repository.load(gameId, function(error, game){
            if (error) { /* TODO handle error while admin registers */ }
            game.register(function(event){
                console.log(event);
                socket.emit('event', event);
                if (event.type === 'resolution') {
                    const winners = game.winners();
                    if (winners.length > 1) {
                        const nextGame = new Game();
                        nextGame.register(function(event){
                            console.log(event);
                            socket.emit('event', event);
                        });
                        repository.save(nextGame, function(error){
                            if (error) { /* TODO handle error while saving */}
                            socket.emit('event', { gameId: nextGame.id });
                            winners.forEach(function(playerId){
                                let socket = playerSockets[playerId];
                                socket.emit('gameId', { gameId: nextGame.id });
                            });
                       });
                    }
                }
            });
        });
    });

    socket.on('player', function(data){
        const playerId = data.playerId;
        socket.playerId = playerId;
        playerSockets[socket.playerId] = socket;
        const gameId = data.gameId;
        const game = repository.load(gameId, function(error, game){
            if (error) { /* TODO handle error while registering finished player */ }
            game.register(function(event){
                if (event.type === 'resolution'){
                    let winners = game.winners();
                    if (winners.indexOf(playerId) >= 0) { // player won
                        socket.emit('message', { message: 'You won!' });
                    } else { // player lost
                        socket.emit('message', { message: 'You lost :-('});
                    }
                }
            });
        });
    });

    socket.on('disconnect', function(){
        console.log('socket disconnected');
        if (socket.playerId) {
            delete playerSockets[socket.playerId];
        }
    });
});
