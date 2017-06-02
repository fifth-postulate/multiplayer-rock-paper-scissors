function keys(dictionary) {
    const keys = [];
    for (let k in dictionary) {
        if (dictionary.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    return keys;
}

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

function resolve(groups) {
    const ks = keys(groups);
    let winners = [], losers = [];
    switch (ks.length) {
    case 1:
        winners = groups[ks[0]];
        losers = [];
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
        losers = groups[lost];
        break;
    case 3:
        
        break;
    default:
        throw new Error('wrong number of keys in dictionary.');
    }
    return {
        winners: winners,
        losers: losers
    };
};

module.exports = resolve;
