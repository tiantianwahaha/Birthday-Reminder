# Birthday-Reminder
## 阴历生日自动提醒服务

**Lunar birthday reminder (GitHub Actions + server酱微信推送)**

**每天早上7点自动发微信提醒**

------

#### 1.Github配置
Settings-Secrets-New secret

**Name: PUSH_KEY**

Value: 你自己的 server 酱 SCKEY

**Name: DATA**

Value: 你自己的 生日数据 列表

注意，生日数据是json格式，要填写阴历生日，出生年份用来计算是几岁生日，例子如下：

```
{
    "birthday": [
        { "name": "张三", "birth": "1988-09-12" },
        { "name": "李四", "birth": "1999-10-01" }
    ]
}
```


