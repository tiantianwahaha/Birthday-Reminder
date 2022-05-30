const notify = require('./sendNotify.js');
// 公共变量
let DATA = process.env.DATA;
DATA = JSON.parse(DATA);

var current_time = new Date((new Date()).toLocaleDateString())
var current_year = current_time.getFullYear();
//var current_month = current_time.getMonth() + 1;
//var current_day = current_time.getDate();

/*********************
main函数
*********************/

async function main() {
    for (let item of DATA.birthday) {
        let name = item.name;
        let birth = item.birth;
        let solar = lunar2solar(current_year, Number(birth.split('-')[1]), Number(birth.split('-')[2]));
        let how_old = current_year - Number(birth.split('-')[0]);
        let x = new Date(solar);
        if ((x - current_time) < 0) {
            continue;
        }
        else if (((x - current_time) / 86400000) < 4) {
            let days = Math.ceil((x - current_time) / 86400000);
            let text = `${current_time.toLocaleDateString()}有生日提醒`
            let desp = `${name}${x.toLocaleDateString()}(${days}天后)过${how_old}岁生日`
            console.log(text)
            await notify.send2wx(text, desp)
        }

    }
}

/*
***************************
参考zhdate.py  农历生日转换为当年的阳历生日
***************************
*/

/*
从1900年到2100年的农历月份数据代码 20位二进制代码表示一个年份的数据， 
前四位0:表示闰月为29天，1:表示闰月为30天
中间12位：从左起表示1-12月每月的大小，1为30天，0为29天
最后四位：表示闰月的月份，0表示当年无闰月
前四位和最后四位应该结合使用，如果最后四位为0，则不考虑前四位
例： 
1901年代码为 19168，转成二进制为 0b100101011100000, 最后四位为0，当年无闰月，月份数据为 010010101110 分别代表12月的大小情况
1903年代码为 21717，转成二进制为 0b101010011010101，最后四位为5，当年为闰五月，首四位为0，闰月为29天， 月份数据为 010101001101，分别代表12月的大小情况
*/
var CHINESEYEARCODE = [
    19416,
    19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632,
    21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944,
    44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968,
    109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984,
    92821, 23248, 11104, 100067, 37600, 116951, 51536, 54432,
    120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344,
    46423, 27808, 46416, 86869, 19872, 42416, 83315, 21168,
    43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352,
    21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152,
    42192, 54484, 53840, 54616, 46400, 46752, 103846, 38320,
    18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872,
    38256, 19189, 18800, 25776, 29859, 59984, 27480, 23232,
    43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034,
    22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780,
    44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060,
    27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005,
    54576, 23200, 30371, 38608, 19195, 19152, 42192, 118966,
    53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359,
    42160, 43600, 111189, 27936, 44448, 84835, 37744, 18936,
    18800, 25776, 92326, 59984, 27296, 108228, 43744, 37600,
    53987, 51552, 54615, 54432, 55888, 23893, 22176, 42704,
    21972, 21200, 43448, 43344, 46240, 46758, 44368, 21920,
    43940, 42416, 21168, 45683, 26928, 29495, 27296, 44368,
    84821, 19296, 42352, 21732, 53600, 59752, 54560, 55968,
    92838, 22224, 19168, 43476, 41680, 53584, 62034, 54560
]

