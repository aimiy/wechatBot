const fs = require('fs');
const path = require('path')
const untils = require('../utils/index');


function getDB(fileName) {
    let today = untils.formatDay(new Date()); //获取今天的日期
    let dir = path.join(__dirname, fileName)
    return new Promise(resolve => {
        fs.readFile(dir, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                rejects(err)
            }
            let obj = JSON.parse(data)
            if (obj[today]) {
                resolve(obj[today])
            } else {
                resolve({})
            }
        })
    })
}
function setDB(fileName, newData) {
    let dir = path.join(__dirname, fileName)
    let today = untils.formatDay(new Date()); //获取今天的日期
    fs.readFile(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            rejects(err)
        }
        let obj = JSON.parse(data)
        obj[today] = newData;

        let newObj = JSON.stringify(obj)
        fs.writeFile(dir, newObj, 'utf8', (err) => {
            console.log('写入成功', newObj)
        })
    })
}
// "不想上班第一人":9,"监视器&amp;罢工出题人":14,"宝瑞":7,"刘辣超":7,"3.141592653589793…":1,"2022-9-9日":{"不想上班第一人":9,"监视器&amp;罢工出题人":14,"宝瑞":7,"刘辣超":8,"3.141592653589793…":1}
module.exports = {
    getDB,
    setDB
};