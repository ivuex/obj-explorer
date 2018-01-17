class objNode {
    constructor(oRoot,
                oPath = '',
                searchStr = '',) {
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
            const subRegDotStr = `\\.([^\\[\\.]+)`;
            const subRegSquareStr = `\\[([^\\].]+)]`;
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
                    console.log(key, 202020);
                } else if (args[2]) {
                    key = args[2]
                }
                resAry.push(key);
            });
        }
        return resAry;
    }

    getValueByStrInContext(exp, ctx) { //根据属性名字符串exp获取上下文ctx中的值
        console.log(exp, `747474 index.js`);
        console.log(ctx, '757575 index.js');
        const fn = new Function(...Object.keys(ctx), `return ${exp}`)(...Object.values(ctx));
        console.log(1988, ctx);
        return new Function(...Object.keys(ctx), `return ${exp}`)(...Object.values(ctx));
    }

    getValue(tailPath, ctx) {
        const tailPathKeyAry = this.genPathKeyAry(tailPath, ctx);
        console.log(tailPathKeyAry, `535353 index.js`);
        const concatedPathKeyAry = [].concat(this.oPathAry).concat(tailPathKeyAry);
        console.log(concatedPathKeyAry, `565656 index.js`);
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

    handleByValue(tmpKeyAry = this.oPathAry, item = this.getValue()) {
        const joinedTmpKey = tmpKeyAry.map(x => `[${x}]`).join('')
        if (this.oPathHistorySet.has(joinedTmpKey)) {
            return void 0;
        } else {
            this.oPathHistorySet.add(joinedTmpKey);
        }
        switch (this.getType(item)) {
            case 'String':
            case 'Number':
            case 'Boolean':
            case 'Null':
            case 'Undefined':
            case 'Symbol':
            case 'Map':
            case 'Set':
                if (this.checkStrIfMatch(item, this.searchStr)) {
                    this.matchedByValueMap.set(
                        joinedTmpKey,
                        item
                    );
                }
                break;
            case 'Array':
                this.travelAry(tmpKeyAry, item);
                break;
            case 'Object':
                this.travelObj(tmpKeyAry, item);
                break;
            case 'default':
                return void 0;
        }
    }

    travelAry(tmpKeyAry, ary) {
        ary.forEach((item, key) => {
            tmpKeyAry.push(key);
            this.handleByValue(tmpKeyAry, item);
            tmpKeyAry.pop();
        })
    }

    travelObj(tmpKeyAry, obj) {
        const keys = Object.keys(obj);
        keys.forEach((key) => {
            const item = obj[key];
            tmpKeyAry.push(key);
            this.handleByValue(tmpKeyAry, item);
            tmpKeyAry.pop();
        })
    }

    getOutputMatched() {
        let outputStr = ``;
        outputStr += 'By value:\n';
        this.matchedByValueMap.forEach(function (value, key) {
            outputStr += `  ${key}: ${value}\n`;
        });
        outputStr += '----------------------------\n';
        outputStr += 'By key:\n';
        this.matchedByKeyMap.forEach(function (value, key) {
            outputStr += `${key}: ${value}`;
        });
        outputStr += '----------------------------\n';
        outputStr += `History Set:\n`;
        this.oPathHistorySet.forEach(function (value) {
        })
        return outputStr;
    }
}

module.exports = {
    objNode
};
