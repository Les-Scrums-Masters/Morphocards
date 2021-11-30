const http = require('http')
const fs = require('fs')
const googleTTS = require('google-tts-api');

module.exports = {

    /*
    ** This method downloads the file
    ** from the URL specified in the 
    ** parameters 
    */ 
    download_word : function(word, path) {

        try {

            let url = googleTTS.getAudioUrl(req.params.word, {
                lang: 'fr-FR',
                slow: false,
                host: 'https://translate.google.com',
            });
            
            return new Promise((resolve, reject) => {
                let file = fs.createWriteStream(path);
                http.get(url, function(response) {
                    response.on('data', function(chunk) {
                        file.write(chunk)
                    })
                    response.on('end', function() {
                        console.log('download file completed : ' + word);
                        resolve('File download completed.')
                    })
                })
            });

        } catch(err) {
            throw new Error(err);
        }
        
    }
}