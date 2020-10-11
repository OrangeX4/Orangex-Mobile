const fs = require("fs")
const rimraf = require("rimraf")
const path = require("path")
const { exec, execSync } = require("child_process")

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

exports.move = (paras) => {
    props = JSON.parse(paras)
    props.dirs.forEach((dir) => {
        fs.rename(path.join(props.oldDir, dir), path.join(props.newDir, dir), (err) => {
            if (err) {
                copyFolder(path.join(props.oldDir, dir), path.join(props.newDir, dir))
                rimraf.sync(path.join(props.oldDir, dir))
            }
        })
    })
    props.files.forEach((file) => {
        fs.rename(path.join(props.oldDir, file), path.join(props.newDir, file), (err) => {
            if (err) {
                fs.copyFileSync(path.join(props.oldDir, file), path.join(props.newDir, file))
                fs.unlinkSync(path.join(props.oldDir, file))
            }
        })
    })
    return JSON.stringify({ success: true })
}

function copyFolder(copiedPath, resultPath) {

    if (fs.existsSync(copiedPath)) {
        fs.mkdirSync(resultPath)
        const files = fs.readdirSync(copiedPath, { withFileTypes: true });
        for (let i = 0; i < files.length; i++) {
            const cf = files[i]
            const ccp = path.join(copiedPath, cf.name)
            const crp = path.join(resultPath, cf.name)
            if (cf.isFile()) {
                const readStream = fs.createReadStream(ccp)
                const writeStream = fs.createWriteStream(crp)
                readStream.pipe(writeStream)
            } else {
                fs.accessSync(path.join(crp, '..'), fs.constants.W_OK)
                copyFolder(ccp, crp)
            }
        }
    } else {
        throw new Error()
    }
}


exports.copy = (paras) => {
    props = JSON.parse(paras)
    props.dirs.forEach((dir) => {
        copyFolder(path.join(props.oldDir, dir), path.join(props.newDir, dir))
    })
    props.files.forEach((file) => {
        fs.copyFileSync(path.join(props.oldDir, file), path.join(props.newDir, file))
    })
    return JSON.stringify({ success: true })
}


exports.read = (paras) => {
    props = JSON.parse(paras)
    return JSON.stringify({ success: true, data: (fs.readFileSync(props.path, props.option)).toString() })
}

exports.write = (paras) => {
    props = JSON.parse(paras)
    fs.writeFileSync(props.path, props.data, props.option)
    return JSON.stringify({ success: true })
}

exports.config = (current) => {
    retValue = {
        success: true,
        default: {
            default: [],
            defaultFile: {}
        },
        current: {
            current: [],
            currentFile: {}
        }
    }
    const USER_HOME = process.env.HOME || process.env.USERPROFILE
    const defaultDirPath = path.join(USER_HOME, '.orangex')
    const defaultPath = path.join(USER_HOME, '.orangex/default.json')
    const currentPath = path.join(current, '.orangex/current.json')

    if (!fs.existsSync(defaultPath)) {
        if (!fs.existsSync(defaultDirPath)) fs.mkdirSync(defaultDirPath)
        fs.copyFileSync(path.join(__dirname, 'command.json'), defaultPath)
    }
    retValue.default = JSON.parse(fs.readFileSync(defaultPath).toString())

    if (fs.existsSync(currentPath)) retValue.current = JSON.parse(fs.readFileSync(currentPath).toString())

    return JSON.stringify(retValue)
}

exports.saveDefaultConfig = (paras) => {
    props = JSON.parse(paras)
    const USER_HOME = process.env.HOME || process.env.USERPROFILE
    const defaultDirPath = path.join(USER_HOME, '.orangex')
    const defaultPath = path.join(USER_HOME, '.orangex/default.json')
    if (!fs.existsSync(defaultPath)) {
        if (!fs.existsSync(defaultDirPath)) fs.mkdirSync(defaultDirPath)
        fs.copyFileSync('./command.json', defaultPath)
    }
    fs.writeFileSync(defaultPath, props.data, props.option)
    return JSON.stringify({ success: true })
}
exports.saveCurrentConfig = (paras) => {
    props = JSON.parse(paras)
    const currentPath = path.join(props.current, '.orangex/current.json')
    const currentDirPath = path.join(props.current, '.orangex')
    if (!fs.existsSync(currentDirPath)) fs.mkdirSync(currentDirPath)
    fs.writeFileSync(currentPath, props.data, props.option)
    return JSON.stringify({ success: true })
}
exports.run = (paras) => {
    props = JSON.parse(paras)
    return JSON.stringify({ success: true , out: execSync(props.data, props.option).toString()})
}
