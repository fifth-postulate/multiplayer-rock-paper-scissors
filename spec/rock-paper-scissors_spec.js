const assert = require('chai').assert;

const Observable = require('../src/observable');
const Game = require('../src/game');

describe('In a game', function(){
    it('there could be observers', function(){
        const game = new Game();

        let assertion = game instanceof Observable;

        assert.isTrue(assertion);
    });

    it('an identifier is present', function(){
        const game = new Game();

        assert.exists(game.id);
    });

    describe('a player', function(){
        it('should have an identifier', function(){
            const game = new Game();

            const playerId = game.registerPlayer();

            assert.exists(playerId);
        });

        it('should have an unique identifier', function(){
            const game = new Game();

            const playerOneId = game.registerPlayer();
            const playerTwoId = game.registerPlayer();

            assert.notEqual(playerOneId, playerTwoId);
        });
    });

    describe('in a round', function(){
        let game, playerOneId, playerTwoId;

        beforeEach(function(){
            game = new Game();
            playerOneId = game.registerPlayer();
            playerTwoId = game.registerPlayer();
        });

        it('rock crushes scissors', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'scissors');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId]);
            assert.sameMembers(losers, [playerTwoId]);
        });

        it('scissors cuts paper', function(){
            game.pick(playerOneId, 'scissors');
            game.pick(playerTwoId, 'paper');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId]);
            assert.sameMembers(losers, [playerTwoId]);
        });

        it('paper wraps rock', function(){
            game.pick(playerOneId, 'paper');
            game.pick(playerTwoId, 'rock');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId]);
            assert.sameMembers(losers, [playerTwoId]);
        });

        it('same picks only knows winners', function(){
            game.pick(playerOneId, 'paper');
            game.pick(playerTwoId, 'paper');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId, playerTwoId]);
            assert.sameMembers(losers, []);
        });
    });

    describe('in a round with more than two players', function(){
        let game, playerOneId, playerTwoId, playerThreeId;

        beforeEach(function(){
            game = new Game();
            playerOneId = game.registerPlayer();
            playerTwoId = game.registerPlayer();
            playerThreeId = game.registerPlayer();
        });

        it('normal rules still apply, even when a minority', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'scissors');
            game.pick(playerThreeId, 'scissors');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId]);
            assert.sameMembers(losers, [playerTwoId, playerThreeId]);
        });

        it('normal rules still apply, even when a majority', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'scissors');
            game.pick(playerThreeId, 'rock');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId, playerThreeId]);
            assert.sameMembers(losers, [playerTwoId]);
        });

        it('ties should only know winners', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'paper');
            game.pick(playerThreeId, 'scissors');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId, playerTwoId, playerThreeId]);
            assert.sameMembers(losers, []);
        });

        it('winner is deduced by most points scored', function(){
            const playerFourId = game.registerPlayer();
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'paper');
            game.pick(playerThreeId, 'scissors');
            game.pick(playerFourId, 'rock');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerTwoId]);
            assert.sameMembers(losers, [playerOneId, playerThreeId, playerFourId]);
        });

        it('winner is deduced by most points scored, ties knows only winners', function(){
            const playerFourId = game.registerPlayer();
            const playerFiveId = game.registerPlayer();
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'paper');
            game.pick(playerThreeId, 'scissors');
            game.pick(playerFourId, 'rock');
            game.pick(playerFiveId, 'paper');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerTwoId, playerThreeId, playerFiveId]);
            assert.sameMembers(losers, [playerOneId, playerFourId]);
        });
    });

    describe('the following can be observed', function(){
        let game;

        beforeEach(function(){
            game = new Game();
        });

        it('registering a player', function(done){
            game.register(function(event){
                assert.hasAllKeys(event, ['gameId', 'playerId']);
                assert.equal(event.gameId, game.id);
                done();
            });

            game.registerPlayer();
        });

        it('registering a player', function(done){
            let playerId = game.registerPlayer();
            game.register(function(event){
                assert.hasAllKeys(event, ['gameId', 'playerId', 'choice']);
                assert.deepEqual(event, {
                    'gameId':  game.id,
                    'playerId': playerId,
                    'choice': 'rock'
                });
                done();
            });

            game.pick(playerId, 'rock');
        });
    });

    describe('the following are not happy flows', function(){
        let game, playerOneId;

        beforeEach(function(){
            game = new Game();
            playerOneId = game.registerPlayer();
        });

        it('register a player in a resolved game', function(){
            game.pick(playerOneId, 'rock');
            game.winners();

            var id = game.registerPlayer();

            assert.notExists(id);
        });

        it('pick an alternative in a resolved game', function(){
            playerTwoId = game.registerPlayer();
            playerThreeId = game.registerPlayer();
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'paper');
            const before = game.winners();

            game.pick(playerThreeId, 'paper');

            assert.sameMembers(game.winners(), before);
        });
    });
});
