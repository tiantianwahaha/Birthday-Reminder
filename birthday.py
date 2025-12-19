# -*- codeing = utf-8 -*-
from zhdate import ZhDate
import datetime
import requests
import json
import os


#DATA = [{ "name": "张三", "solar":1,"birth": "1988-09-12" },{ "name": "李四", "birth": "1999-10-09" }]
corpid=os.environ["CORPID"]
corpsecret=os.environ["SECRET"]
agentid=os.environ["AGENTID"]
DATA = os.environ["DATA"]

current_time = datetime.date.today()
current_year = datetime.date.today().year


class WXPusher:
    def __init__(self, corpid, corpsecret, agentid, title, description):
        # 获得access_token
        self.base_url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?'
        # 发送消息
        self.req_url = 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token='
        # 企业ID
        self.corpid = corpid
        # Secret
        self.corpsecret = corpsecret
        # AgentId
        self.agentid = agentid
        self.usr = "@all"
        self.title = title
        self.description = description

    def get_access_token(self):
        urls = self.base_url + 'corpid=' + self.corpid + '&corpsecret=' + self.corpsecret
        resp = requests.get(urls).json()
        access_token = resp['access_token']
        return access_token

    def send_message(self):
        req_urls = self.req_url + self.get_access_token()
        data = self.get_message()
        res = requests.post(url=req_urls, data=data)
        # print(res.text)

    def get_message(self):
        data = {
            "touser": self.usr,
            "toparty": "@all",
            "totag": "@all",
            "msgtype": "textcard",
            "agentid": self.agentid,
            "textcard": {
                "title": self.title,
                "description": self.description,
                "url": "www.baidu.com"
            },
            "safe": 0,
            "enable_id_trans": 0,
            "enable_duplicate_check": 0,
            "duplicate_check_interval": 1800
        }
        data = json.dumps(data)
        return data

def main():
    for item in eval(DATA):
        name = item["name"]
        birth = item["birth"]
        year, month, day = birth.split('-')
        year = int(year)
        month = int(month)
        day= int(day)
        how_old = current_year - year
        # 记录的是阳历生日
        if "solar" in item:
            result = datetime.date(current_year, month, day)
        # 记录的是阴历生日
        else:
            lunar = ZhDate(current_year, month, day)
            result=ZhDate.to_datetime(lunar).date()
        #判断是否要过生日了
        flag = (result - current_time).days
        print(flag)
        if (flag < 0):
            # print("生日已经过了：{}".format(item))
            continue
        elif (flag <= 3):
            titl = "{}有生日提醒".format(current_time)
            desp = "{}{}({}天后)过{}岁生日".format(name,result,flag,how_old)
            send = WXPusher(corpid=corpid, corpsecret=corpsecret , agentid=agentid, title=titl, description=desp)
            send.send_message()
        #else:
            # print("还不到生日：{}".format(item))

if __name__ == '__main__':
    main()

