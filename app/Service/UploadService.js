'use strict';

const Helpers = use('Helpers');
const fs = require('fs');

class UploadService {

    async uploadFile(request) {

        const profilePic = request.file('image', { types: ['image'], size: '2mb', extname: ['jpg'] })

        let name = Date.now().toString();

        await profilePic.move(Helpers.publicPath(`files`), {
            name: name + '.jpg',
            overwrite: true
        })

        if (!profilePic.moved()) {
            return profilePic.error();
        }

        return name;

    }

}

module.exports = UploadService;