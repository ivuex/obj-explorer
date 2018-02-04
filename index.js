class objNode {
    //构造函数中的oPath参数 不支持 中括号字符串 预引用变量, 如有需要可以不传， 在后面的oPath中以这种方式传入;
    constructor(oRoot,
                oPath = '',
                searchStr = '',
                sortSeq = 'value') {
        this.sortSeq = sortSeq;
        this.searchStr = searchStr;
        this.oRoot = oRoot;
        this.oPath = oPath;
        this.oPathAry = this.oPath ? this.oPath.split('.') : [];
        this.matchedByKeyMap = new Map();
        this.matchedByValueMap = new Map();
        this.oPathHistorySet = new Set();
    }

    genPathKeyAry(pathStr, ctx) {
        const resAry = [];
        if (!pathStr || typeof pathStr !== 'string') {
            return resAry;
        }
        else if (!/[\.\[\]]/.test(pathStr)) {
            resAry.push(pathStr);
        } else {
            const subRegSquareStr = `\\[([^\\].]+)]`;
            const subRegDotStr = `(?:^|\\.)([^\\[\\.]+)`;
            const reg = new RegExp(`(?:${subRegSquareStr}|${subRegDotStr})`, 'g');
            pathStr.replace(reg, (...args) => {
                let key;
                if (!(!!args[1] ^ !!args[2])) throw `args[1]和args[2]转化为boolean不应同真同假`;
                if (args[1]) {
                    try {
                        key = this.getValueByStrInContext(args[1], ctx);
                    } catch (e) {
                        key = undefined;
                    }
                } else if (args[2]) {
                    key = args[2]
                }
                resAry.push(key);
            });
        }
        return resAry;
    }

    getValueByStrInContext(exp, ctx) { //根据属性名字符串exp获取上下文ctx中的值
        return new Function(...Object.keys(ctx), `return ${exp}`)(...Object.values(ctx));
    }

    getValue(tailPath, ctx) {
        if (ctx == undefined) ctx = {};
        const tailPathKeyAry = this.genPathKeyAry(tailPath, ctx);
        const concatedPathKeyAry = [].concat(this.oPathAry).concat(tailPathKeyAry);
        if (concatedPathKeyAry.some(x => !x && x !== 0)) return this.oRoot;
        try {
            return concatedPathKeyAry.reduce((p, n) => {
                return p[n]
            }, this.oRoot);
        } catch (e) {
            return undefined;
        }
    }

    toLowerCase(str) {
        if (typeof str !== 'string') throw new Error(`argument[1] is not string.`);
        return str.toLowerCase();
    }

    recordByKey(path, value) {
        this.matchedByKeyMap.set(path, value);
    }

    recordByValue(path, value) {
        this.matchedByValueMap.set(path, value);
    }

    getType(o) {
        return /\[object (\w+)\]/.exec(({}).toString.call(o))[1];
    }

    checkStrIfMatch(str, subStr) {
        return new RegExp(subStr).test(str);
    }

    searchHistoryRecord(joinedKeyStr) {
        if (this.oPathHistorySet.has(joinedKeyStr)) {
            return void 0;
        } else {
            this.oPathHistorySet.add(joinedKeyStr);
        }
    }

    travelAry(tmpKeyAry, ary, searchStr) {
        ary.forEach((item, key) => {
            tmpKeyAry.push(key);
            this.search(searchStr, null,  tmpKeyAry, item);
            tmpKeyAry.pop();
        })
    }

    travelObj(tmpKeyAry, obj, searchStr) {
        const keys = Object.keys(obj);
        keys.forEach((key) => {
            const item = obj[key];
            tmpKeyAry.push(key);
            this.search(searchStr, null, tmpKeyAry, item);
            tmpKeyAry.pop();
        })
    }

    searchByValue(tmpKeyAry, item, searchStr) {
        const joinedTmpKey = tmpKeyAry.map(x => `[${x}]`).join('')
        this.searchHistoryRecord(joinedTmpKey);
        switch (this.getType(item)) {
            case 'String':
            case 'Number':
            case 'Boolean':
            case 'Null':
            case 'Undefined':
            case 'Symbol':
            case 'Map':
            case 'Set':
                if (this.checkStrIfMatch(item, searchStr)) {
                    this.matchedByValueMap.set(
                        joinedTmpKey,
                        item
                    );
                }
                break;
            case 'Array':
                this.travelAry(tmpKeyAry, item, searchStr);
                break;
            case 'Object':
                this.travelObj(tmpKeyAry, item, searchStr);
                break;
            case 'default':
                return void 0;
        }
    }

    searchByKey(tmpKeyAry, item, searchStr) {
        // console.log('method searchByKey executed, 142142');
        // console.log(arguments[2], 143143);
        // console.log(arguments.callee.caller, 144);
        const joinedTmpKey = tmpKeyAry.map(x => `[${x}]`).join('')
        if (this.checkStrIfMatch(joinedTmpKey, searchStr)) {
            console.log(joinedTmpKey, 148148);
            this.matchedByKeyMap.set(
                joinedTmpKey,
                item
            );
            // console.log(this.matchedByKeyMap, 153153);
        }
        this.searchHistoryRecord(joinedTmpKey);
        switch (this.getType(item)) {
            case 'Array':
                this.travelAry(tmpKeyAry, item, searchStr);
                break;
            case 'Object':
                this.travelObj(tmpKeyAry, item, searchStr);
                break;
        }
    }


    search(searchStr = this.searchStr, sortSeq = this.sortSeq, tmpKeyAry = this.oPathAry, item = this.getValue()) {
        if (searchStr == null) searchStr = this.searchStr;
        if (sortSeq == null) sortSeq = this.sortSeq;
        if (tmpKeyAry == null) tmpKeyAry = this.oPathAry;  //tmpKeyAry 可传入null占位
        if (item == null) item = this.getValue; //item 可传入null占位
        switch (sortSeq) {
            case 'key':
                this.searchByKey(tmpKeyAry, item, searchStr);
                break;
            case 'value':
            default:
                this.searchByValue(tmpKeyAry, item, searchStr);
                break;
        }
    }

    getOutputMatched() {
        let outputStr = ``;
        outputStr += '------------start---------------\n';
        outputStr += `Init path: ${this.oPath}\n`;
        outputStr += `Search string: ${this.searchStr}\n`;
        outputStr += 'By value:\n';
        this.matchedByValueMap.forEach(function (value, key) {
            outputStr += `  ${key}: ${value}\n`;
        });
        outputStr += '------------continue---------------\n';
        outputStr += 'By key:\n';
        this.matchedByKeyMap.forEach(function (value, key) {
            outputStr += `${key}: ${value}`;
        });
        outputStr += '------------continue---------------\n';
        outputStr += `Below path has been checked:\n`;
        this.oPathHistorySet.forEach(function (value) {
            outputStr += `  ${value}\n`;
        })
        outputStr += '------------end---------------\n';
        return outputStr;
    }
}

module.exports = {
    objNode
};
