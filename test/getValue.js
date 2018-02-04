const {
    objNode
} = require('..');
const assert = require('simple-assert');
const eql = require('deep-eql');
const expect = require('chai').expect;
const filterObj = require('filter-obj');

const aSet = new Set([66, 88]);
const bMap = new Map([
    ['a', 993],
    ['b', 'lkdsfj'],
    ['c', {
        x: 22,
    }]
]);
const obj = {
    newFeature: {
        set: aSet,
        map: bMap,
    },
    0: {7: 3},
    100: {a: 1},
    s: 'abc',
    a: {
        ary: [0, 1],
        obj: {a: 1, b: 2},
    },
    b: [
        'fklsdj8ff88',
        {
            a: 1,
            b2: 'bbbbb',
            a2: [
                'ffccf',
                'cfffbff',
            ]
        },
        '66ffsdlkfj',
        333,
        [
            'fsskldffcc',
            'fkkdsjffdd',
            'dksjffffccc',
            'ccc'
        ]
    ],
    c: {
        a: [1, 2, 3],
        b: {
            d: 5,
            e: 6,
            f: 'ffff',
        }
    },
    d: {
        a: 'af8ff',
        b: '99fff',
        c: 'gffffc',
    },
    e: {
        x: {
            a: {
                x: 1,
                y: 2,
            },
            b: {
                x: [
                    1,
                    {m: 6}
                ],
                y: {a: 3, b: 4},
            },
            c: 'hello1',
            d: 1666,
        },
        y: 'zzz',
    },
    f: {
        ff1: 'lskdjf',
        gff: 332,
        fcff: [1, 2],
        fj: {
            ff0: 'dslfj',
            ff6: [12, 223],
            ccf: {
                abcff: {a: 1, b: 2},
                // zff:
            }
        }
    }
};

describe('测试方法： search, searchByValue', () => {
    it('测试search不传参, 使用构造函数中的初始值(传入"value"作为排序依据sortseq), 执行 testByValueInstance1.search() 后 testByValueInstance1.matchedByValueMap 是否与预期一致', () => {
        const testByValueInstance1 = new objNode(obj, 'd', 'ff', 'value');
        testByValueInstance1.search();
        assert(eql(
            testByValueInstance1.matchedByValueMap,
            new Map([
                ['[d][a]', 'af8ff'],
                ['[d][b]', '99fff'],
                ['[d][c]', 'gffffc'],
            ])
        ), '测试search不传参, 使用构造函数中的初始值(为), 执行 testByValueInstance1.search() 后 testByValueInstance1.matchedByValueMap 是否与预期一致');
    });

    it('测试search不传参, 使用构造函数中的初始值(不为sortSeq传值，将使用"value"作为默认的排序依据sortseq), 执行 testByValueInstance2.search() 后 testByValueInstance2.matchedByValueMap 是否与预期一致', () => {
        const testByValueInstance2 = new objNode(obj, 'b', 'ff');
        testByValueInstance2.search();
        assert(eql(
            testByValueInstance2.matchedByValueMap,
            new Map([
                ['[b][0]', 'fklsdj8ff88'],
                ['[b][1][a2][0]', 'ffccf'],
                ['[b][1][a2][1]', 'cfffbff'],
                ['[b][2]', '66ffsdlkfj'],
                ['[b][4][0]', 'fsskldffcc'],
                ['[b][4][1]', 'fkkdsjffdd'],
                ['[b][4][2]', 'dksjffffccc']
            ])
        ), '测试search不传参, 使用构造函数中的初始值, 执行 testByValueInstance2.search() 后 testByValueInstance2.matchedByValueMap 是否与预期一致');
    });

    it('测试search不传参, 使用构造函数中的初始值(不为sortSeq传值，将使用"value"作为默认的排序依据sortseq), 执行 testByValueInstance2.search() 后 testByValueInstance2.matchedByValueMap 是否与预期一致', () => {
        const testByValueInstance2 = new objNode(obj, 'b', 'ff', 'value');
        testByValueInstance2.search();
        assert(eql(
            testByValueInstance2.matchedByValueMap,
            new Map([
                ['[b][0]', 'fklsdj8ff88'],
                ['[b][1][a2][0]', 'ffccf'],
                ['[b][1][a2][1]', 'cfffbff'],
                ['[b][2]', '66ffsdlkfj'],
                ['[b][4][0]', 'fsskldffcc'],
                ['[b][4][1]', 'fkkdsjffdd'],
                ['[b][4][2]', 'dksjffffccc']
            ])
        ), '测试search不传参, 使用构造函数中的初始值, 执行 testByValueInstance2.search() 后 testByValueInstance2.matchedByValueMap 是否与预期一致');
    });
});


