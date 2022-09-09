/**
 * WechatBot
 *  - https://github.com/gengchen528/wechatBot
 */
const { WechatyBuilder } = require('wechaty');
const schedule = require('./schedule/index');
const config = require('./config/index');
const untils = require('./utils/index');
const superagent = require('./superagent/index');
const db = require('./db/index')

// 延时函数，防止检测出类似机器人行为操作
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 二维码生成
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');

  console.log(qrcodeImageUrl);
}

// 登录
async function onLogin(user) {
  console.log(`贴心小助理${user}登录了`);
  const date = new Date()
  console.log(`当前容器时间:${date}`);
  if (config.AUTOREPLY) {
    console.log(`已开启机器人自动聊天模式`);
  }

  // 登陆后创建定时任务
  // await initDay();
}

// 登出
function onLogout(user) {
  console.log(`小助手${user} 已经登出`);
}
var infoLog = {
}
db.getDB("moyu.json").then(res => {
  console.log("读取数据库：",JSON.stringify(res))
  infoLog = res
})

// 监听对话
async function onMessage(msg) {
  const contact = msg.talker(); // 发消息人
  const content = msg.text().trim(); // 消息内容
  const room = msg.room(); // 是否是群消息
  const alias = await contact.alias() || await contact.name(); // 发消息人备注
  const name = await contact.name();
  const isText = msg.type() === bot.Message.Type.Text;

  let today = await untils.formatDate(new Date()); //获取今天的日期

  // if (msg.self()) {
  //   return;
  // }

  if (room && isText) {
    // 如果是群消息 目前只处理文字消息
    const topic = await room.topic();
    if (config.GROUP.findIndex(item => item == topic) > -1) {
      let roomAlias = await room.alias(contact)
      if (!roomAlias) {
        roomAlias = name;
      }
      console.log(`群名: ${topic} 发消息人: ${roomAlias}(${alias}) 内容: ${content}`);
      if (!infoLog[roomAlias]) {
        infoLog[roomAlias] = 1
      } else {
        infoLog[roomAlias] += 1
      }
      db.setDB("moyu.json", infoLog)
      // 如果开启自动聊天且已经指定了智能聊天的对象才开启机器人聊天\
      if (content) {
        if (content.substr(0, 2) == '三猫') {
          let contactContent = content.replace('三猫', '');
          if (contactContent) {
            let reply;
            if (config.DEFAULTBOT == '0') {
              // 天行聊天机器人逻辑
              reply = await superagent.getReply(contactContent);
              console.log('天行机器人回复：', reply);
            } else if (config.DEFAULTBOT == '1') {
              // 图灵聊天机器人
              reply = await superagent.getTuLingReply(contactContent);
              console.log('图灵机器人回复：', reply);
            } else if (config.DEFAULTBOT == '2') {
              // 天行对接的图灵聊
              reply = await superagent.getTXTLReply(contactContent);
              console.log('天行对接的图灵机器人回复：', reply);
            }
            try {
              await delay(2000);
              await room.say("：" + reply);
              infoLog[roomAlias] -= 1
            } catch (e) {
              console.error(e);
            }
          }
        } else {
          let huifu;
          switch (content) {
            case "今日排行":
              let sweetWord = await superagent.getSweetWord();
              let moyu = `${today}\n今日摸鱼排行：\n`;
              for (let key in infoLog) {
                moyu += `@${key}：累计摸鱼${infoLog[key]}次!\n\n`
              }
              moyu += sweetWord
              console.log(moyu)
              huifu = moyu;
              break;
          }
          if (huifu) {
            try {
              await delay(2000);
              await room.say("：" + huifu);
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    }
  }
  // else if (isText) {
  //   // 如果非群消息 目前只处理文字消息
  //   console.log(`发消息人: ${alias} 消息内容: ${content}`);
  //   if (content.substr(0, 1) == '?' || content.substr(0, 1) == '？') {
  //     let contactContent = content.replace('?', '').replace('？', '');
  //     if (contactContent) {
  //       let res = await superagent.getRubbishType(contactContent);
  //       await delay(2000);
  //       await contact.say(res);
  //     }
  //   } else if (config.AUTOREPLY && config.AUTOREPLYPERSON.indexOf(alias) > -1) {
  //     // 如果开启自动聊天且已经指定了智能聊天的对象才开启机器人聊天\
  //     if (content) {
  //       let reply;
  //       if (config.DEFAULTBOT == '0') {
  //         // 天行聊天机器人逻辑
  //         reply = await superagent.getReply(content);
  //         console.log('天行机器人回复：', reply);
  //       } else if (config.DEFAULTBOT == '1') {
  //         // 图灵聊天机器人
  //         reply = await superagent.getTuLingReply(content);
  //         console.log('图灵机器人回复：', reply);
  //       } else if (config.DEFAULTBOT == '2') {
  //         // 天行对接的图灵聊
  //         reply = await superagent.getTXTLReply(content);
  //         console.log('天行对接的图灵机器人回复：', reply);
  //       }
  //       try {
  //         await delay(2000);
  //         await contact.say(reply);
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     }
  //   }
  // }
}

// 创建微信每日说定时任务
async function initDay() {
  console.log(`已经设定每日说任务`);

  schedule.setSchedule(config.SENDDATE, async () => {
    console.log('你的贴心小助理开始工作啦！');
    let logMsg;
    let contact =
      (await bot.Contact.find({ name: config.NICKNAME })) ||
      (await bot.Contact.find({ alias: config.NAME })); // 获取你要发送的联系人
    let one = await superagent.getOne(); //获取每日一句
    let weather = await superagent.getTXweather(); //获取天气信息
    let today = await untils.formatDate(new Date()); //获取今天的日期
    let memorialDay = untils.getDay(config.MEMORIAL_DAY); //获取纪念日天数
    let sweetWord = await superagent.getSweetWord();

    // 你可以修改下面的 str 来自定义每日说的内容和格式
    // PS: 如果需要插入 emoji(表情), 可访问 "https://getemoji.com/" 复制插入
    let str = `${today}\n今日天气\n${weather.weatherTips}\n${weather.todayWeather}\n每日一句:\n${one}\n\n每日土味情话：\n${sweetWord}\n\n`;
    try {
      logMsg = str;
      await delay(2000);
      await contact.say(str); // 发送消息
    } catch (e) {
      logMsg = e.message;
    }
    console.log(logMsg);
  });
}

const bot = WechatyBuilder.build({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat', // 如果有token，记得更换对应的puppet
  puppetOptions: {
    uos: true
  }
})

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);

bot
  .start()
  .then(() => console.log('开始登陆微信'))
  .catch((e) => console.error(e));
