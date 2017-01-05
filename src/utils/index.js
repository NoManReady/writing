/**
 * 返回指定时间格式
 * @param  {string} value 时间串
 * @param  {string} fmt   时间格式
 * @return {string}       指定时间格式字符串
 */
export function timeFormat(value, fmt = 'yyyy-MM-dd') {
    let date = new Date(value);
    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**
 * 获取字符串真实长度
 * @param  {string} str 给定字符串
 * @return {int}     字符串长度
 */
export function getRealLength(str) {
    let realLength = 0;
    let strLen = str.length;
    str.split('').forEach((s, i) => {
        let char = s.charAt(0);
        if (isSingleChar(char)) {
            realLength++;
        } else {
            realLength += 2;
        }
    });
    return realLength;
}

/**
 * 获取指定长度的字符串
 * @param  {string} str   初始字符串
 * @param  {int} size  截取字符串长度
 * @return {object}       截取字符串及当前字符串索引对象
 */
export function getStringByLength(str, size) {
    let len = 0,
        cursor = 0,
        returnString = [];
    while (len < size && cursor < str.length) {
        let char = str.charAt(cursor);
        returnString.push(char);
        if (isSingleChar(char)) {
            len++;
        } else {
            len += 2;
        }
        cursor++;
    }
    return {
        content: returnString.join(''),
        cursor: cursor
    };
}

/**
 * 判断是否为单字符
 * @param  {string}  char 判断字符串
 * @return {Boolean}      是否为单字符
 */
function isSingleChar(char) {
    let code = char.charCodeAt(0);
    return code >= 0 && code <= 128;
}

/**
 * 设置localstorage
 * @param  {string} key     key
 * @param  {any} options value
 * @return {null}         [description]
 */
export function setItem(key, options) {
    if (typeof(options) === 'object') {
        options = JSON.stringify(options);
    }
    window.localStorage.setItem(key, options);
}

/**
 *获取localstorage
 * @param  {string} key     key
 * @return {any}         value
 */
export function getItem(key) {
    let item = window.localStorage.getItem(key) || JSON.stringify(null);
    try {
        return JSON.parse(item);
    } catch (e) {
        return item;
    }
}

/**
 * 编码html
 * @param  {string} s 输入字符串
 * @return {string}   输出字符串
 */
export function encodeHtml(s) {
    if (s.length == 0) return "";
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/\s/g, "&nbsp;");
    return s;
}

/**
 * 解码html
 * @param  {string} s 输入字符串
 * @return {string}   输出字符串
 */
export function decodeHtml(s) {
    if (s.length == 0) return "";
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
}
