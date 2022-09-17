const fs = require('fs');
const path = require('path')

function getDB(fileName, objName) {
    let dir = path.join(__dirname + "/../db", fileName + ".json")
    return new Promise((resolve, reject) => {
        fs.readFile(dir, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                resolve(null)
            }
            if (data) {
                let obj = JSON.parse(data)
                if (objName) {
                    resolve(obj[objName] || null)
                }
                resolve(obj)
            } else {
                resolve(null)
            }
        })
    })
}
async function setDB(fileName, data, objName) {
    let dir = path.join(__dirname + "/../db", fileName + ".json")
    let newObj = JSON.stringify(data)
    if (objName) {
        let oldFile = await getDB(fileName)
        oldFile[objName] = data
        newObj = JSON.stringify(oldFile)
    }
    fs.writeFile(dir, newObj, 'utf8', (err) => {
        console.log('写入成功', newObj)
    })
}

module.exports = {
    getDB,
    setDB
};