const fs = require('fs');
const path = require('path')

function getDB(fileName) {
    let dir = path.join(__dirname + "/../db", fileName + ".json")
    return new Promise((resolve, reject) => {
        fs.readFile(dir, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                resolve(null)
            }
            if (data) {
                let obj = JSON.parse(data)
                resolve(obj)
            } else {
                resolve(null)
            }
        })
    })
}
function setDB(fileName, file) {
    let dir = path.join(__dirname + "/../db", fileName + ".json")
    let newObj = JSON.stringify(file)
    fs.writeFile(dir, newObj, 'utf8', (err) => {
        console.log('写入成功', newObj)
    })
}

module.exports = {
    getDB,
    setDB
};