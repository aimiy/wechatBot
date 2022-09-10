// let infoLog =
//     { "不想上班第一人": 90, "监视器&amp;罢工出题人": 74, "刘辣超": 44, "全糖加冰变态辣党": 48, "皇马15冠之前不改名": 31, "被泰康整到窒息的小可爱，想被换掉": 14, "付文萍": 21, "3.141592653589793…": 13, "宝瑞": 4, "没有行动还想瘦回95斤的梦中人": 1 };

//     let keys = Object.keys(infoLog);
//     for (let i = 0; i < keys.length; i++) {
//       for (let j = 0; j < keys.length - 1 - i; j++) {
//         if (infoLog[keys[j]] < infoLog[keys[j + 1]]) {
//           let tempKey = keys[j + 1];
//           keys[j + 1] = keys[j]
//           keys[j] = tempKey;
//           console.log("交换")
//         }
//       }
//     }
//     let moyu = `\n今日摸鱼排行：\n`;
//     for (let key of keys) {
//       moyu += `@${key}：累计摸鱼${infoLog[key]}次!\n`
//     }
//     console.log(moyu)

    let content = "今日摸鱼排名"
    switch (true) {
        case "今日排名"==content:
        case "今日排行"==content:
        case /摸鱼/.test(content):
         console.log(4444)
          break;
      }