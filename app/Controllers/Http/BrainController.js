'use strict'

const Cortex = use("App/Cortex/Cortex");
const UploadService = use("App/Service/UploadService");

const className = ['document', 'normal', 'porn', 'sexy'];
const limit = 15;

class BrainController {

    async train({ response }) {

        try {

            let cortex = new Cortex();
            let learned = await cortex.train(className, limit);
            if (learned) {
                return response.status(200).send({ message: 'LEARNED' })
            } else {
                return response.status(400).send({ message: 'BAD REQUEST' })
            }
        } catch (e) {
            console.log(e);
            return response.status(500).send(e)
        }

    }

    async predict({ request, response, }) {
        try {

            let uploadService = new UploadService();
            let fileName = await uploadService.uploadFile(request);

            let cortex = new Cortex();
            let predict = await cortex.prediction(fileName);
            return response.status(200).send(predict);
       
        } catch (e) {
            console.log(e);
            return response.status(500).send(e)
        }
    }

}

module.exports = BrainController
