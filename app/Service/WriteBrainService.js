'use strict';

const fs = require('fs');
const Helpers = use('Helpers');

class WriteBrainService {

    async writeBrain(classfication, brainType) {
        fs.writeFileSync(Helpers.publicPath(`brainfiles/${brainType}`), JSON.stringify(classfication));
        return;
    }

    async readBrain(fileName) {
        let classfication = fs.readFileSync((Helpers.publicPath(`brainfiles/${fileName}`, { encoding: 'utf8' })));
        return JSON.parse(classfication.toString().trim());
    }

}

module.exports = WriteBrainService;