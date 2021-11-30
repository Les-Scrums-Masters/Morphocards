const express = require('express');
const googleTTS = require('google-tts-api');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/tts/:word', function (req, res) {
    let url = googleTTS.getAudioUrl(req.params.word, {
        lang: 'fr-FR',
        slow: false,
        host: 'https://translate.google.com',
      });
    
    res.download(url);
});

app.listen(4000);