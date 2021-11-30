const express = require('express');
const path = require('path');
const app = express();

const PORT = 4000;
const PATH = './audios/';
const EXTENSION = '.mp3';

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/tts/:word', function (req, res) {
    
    let wordPath = PATH + req.params.word + EXTENSION;

    fs.stat(word, function(err, stat) {
        if(err == null) {

            // EXIST :
            res.send(wordPath);
            
        } else if(err.code === 'ENOENT') {
            tts_helper.download_word(req.params.word, wordPath)
            .then(response => {
                res.send(response)
            })
            .catch(error => {
                res.send(error)
            })
        } else {
            res.send(err)
        }
    });

    
    
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));