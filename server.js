const express = require('express');
const app = express();

const port = 3000;

app.use(express.static('resources'));

app.get('/hello', function(req, res){
    res.send('Hello, World!');
});

app.listen(port, function(){
    console.log('listening on port', port);
});