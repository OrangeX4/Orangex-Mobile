const fs = require("fs")
const rimraf = require("rimraf")
const path = require("path")

exports.readDir = (dirname) => {

    dirname = path.resolve(dirname)

    // console.log(dirname)

    retJson = {
        isExist: false,
        current: dirname,
        dirs: [],
        files: []
    }

    if (!fs.existsSync(dirname)) return retJson

    retJson.isExist = true
    files = fs.readdirSync(dirname)

    files.forEach(file => {
        stats = fs.statSync(path.join(dirname, file))
        if (stats.isDirectory()) {
            subfiles = fs.readdirSync(path.join(dirname, file))
            retJson.dirs.push({
                name: file,
                items: subfiles.length
            })
        } else {
            if (stats.size < 1024) sizeText = stats.size + ' Bytes'
            else if (stats.size < 1024 * 1024) sizeText = parseInt(stats.size / 1024) + ' KiB'
            else if (stats.size < 1024 * 1024 * 1024) sizeText = parseInt(stats.size / (1024 * 1024)) + ' MiB'
            else sizeText = parseInt(stats.size / (1024 * 1024 * 1024)) + ' GiB'
            retJson.files.push({
                name: file,
                size: stats.size,
                showSize: sizeText,
                lastTime: stats.mtime.toLocaleDateString()
            })
        }
    })

    return retJson
}

exports.newFile = (name) => {
    fs.closeSync(fs.openSync(name, 'a'))
    return JSON.stringify({ name: name, success: true })
}

exports.newDir = (name) => {
    fs.mkdirSync(name)
    return JSON.stringify({ name: name, success: true })
}

exports.rename = (oldName, newName) => {
    fs.renameSync(oldName, newName)
    return JSON.stringify({ oldName: oldName, newName: newName, success: true })
}

exports.delete = (paras) => {
    props = JSON.parse(paras)
    props.dirs.forEach((dir) => {
        rimraf.sync(path.join(props.current, dir))
    })
    props.files.forEach((file) => {
        fs.unlinkSync(path.join(props.current, file))
    })
    return JSON.stringify({ success: true })
}