describe('测试方法： search, searchByKey', () => {
    it('测试search不传参, 使用构造函数中的初始值(传入"key"作为排序依据sortSeq), 执行 testByKeyInstance1.search() 后 testByKeyInstance1.matchedByKeyMap 是否与预期一致', () => {
        const testByKeyInstance1 = new objNode(obj, 'f', 'ff', 'key');
        testByKeyInstance1.search();
        assert(eql(
            testByKeyInstance1.matchedByKeyMap,
            new Map([
                ['[f][ff1]', 'lskdjf'],
                ['[f][gff]', 332],
                ['[f][fcff]', [1, 2]],
                ['[f][fcff][0]', 1],
                ['[f][fcff][1]', 2],
                ['[f][fj][ff0]', 'dslfj'],
                ['[f][fj][ff6]', [12, 223]],
                ['[f][fj][ff6][0]', 12],
                ['[f][fj][ff6][1]', 223],
                ['[f][fj][ccf][abcff]', {a: 1, b: 2}],
                ['[f][fj][ccf][abcff][a]', 1],
                ['[f][fj][ccf][abcff][b]', 2]
            ])
        ), '测试search不传参, 使用构造函数中的初始值(为), 执行 testByValueInstance1.search() 后 testByValueInstance1.matchedByValueMap 是否与预期一致');
    })
});

describe('new一个实例instance=new objNode(obj), 测试方法search， 分别传入searchStr, sortSeq, 看实例的matchedByValueMap 和(或) matchedByKeyMap 是否于预期一致', () => {
    const instance = new objNode(obj);
    //
    // it('只向方法search传入字符串"ff"作为参数searchStr, 其它参数不传', () => {
    //     instance.search('ff');
    //     assert(eql(
    //         instance.matchedByValueMap,
    //         new Map([
    //             ['[b][0]', 'fklsdj8ff88'],
    //             ['[b][1][a2][0]', 'ffccf'],
    //             ['[b][1][a2][1]', 'cfffbff'],
    //             ['[b][2]', '66ffsdlkfj'],
    //             ['[b][4][0]', 'fsskldffcc'],
    //             ['[b][4][1]', 'fkkdsjffdd'],
    //             ['[b][4][2]', 'dksjffffccc'],
    //             ['[c][b][f]', 'ffff'],
    //             ['[d][a]', 'af8ff'],
    //             ['[d][b]', '99fff'],
    //             ['[d][c]', 'gffffc']
    //         ])
    //     ), '只向方法search传入字符串"ff"作为参数searchStr, 其它参数不传')
    // });
    //
    // it('只向方法search传入字符串"ff"作为参数searchStr, 字符串"value"作为sortSeq, 其它参数不传', () => {
    //     instance.search('ff', 'value');
    //     assert(eql(
    //         instance.matchedByValueMap,
    //         new Map([
    //             ['[b][0]', 'fklsdj8ff88'],
    //             ['[b][1][a2][0]', 'ffccf'],
    //             ['[b][1][a2][1]', 'cfffbff'],
    //             ['[b][2]', '66ffsdlkfj'],
    //             ['[b][4][0]', 'fsskldffcc'],
    //             ['[b][4][1]', 'fkkdsjffdd'],
    //             ['[b][4][2]', 'dksjffffccc'],
    //             ['[c][b][f]', 'ffff'],
    //             ['[d][a]', 'af8ff'],
    //             ['[d][b]', '99fff'],
    //             ['[d][c]', 'gffffc']
    //         ])
    //     ), '只向方法search传入字符串"ff"作为参数searchStr, 字符串"value"作为sortSeq, 其它参数不传')
    // });

    it('只向方法search传入字符串"ff"作为参数searchStr, 字符串"key"作为sortSeq, 其它参数不传', () => {
        instance.search('ff', 'key');
        // console.log( instance.matchedByKeyMap, 213213 );
        // console.log(instance.oPathHistorySet, 214214);
        console.log(instance.matchedByKeyMap, 153153);
        console.log( instance.matchedByKeyMap, 215215 );
        console.log(instance.oPathHistorySet, 214214);
        assert(eql(
            instance.matchedByKeyMap,
            new Map([
                ['[f][ff1]', 'lskdjf'],
                ['[f][gff]', 332],
                ['[f][fcff]', [1, 2]],
                ['[f][fcff][0]', 1],
                ['[f][fcff][1]', 2],
                ['[f][fj][ff0]', 'dslfj'],
                ['[f][fj][ff6]', [12, 223]],
                ['[f][fj][ff6][0]', 12],
                ['[f][fj][ff6][1]', 223],
                ['[f][fj][ccf][abcff]', {a: 1, b: 2}],
                ['[f][fj][ccf][abcff][a]', 1],
                ['[f][fj][ccf][abcff][b]', 2]
            ])
        ), '只向方法search传入字符串"ff"作为参数searchStr, 字符串"key"作为sortSeq, 其它参数不传')
    });
});

