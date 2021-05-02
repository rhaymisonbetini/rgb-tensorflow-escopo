'use strict'

const tf = require('@tensorflow/tfjs');
const WriteBrainService = use("App/Service/WriteBrainService");

class TensorFlowService {

    async prediction(tfPixels, brainType) {

        let writeBrainService = new WriteBrainService();
        let classification = await writeBrainService.readBrain(brainType);

        let diffence = [];
        let nameClass = [];

        for (var [key, classfy] of Object.entries(classification)) {
            const className = classfy.className.trim();
            const tfPixels2 = tf.tensor(classfy.pixels);
            const diference = tfPixels.sub(tfPixels2).abs().sum().arraySync();

            nameClass.push(className);
            diffence.push(diference);
        }


        let predict = await this.calculate(diffence, nameClass);
        return predict;

    }

    async calculate(diference, nameClass) {

        let less = tf.tensor(diference).min().arraySync();
        let plus = tf.tensor(diference).max().arraySync();

        let index = 0;

        for (let i = 0; i < diference.length; i++) {
            if (diference[i] == less) index = i;
        }

        const finalClassification = nameClass[index].toString().trim();
        return finalClassification;

    }

}

module.exports = TensorFlowService;