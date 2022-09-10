const db = require('./index')

const Update = async (data) => {
    let topic = data.topic;
    let date = data.date;
    let newData = data.data;

    let file = await db.getDB(topic);
    if (!file) {
        file = {}
    }
    file[date] = newData;

    db.setDB(topic, file)
}

const Get = async (data) => {
    let topic = data.topic;
    let date = data.date;

    let file = await db.getDB(topic);
    if (!file) {
        db.setDB(topic, null)
        return null;
    }
    let oldData = file[date];
    return oldData
}

module.exports = {
    Get,
    Update
};
// Get({topic:"紫月自律1",date:"2022-9-10",data:{"a":1}})
// Update({topic:"紫月自律2",date:"2022-9-10",data:{"a":1}})