describe('测试"filter-obj"', () => {
    it('get exist property of the obj must return right value.', () => {
        assert(
            eql(
                filterObj(obj, ['100']),
                {
                    100: {a: 1}
                }
            ),
            `filterObj(obj, ['100']), {a: 1}`
        );
    })
});

describe('测试 方法genPathKeyAry方法 和 方法getValue', () => {
    const t1 = new objNode(obj);
    const ctx = {
        k0: '0'
    };

    it('t1.genPathKeyAry("[1].az[k0]")应该返回[1, "az", "0"]', () => {
        assert(eql(
            t1.genPathKeyAry('[1].az[k0]', ctx), //仅仅测试 方法genPathKeyAry
            [1, "az", "0"]
        ), 't1.genPathKeyAry("[1].az[k0]")应该返回[1, "az", "0"]');
    });

    it('t1.getValue("a.obj") 应该递归等于 {a: 1, b: 2}', () => {
        assert(eql(
            t1.getValue("a.obj", ctx), //点路径表示法
            {a: 1, b: 2}
        ), 't1.getValue("a.obj", ctx) 应该递归等于 {a: 1, b: 2}')
    });

    it('t1.getValue("[k0]") 应该递归等于 {7: 3}', () => {
        assert(eql(
            t1.getValue("[k0]", ctx), //一次使用 方括号数字字符串路径表示法
            {'7': 3}
        ), 't1.getValue("[k0]", ctx) 应该递归等于 {7: 3}')
    });

    it('t1.getValue("a[`obj`]") 应该递归等于 {a: 1, b: 2}', () => {
        assert(eql(
            t1.getValue("a[`obj`]", ctx), //一次使用 方括号字符串路径表示法
            {a: 1, b: 2}
        ), 't1.getValue("a[`obj`]", ctx) 应该递归等于 {a: 1, b: 2}')
    });

    it('const ctx1 = {k1: "obj"}; t1.getValue("a[k1], ctx1") 应该递归等于 {a: 1, b: 2}', () => {
        const ctx1 = {k1: "obj"};
        assert(eql(
            t1.getValue("a[k1]", ctx1), //一次使用 方括号字符串引用变量路径表示法
            {a: 1, b: 2}
            ),
            'const ctx1 = {k1: "obj"}; t1.getValue("a[k1], ctx1") 应该递归等于 {a: 1, b: 2}'
        )
    });

    it('const ctx1 = {k1: "obj", k2: "a"}; t1.getValue("a[k1][k2], ctx1") 应该递归等于 {a: 1, b: 2}', () => {
        const ctx1 = {k1: "obj", k2: "a"};
        assert(eql(
            t1.getValue("a[k1][k2]", ctx1), //两次使用 方括号字符串引用变量路径表示法
            1
            ),
            'const ctx1 = {k1: "obj", k2: "a"}; t1.getValue("a[k1][k2]", ctx1) 应该等于 1'
        )
    });

    it('const ctx1 = {k1: "obj", k2: "a"}; t1.getValue("a[k1].a, ctx1") 应该等于 1', () => {
        const ctx1 = {k1: "obj"};
        assert(eql(
            t1.getValue("a[k1].a", ctx1), //混用 方括号路径表示法 和 点路径表示法
            1
            ),
            'const ctx1 = {k1: "obj"}; t1.getValue("a[k1].a", ctx1) 应该等于 1'
        )
    });
});

describe('根据对象点表示法，获取对应的值的测试', () => {
    it(`new objNode(obj, 'a').getValue() 应该递归等于{ ary: [0, 1], obj: {a: 1, b: 2}, }`, () => {
        const t1 = new objNode(obj, 'a');
        const resValue = t1.getValue();
        assert(
            eql(resValue, {
                ary: [0, 1],
                obj: {a: 1, b: 2},
            }),
            `eql(filterObj(t1.getValue()), { ary: [0, 1], obj: {a: 1, b: 2}, })`,
        )
    });
});

describe('当构造函数中的 路径参数 和 被搜索字符串参数 不传或者非严格等于false 的测试', () => {
    it(`不传路径参数 和 被搜索字符串`, () => {
        const t1 = new objNode(obj);
        const resValue = t1.getValue();
        assert(eql(resValue, obj), `eql(new objNode(obj).getValue(), obj)`);
    });
    it(`传入路径参数 不传入被搜索字符串`, () => {
        const t1 = new objNode(obj, 's');
        const resValue = t1.getValue();
        assert(eql(resValue, 'abc'), `eql(new objNode(obj).getValue(), 'abc'`);
    });
    it(`传入null作为路径参数 并传入被搜索字符串参数`, () => {
        const t1 = new objNode(obj, null, 'ff');
        const resValue = t1.getValue();
        assert(eql(resValue, obj), `eql(new objNode(obj).getValue(), obj)`);
    });
    it(`传入空字符串作为路径参数 并传入被搜索字符串参数`, () => {
        const t1 = new objNode(obj, '', 'ff');
        const resValue = t1.getValue();
        assert(eql(resValue, obj), `eql(new objNode(obj).getValue(), obj)`);
    });
});

