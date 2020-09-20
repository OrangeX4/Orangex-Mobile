const express_back = require('express')
const express_front = require('express')
const fs = require('./fs2json')
const back = express_back()
const front = express_front()
const port_back = 1984
const port_front = 8080

back.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
  });

front.use(express_front.static('public'))

back.get('/hello', (req, res) => {
    res.send('Hello World!')
})

back.get("/dir", (req,res) => {
    if(req.query.dir == undefined) res.send(fs.readDir('/home'))
    else res.send(fs.readDir(req.query.dir))
});

back.listen(port_back)
front.listen(port_front, 
    () => console.log(
        `Finux listening on 127.0.0.1:${port_front}!`))