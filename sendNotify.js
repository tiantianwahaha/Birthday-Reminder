const request = require("request");
//获得access_token
var base_url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?'
//发送消息
var req_url = 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token='
//企业ID
var corpid = process.env.CORPID
//Secret
var corpsecret = process.env.SECRET
//AgentId
var agentid = process.env.AGENTID

function get_access_token() {
    return new Promise(resolve => {
        const options = {
            url: base_url + 'corpid=' + corpid + '&corpsecret=' + corpsecret
        }
        request(options, function (error, response, data) {
            try {
                if (error) {
                    console.log('get_access_token失败！！')
                } else {
                    data = JSON.parse(data);
                    console.log(data.access_token)
                }
            }
            catch (error) {
                console.log(error)
            } finally {
                resolve(data.access_token)
            }
        });
    })
}

//参数说明https://open.work.weixin.qq.com/api/doc/90000/90135/90236
async function send2wx(title, description, usr = "@all") {
    const data = {
        "touser": usr,
        "toparty": "@all",
        "totag": "@all",
        "msgtype": "textcard",
        "agentid": agentid,
        "textcard": {
            "title": title,
            "description": description,
            "url": "URL",
        },
        "safe": 0,
        "enable_id_trans": 0,
        "enable_duplicate_check": 0,
        "duplicate_check_interval": 1800
    }
    const access_token = await get_access_token();
    return new Promise(resolve => {
        const options = {
            url: req_url + access_token,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        request.post(options, function (error, response, data) {
            try {
                if (error) {
                    console.log('发送通知调用API失败！！')
                } else {
                    data = JSON.parse(data);
                    console.log(data)
                }
            }
            catch (error) {
                console.log(error)
            } finally {
                resolve()
            }
        });
    })
}

module.exports = {
    send2wx
  }