/*
从1900年，至2100年每年的农历春节的公历日期
*/
var CHINESENEWYEAR = [
    '19000131',
    '19010219', '19020208', '19030129', '19040216', '19050204',
    '19060125', '19070213', '19080202', '19090122', '19100210',
    '19110130', '19120218', '19130206', '19140126', '19150214',
    '19160203', '19170123', '19180211', '19190201', '19200220',
    '19210208', '19220128', '19230216', '19240205', '19250124',
    '19260213', '19270202', '19280123', '19290210', '19300130',
    '19310217', '19320206', '19330126', '19340214', '19350204',
    '19360124', '19370211', '19380131', '19390219', '19400208',
    '19410127', '19420215', '19430205', '19440125', '19450213',
    '19460202', '19470122', '19480210', '19490129', '19500217',
    '19510206', '19520127', '19530214', '19540203', '19550124',
    '19560212', '19570131', '19580218', '19590208', '19600128',
    '19610215', '19620205', '19630125', '19640213', '19650202',
    '19660121', '19670209', '19680130', '19690217', '19700206',
    '19710127', '19720215', '19730203', '19740123', '19750211',
    '19760131', '19770218', '19780207', '19790128', '19800216',
    '19810205', '19820125', '19830213', '19840202', '19850220',
    '19860209', '19870129', '19880217', '19890206', '19900127',
    '19910215', '19920204', '19930123', '19940210', '19950131',
    '19960219', '19970207', '19980128', '19990216', '20000205',
    '20010124', '20020212', '20030201', '20040122', '20050209',
    '20060129', '20070218', '20080207', '20090126', '20100214',
    '20110203', '20120123', '20130210', '20140131', '20150219',
    '20160208', '20170128', '20180216', '20190205', '20200125',
    '20210212', '20220201', '20230122', '20240210', '20250129',
    '20260217', '20270206', '20280126', '20290213', '20300203',
    '20310123', '20320211', '20330131', '20340219', '20350208',
    '20360128', '20370215', '20380204', '20390124', '20400212',
    '20410201', '20420122', '20430210', '20440130', '20450217',
    '20460206', '20470126', '20480214', '20490202', '20500123',
    '20510211', '20520201', '20530219', '20540208', '20550128',
    '20560215', '20570204', '20580124', '20590212', '20600202',
    '20610121', '20620209', '20630129', '20640217', '20650205',
    '20660126', '20670214', '20680203', '20690123', '20700211',
    '20710131', '20720219', '20730207', '20740127', '20750215',
    '20760205', '20770124', '20780212', '20790202', '20800122',
    '20810209', '20820129', '20830217', '20840206', '20850126',
    '20860214', '20870203', '20880124', '20890210', '20900130',
    '20910218', '20920207', '20930127', '20940215', '20950205',
    '20960125', '20970212', '20980201', '20990121', '21000209'
]

function lunar2solar(lunar_year, lunar_month, lunar_day) {
    let days_passed = lunar_gap(lunar_year, lunar_month, lunar_day)
    let newyear = CHINESENEWYEAR[lunar_year - 1900]
    //var newyear_year = newyear.slice(0,4)
    let newyear_month = Number(newyear.slice(4, 6)) - 1
    let newyear_day = newyear.slice(6, 8)

    let myDate = new Date();
    myDate.setFullYear(lunar_year, newyear_month, newyear_day);
    myDate.setDate(myDate.getDate() + days_passed);
    let nowStr = myDate.toLocaleDateString();
    return nowStr
}


//计算当前农历日期和当年农历新年之间的天数差值
function lunar_gap(lunar_year, lunar_month, lunar_day, leap_month = false) {
    //var lunar_year = lunar_year
    //var lunar_month = lunar_month
    //var lunar_day = lunar_day
    var leap_month = leap_month
    var year_code = CHINESEYEARCODE[lunar_year - 1900]

    var month_days = decode(year_code)
    var month_leap = year_code & 0xf //2进制的低4位，当前农历年的闰月，为0表示无润月
    var days_passed_month = 0
    //当年无闰月，或者有闰月但是当前月小于闰月
    if ((month_leap == 0) || (lunar_month < month_leap)) {
        days_passed_month = sum(month_days.slice(0, lunar_month - 1))
    }
    //当前不是闰月，并且当前月份和闰月相同
    else if ((!leap_month) && (lunar_month == month_leap)) {
        days_passed_month = sum(month_days.slice(0, lunar_month - 1))
    }
    else {
        days_passed_month = sum(month_days.slice(0, lunar_month))
    }
    return days_passed_month + lunar_day - 1
}

function sum(arr) {
    var s = 0;
    for (var i = arr.length - 1; i >= 0; i--) {
        s += arr[i];
    }
    return s;
}


function decode(year_code) {
    //解析年度农历代码函数
    //当前年度代码解析以后形成的每月天数数组，已将闰月嵌入对应位置，即有闰月的年份返回长度为13，否则为12
    var month_days = new Array();
    for (var i = 5; i < 17; i++) {
        if ((year_code >> (i - 1)) & 1) {
            month_days.unshift(30)
        }
        else {
            month_days.unshift(29)
        }
    }
    if (year_code & 0xf) {
        if (year_code >> 16) {
            month_days.splice((year_code & 0xf), 0, 30)
        }
        else {
            month_days.splice((year_code & 0xf), 0, 29)
        }
    }
    return month_days
}


main()