describe('传入"e.x"作为构造函数中的路径字符串，并在方法getValue中传入字符串作为后面的路径字符串参数， 获得以obj为上下文,路径为以上两个路径字符串组合后的路径，并测试获取到的对应的值。', () => {
    const t1 = new objNode(obj, 'e.x');
    it(`向实例t1的方法getValue中传入路径"a"作为参数，并测试是否获得正确的值`,
        () => {
            assert(
                eql(
                    t1.getValue('a'),
                    {
                        x: 1,
                        y: 2,
                    }
                ),
                `eql( t1.getValue('a'), { x: 1, y: 2, } )`
            );
        }
    );

    it(`向实例t1的方法getValue中传入路径"b.x"作为参数，并测试是否获得正确的值`,
        () => {
            assert(
                eql(
                    t1.getValue('b.x'),
                    [
                        1,
                        {m: 6}
                    ]
                ),
                `eql( t1.getValue('b.x'), [ 1, {m: 6} ] )`
            );
        }
    );

    it(`向实例t1的方法getValue中传入路径"b.x[1]"作为参数，并测试是否获得正确的值`,
        () => {
            assert(
                eql(
                    t1.getValue('b.x[1]'),
                    {m: 6}
                ),
                `eql( t1.getValue('b.x'), {m: 6})`
            );
        }
    );
});

describe('测试字符串outputStr', () => {
    //测试方法searchByValue
    const t1 = new objNode(obj, 'c', 'ff');
    t1.search();
    const outputStr1 = t1.getOutputMatched();
    console.log(outputStr1);

    it(`应该输出分割线`, () => {
        assert(
            eql(/----------/.test(outputStr1), true),
            `eql(/----------/.test(outputStr1), true)`,
        )
    });

    it(`按值搜索应该匹配上/\\[c\\]\\[b\\]\\[f\\]/: ffff/`, () => {
        assert(
            eql(/\[c\]\[b\]\[f\]: ffff/.test(outputStr1), true),
            `eql(/\[c\]\[b\]\[f\]: ffff/.test(outputStr1), true)`,
        )
    });

    const t2 = new objNode(obj, 'b', 'ff');
    t2.search();
    const outputStr2 = t2.getOutputMatched();
    console.log(outputStr2);

    it(`按值搜索应该匹配上正则: /\\[b\\]\\[0\\]/: fklsdj8ff88/`, () => {
        assert(
            eql(/\[b\]\[0\]: fklsdj8ff88/.test(outputStr2), true),
            `eql(/\[b\]\[0\]: 66ffsdlkfj/.test(outputStr2), true)`,
        )
    });

    it(`按值搜索应该匹配上正则: /\\[b\\]\\[2\\]/: 66ffsdlkfj`, () => {
        assert(
            eql(/\[b\]\[2\]: 66ffsdlkfj/.test(outputStr2), true),
            `eql(/\[b\]\[2\]: 66ffsdlkfj/.test(outputStr2), true)`,
        )
    });

    const t3 = new objNode(obj, 'd', 'ff');
    t3.search();
    const outputStr3 = t3.getOutputMatched();
    console.log(outputStr3);

    it(`按值搜索应该匹配上正则: /\\[d\\]\\[a\\]: af8ff/`, () => {
        assert(
            eql(/\[d\]\[a\]/.test(outputStr3), true),
            `eql(/\[d\]\[a\]/.test(outputStr3), true)`,
        )
    })
});

describe('浅层测试获取新特性 Set 和 Map', () => {
    const t1 = new objNode(obj);
    it(`分别测试 t1.getValue("newFeature.set"), t1.getValue("newFeature.map"), t1.getValue("newFeature")`, () => {
        const targetSet = new Set([66, 88]);
        const targetMap = new Map([
            ['a', 993],
            ['b', 'lkdsfj'],
            ['c', {
                x: 22,
            }]
        ]);
        assert(eql(
            t1.getValue("newFeature.set"),
            targetSet
        ), '测试 t1.getValue("newFeature.set")');
        assert(eql(
            t1.getValue("newFeature.map"),
            targetMap
        ), '测试 t1.getValue("newFeature.map")');
        assert(eql(
            t1.getValue("newFeature"),
            {
                set: targetSet,
                map: targetMap,
            }
        ), '测试 t1.getValue("newFeature")');
    });
});

