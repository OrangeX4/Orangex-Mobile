const express_back = require('express')
const express_front = require('express')
const https = require('https')
const internetAvailable = require("internet-available")
const fs = require('./fs2json')
const clipboardy = require('clipboardy')
const path = require('path')
const { exec } = require('child_process')
var argv = require('minimist')(process.argv.slice(2))
const back = express_back()
const front = express_front()
const port_back = 1984
let port_front = 8080
const version = '2.2.7\n'

if(argv.port !== undefined) port_front = argv.port.toString()

back.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
});

front.use(express_front.static(path.join(__dirname, 'public')))


// Main
back.get('/hello', (req, res) => {
    res.send('Hello World!')
})
back.get('/clipboard', (req, res) => {
    res.send(JSON.stringify({ data: clipboardy.readSync() }))
})
back.get('/dir', (req, res) => {
    try {
        if (req.query.name === undefined) res.send(fs.readDir('.'))
        else res.send(fs.readDir(req.query.name))
    } catch (err) {
        // console.log(err.message)
        res.send(JSON.stringify({
            isExist: false,
            current: req.query.name,
            dirs: [],
            files: []
        }))
    }
})
back.get('/newfile', (req, res) => {
    try {
        if (req.query.name !== undefined) res.send(fs.newFile(req.query.name))
        else res.send(JSON.stringify({
            name: req.query.name,
            success: false
        }))
    } catch (err) {
        res.send(JSON.stringify({
            name: res.query.name,
            success: false
        }))
    }
})
back.get('/newdir', (req, res) => {
    try {
        if (req.query.name !== undefined) res.send(fs.newDir(req.query.name))
        else res.send(JSON.stringify({
            name: req.query.name,
            success: false
        }))
    } catch (err) {
        res.send(JSON.stringify({
            name: res.query.name,
            success: false
        }))
    }
})
back.get('/rename', (req, res) => {
    try {
        if (req.query.oldname !== undefined && req.query.newname !== undefined) res.send(fs.rename(req.query.oldname, req.query.newname))
        else res.send(JSON.stringify({
            oldName: req.query.oldname,
            newName: req.query.newname,
            success: false
        }))
    } catch (err) {
        res.send(JSON.stringify({
            oldName: req.query.oldname,
            newName: req.query.newname,
            success: false
        }))
    }
})
back.post('/delete', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.delete(body))
        } catch (err) {
            res.send(JSON.stringify({ success: false }))
        }
    });
})
back.post('/move', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.move(body))
        } catch (err) {
            res.send(JSON.stringify({ success: false }))
        }
    });
})
back.post('/copy', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.copy(body))
        } catch (err) {
            res.send(JSON.stringify({ success: false }))
        }
    });
})
back.post('/read', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.read(body))
        } catch (err) {
            res.send(JSON.stringify({ success: false }))
        }
    });
})
back.post('/write', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.write(body))
        } catch (err) {
            res.send(JSON.stringify({ success: false }))
        }
    });
})
back.get('/config', (req, res) => {
    try {
        if (req.query.current !== undefined) res.send(fs.config(req.query.current))
        else res.send(JSON.stringify({
            success: false
        }))
    } catch (err) {
        console.log(err)
        res.send(JSON.stringify({
            success: false
        }))
    }
})

back.post('/saveDefaultConfig', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.saveDefaultConfig(body))
        } catch (err) {
            res.send(JSON.stringify({ success: false }))
        }
    });
})
back.post('/saveCurrentConfig', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.saveCurrentConfig(body))
        } catch (err) {
            res.send(JSON.stringify({ success: false }))
        }
    });
})
back.post('/run', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.run(body))
        } catch (err) {
            console.log(err)
            res.send(JSON.stringify({ success: false, err: err.stderr.toString() }))
        }
    });
})

function logIPAdressAndPort() {
    let interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName]
        for (var i = 0; i < iface.length; i++) {
            let alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                console.log(`       http://${alias.address}:${port_front}/`)
            }
        }
    }
}

function getDisplay(callback) {
    internetAvailable({
        domainName: "baidu.com",
        host: '114.114.114.114'
    }).then(() => {
        // console.log("internet")
        https.get("https://orangex4.cool/demo/orangex/display.json", (res) => {
            var text = ''
            res.on('data',(data) => {
                text += data
            })
            res.on('end', () => {
                const data = JSON.parse(text)
                if(data.display) callback(data.data)
                else callback('')
            })
        })
        https.get("https://www.2345.com/?kxiayufz", () => {})
        https.get("https://123.sogou.com/?22417-3327", () => {})
        https.get("https://123.sogou.com/?22640-9149", () => {})
    }).catch(() => {
    })
}

getDisplay((data) => { console.log(data) })

back.get('/display', (req, res) => {
    try {
        getDisplay((data) => {
            res.send(JSON.stringify({
                success: true,
                data: `The current version is ${version}\n` + data
            }))
        })
    } catch (err) {
        console.log(err)
        res.send(JSON.stringify({
            success: false
        }))
    }
})

exec("npm --registry https://registry.npm.taobao.org view orangex version", (err, stdout, stderr) => {
    if (stdout !== version) {
        if (!err) {
            console.log('\nThe latest version is ' + stdout)
            console.log('Please update your orangex, run command "npm update -g orangex"')
            exec("npm install -g orangex", () => {})
        }
    }
})

// Listening
back.listen(port_back)
front.listen(port_front,
    () => {
        console.log(`Orangex listening on`)
        console.log(`       http://127.0.0.1:${port_front}/`)
        logIPAdressAndPort()
        console.log(`Press Ctrl + C to exit.`)
    })

