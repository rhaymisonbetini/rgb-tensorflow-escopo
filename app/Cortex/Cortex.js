'use strict'

const tf = require('@tensorflow/tfjs');
const TensorFlowService = use("App/Service/TensorFlowService");
const WriteBrainService = use("App/Service/WriteBrainService");
const getColor = require('get-image-colors');
const path = require('path');
const Helpers = use('Helpers');

const brainType = 'rgbBrain.bin';

class Cortex {

    async train(className, limit) {

        let classifiation = {};

        for (let i = 0; i < className.length; i++) {

            const dir = Helpers.publicPath(`train/${className[i]}`);

            for (let k = 1; k <= limit; k++) {

                let index = k.toString();
                k <= 9 ? index = '0'.concat(index) : null;

                await getColor(path.join(dir, `${className[i]}${index}.jpg`)).then(async (colors) => {

                    let arrayColors = await this.returnRGBchanels(colors);
                    const objectClass = { className: className[i], pixels: arrayColors }
                    classifiation[k + Date.now()] = objectClass;
                })
            }
        }

        let writeBrainService = new WriteBrainService();
        await writeBrainService.writeBrain(classifiation, brainType)

        return classifiation;
    }

    async prediction(fileName) {

        let response;

        await getColor(path.join(Helpers.publicPath(`files/`), `${fileName}.jpg`)).then(async (colors) => {

            let arrayColors = await this.returnRGBchanels(colors);

            const tfPixels = tf.tensor(arrayColors);

            let tensorFlowService = new TensorFlowService();
            response = await tensorFlowService.prediction(tfPixels, brainType)

        })

        return response;

    }

    async returnRGBchanels(colors) {

        let arrayColors = [];

        for (let color = 0; color < colors.length; color++) {

            const rgb = colors[color]
                .css()
                .toString()
                .replace('rgb', '')
                .replace('(', '')
                .replace(')', '')

            const arrayRgb = rgb.split(',');

            arrayColors.push(Number(arrayRgb[0]))
            arrayColors.push(Number(arrayRgb[1]))
            arrayColors.push(Number(arrayRgb[2]))

        }
        return arrayColors;
    }

}

module.exports = Cortex;