const {
    objNode
} = require('..');
const assert = require('simple-assert');
const eql = require('deep-eql');
const expect = require('chai').expect;
const filterObj = require('filter-obj');
const log = console.log;

const obj = {
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
    }

};

describe('测试函数formatPath', () => {
    const t1 = new objNode(obj);
    const ctx = {
        k0: '0'
    };

    it('t1.genPathKeyAry("[1].az[k0]")应该返回[1, "az", "0"]', () => {
        console.log(
            t1.genPathKeyAry('[1].az[k0]', ctx),
            `808080 test.js`
        );
        assert(eql(
            t1.genPathKeyAry('[1].az[k0]', ctx),
            [1, "az", "0"]
        ), 't1.genPathKeyAry("[1].az[k0]")应该返回[1, "az", "0"]');
    });

    it('t1.getValue("[k0]") 应该递归等于 {7: 3}', () => {
        console.log(t1.getValue("[k0]", ctx), `858585 test.js`);
        assert(eql(
            t1.getValue("[k0]", ctx),
            { '7': 3 }
        ), 't1.getValue("[k0]", ctx) 应该递归等于 {7: 3}')
    });
});

describe('测试"filter-obj"', () => {
    it('get exist property of the obj must return right value.', () => {
        console.log(filterObj(obj, ['100']), 404040);
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

describe('根据对象点表示法，获取对应的值的测试', () => {
    it(`new objNode(obj, 'a').getValue() 应该递归等于{ ary: [0, 1], obj: {a: 1, b: 2}, }`, () => {
        const t1 = new objNode(obj, 'a');
        const resValue = t1.getValue();
        console.log(resValue, 525252);
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
        console.log(resValue, '88,88,');
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

// describe('传入"e.x"作为构造函数中的路径字符串，并在方法getValue中传入字符串作为后面的路径字符串参数， 获得以obj为上下文,路径为以上两个路径字符串组合后的路径，并测试获取到的对应的值。', () => {
//     const t1 = new objNode(obj, 'e.x')
//     it(`向实例t1的方法getValue中传入路径"a"作为参数，并测试是否获得正确的值`,
//         () => {
//             assert(
//                 eql(
//                     t1.getValue('a'),
//                     {
//                         x: 1,
//                         y: 2,
//                     }
//                 ),
//                 `eql( t1.getValue('a'), { x: 1, y: 2, } )`
//             );
//         }
//     );
//
//     it(`向实例t1的方法getValue中传入路径"b.x"作为参数，并测试是否获得正确的值`,
//         () => {
//             console.log(t1.getValue('b.x'), 141141);
//             assert(
//                 eql(
//                     t1.getValue('b.x'),
//                     [
//                         1,
//                         {m: 6}
//                     ]
//                 ),
//                 `eql( t1.getValue('b.x'), [ 1, {m: 6} ] )`
//             );
//         }
//     )
//
//     it(`向实例t1的方法getValue中传入路径"b.x[1]"作为参数，并测试是否获得正确的值`,
//         () => {
//             console.log(t1.getValue('b.x[1]'), 157157);
//             assert(
//                 eql(
//                     t1.getValue('b.x[1]'),
//                     {m: 6}
//                 ),
//                 `eql( t1.getValue('b.x'), {m: 6})`
//             );
//         }
//     )
// })

describe('测试字符串outputStr', () => {
    const t1 = new objNode(obj, 'c', 'ff');
    t1.handleByValue();
    const outputStr1 = t1.getOutputMatched();
    // console.log(outputStr1, 656565);

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
    t2.handleByValue();
    const outputStr2 = t2.getOutputMatched();
    // console.log(outputStr2, 797979);

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
    t3.handleByValue();
    const outputStr3 = t3.getOutputMatched();
    console.log(outputStr3, 105105);
    it(`按值搜索应该匹配上正则: /\\[d\\]\\[a\\]: af8ff/`, () => {
        assert(
            eql(/\[d\]\[a\]/.test(outputStr3), true),
            `eql(/\[d\]\[a\]/.test(outputStr3), true)`,
        )
    })
});
