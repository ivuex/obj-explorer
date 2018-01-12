class objNode {
    constructor(oRoot,
                oPath='',
                searchStr='',) {
        this.searchStr = searchStr;
        this.oRoot = oRoot;
        this.oPath = oPath;
        this.oPathAry = this.oPath.split('.');
        this.oPathTempKeyAry = this.oPathAry;
        this.oPathTempKey = this.oPathTempKeyAry.map(x => `[${x}]`).join('');
        this.oPathTempValue = this.oPathTempKeyAry.length ? this.getValue(this.oPathAry) : this.oRoot;
        this.matchedByKeyMap = new Map();
        this.matchedByValueMap = new Map();
        this.oPathHistorySet = new Set();
    }

    getValue(pathAry = this.oPathTempKeyAry) {
        if(pathAry.some(x=>!x)) return this.oRoot;
        try {
            return pathAry.reduce((p, n) => {
                return p[n]
            }, this.oRoot);
        } catch (e) {
            return undefined;
        }
    }

    oPathTempUpdate(subKey) {
        if(subKey || subKey === 0) this.oPathTempKeyAry.push(subKey);
        this.oPathTempKey = this.oPathTempKeyAry.map(x => `[${x}]`).join('')
        console.log(this.oPathTempKey, 313131);
        this.oPathTempValue = this.getValue(this.oPathTempKeyAry);
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

    handleByValue() {
        if(this.oPathHistorySet.has(this.oPathTempKey)){
            return void 0;
        }else{
            this.oPathHistorySet.add(this.oPathTempKey);
        }
        switch (this.getType(this.oPathTempValue)) {
            case 'String':
            case 'Number':
            case 'Boolean':
            case 'Null':
            case 'Undefined':
            case 'Symbol':
            case 'Map':
            case 'Set':
                if (this.checkStrIfMatch(this.oPathTempValue, this.searchStr)) {
                    this.matchedByValueMap.set(
                        this.oPathTempKey,
                        this.oPathTempValue
                    );
                }
                break;
            // this.oPathTempKeyAry = this.oPathAry; //将this.oPathTempKeyAry还原到初始状态
            // 触碰到一个叶节点之后是不是有栈的方式来回到上衣层或者那一层更合适，这个要好好想一想。
            // 还要考虑如何开始下一个节点处理周期
            case 'Array':
                this.travelAry(this.oPathTempValue);
                break;
            case 'Object':
                this.travelObj(this.oPathTempValue);
                break;
            case 'default':
                return void 0;
        }
        this.oPathTempKeyAry.pop();
        this.oPathTempUpdate();
    }

    travelAry(ary) {
        console.log(ary, 83, '838383');
        console.log(this.oPathTempKeyAry, 939393);
        ary.forEach((item, key) => {
            console.log(this.oPathTempKeyAry, 949494);
            this.oPathTempUpdate(key);
            console.log(this.oPathTempKeyAry, 959595);
            console.log(this.oPathHistorySet, 969696);
            this.handleByValue();
            // this.oPathTempKeyAry.pop();
            // this.oPathTempUpdate();
        })
    }

    travelObj(obj) {
        console.log(obj, 94, '949494');
        const keys = Object.keys(obj);
        keys.forEach((key) => {
            this.oPathTempUpdate(key);
            this.handleByValue();
            // this.oPathTempKeyAry.pop();
            // this.oPathTempUpdate();
        })
    }
    //
    // search() {
    //     const keys = Object.keys(this.oRoot);
    //     keys.forEach((oRootkey) => {
    //         const oRootProp = this.oRoot[oRootkey];
    //         this.handleByValue();
    //     });
    // }

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
        // console.log(outputStr);
        return outputStr;
    }
}

module.exports = objNode;
