const fs = require('fs');
const { resolve } = require('path');
const path = require('path')
const untils = require('../utils/index');

let today = untils.formatDay(new Date()); //获取今天的日期
console.log(today)

function getDB(fileName) {
    let dir = path.join(__dirname, fileName)
    return new Promise(resolve => {
        fs.readFile(dir, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            if (data[today]) {
                resolve(data)
            } else {
                resolve("{}")
            }
        })
    })
}
function setDB(fileName, newData) {
    let dir = path.join(__dirname, fileName)
    getDB(fileName).then(data => {
        let obj = JSON.parse(data)
        if (!obj[today]) {
            obj[today] = newData;
        } else {
            obj[today] = newData;
        }

        let newObj = JSON.stringify(obj)

        fs.writeFile(dir, newObj, 'utf8', (err) => {
            console.log('写入成功', err)
        })
    })
}

module.exports = {
    getDB,
    setDB
};