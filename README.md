# Birthday-Reminder
## 阴历生日自动提醒服务

**Lunar birthday reminder (GitHub Actions + 企业微信推送)**


**每天早上8点1分自动发微信提醒**

------

#### 1.Github配置
Settings-Secrets-New secret

**Name: CORPID**

Value: 你自己的企业微信 企业ID corpid 

**Name: SECRET**

Value: 你自己的企业微信corpsecret 

**Name: AGENTID**

Value: 你自己的企业微信agentid

**Name: DATA**

Value: 你自己的 生日数据 列表

注意，生日数据是json格式，要填写阴历生日（如果过阳历生日，增加flag这个属性），出生年份用来计算是几岁生日，例子如下：

```
{
    "birthday": [
        { "name": "张三", "flag":1,"birth": "1988-09-12" },
        { "name": "李四", "birth": "1999-10-01" }
    ]
}
```


