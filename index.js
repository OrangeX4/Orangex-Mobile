const express = require('express')
const fs = require('./fs2json')
const app = express()
const port = 1984

app.use(express.static('public'))

app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

app.get("/dir", (req,res) => {
    if(req.query.dir == undefined) res.send(fs.readDir('/home'))
    else res.send(fs.readDir(req.query.dir))
});

app.listen(port, 
    () => console.log(
        `Finux listening on port ${port}!`))