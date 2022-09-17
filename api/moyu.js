const db = require('./index')

const AddCount = async (data) => {
    let topic = data.topic;
    let date = data.date;
    let name = data.name;

    let chatStatistic = await db.getDB(topic, "chatStatistic");
    if (!chatStatistic) {
        chatStatistic = []
    }
    let index = chatStatistic.findIndex(item => item.name == name)
    if (index == -1) {
        chatStatistic.push(
            {
                "id": 0,
                "name": name,
                count: {}
            }
        )
        index = chatStatistic.length - 1
    }

    if (!chatStatistic[index].count) {
        chatStatistic[index].count = {}
    }
    let count = chatStatistic[index].count || {};
    if (!count[date]) {
        count[date] = 0
    }
    count[date] += 1;

    chatStatistic[index].count = count

    db.setDB(topic, chatStatistic, "chatStatistic")
}

const GetReplyInfo = async (data) => {
    let topic = data.topic;
    let date = data.date;

    let chatStatistic = await db.getDB(topic, "chatStatistic");
    [{
        "id": 0,
        "name": "不想上班第一人",
        "count": {
            "2022-9-15日": 0
        }
    },
    {
        "id": 0,
        "name": "123",
        "count": {
            "2022-9-15日": 1,
            "2022-9-18日": 4
        }
    }]

    for (let i = 0; i < chatStatistic.length; i++) {
        for (let j = 0; j < chatStatistic.length - 1 - i; j++) {
            let last = chatStatistic[j].count[date] || 0;
            let next = chatStatistic[j + 1].count[date] || 0;
            if (last < next) {
                let tempKey = next;
                chatStatistic[j + 1].count[date] = last
                chatStatistic[j].count[date] = tempKey;
            }
        }
    }
    console.log(chatStatistic)

    let reply = "";
    for (let item of chatStatistic) {
        if(item.count[date]){
            reply += `@${item.name}：累计摸鱼${item.count[date]}次!\n`
        }
    }
    return reply
}

module.exports = {
    AddCount,
    GetReplyInfo
};

// Update({topic:"紫月自律2",date:"2022-9-10",data:{"a":1}})