var keys = require('./keys');
var Distribution = require('./distribution');
var difference = require('./difference');

function beats(a, b) {
    switch (a) {
    case 'rock':
        return 'scissors' === b;
    case 'scissors':
        return 'paper' === b;
    case 'paper':
        return 'rock' === b;
    default:
        return false;
    }
}

function beatenBy(choice) {
    switch (choice) {
    case 'rock':
        return 'paper';
    case 'scissors':
        return 'rock';
    case 'paper':
        return 'scissors';
    default:
        throw new Error('unknown choice: ' + choice);
    }
}


function resolve(groups, players) {
    const ks = keys(groups);
    let winners = [], losers = [];
    switch (ks.length) {
    case 1:
        winners = groups[ks[0]];
        break;
    case 2:
        let won, lost, [aPick, otherPick] = ks;
        if (beats(aPick, otherPick)) {
            won = aPick;
            lost = otherPick;
        } else {
            won = otherPick;
            lost = aPick;
        }
        winners = groups[won];
        break;
    case 3:
        const distribution = new Distribution(groups);
        if (distribution.allSame()) {
            winners = ks
                .map(function(k){ return groups[k]; })
                .reduce(function(acc, elements){ return acc.concat(elements); });
        } else {
            let { minorants, majorants } = distribution.minmax();
            winners = majorants
                .map(beatenBy)
                .map(function(choice){
                    return groups[choice];
                })
                .reduce(function(acc, elements){
                    return acc.concat(elements);
                }, []);
        }
        break;
    default:
        throw new Error('wrong number of keys in dictionary.');
    }
    losers = difference(players, winners);
    return {
        winners: winners,
        losers: losers
    };
};

module.exports = resolve;
