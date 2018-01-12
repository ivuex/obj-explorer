const objNode = require('..');
const assert = require('simple-assert');
const eql = require('deep-eql');
const expect = require('chai').expect;
const filterObj = require('filter-obj');
const log = console.log;

const obj = {
    a: 1,
    f: 'xffyz',
    b: [
        {
            a: 1,
            b2: 'bbbbb',
        },
        'fflksdj',
        'fflksdj',
        'lskdfflksd',
        '66ffsdlkfj',
        333,
    ],
    c: {
        a: [1, 2, 3],
        b: {
            d: 5,
            e: 6,
            f: 'ffff',
        }
    }
};


describe('测试"filter-obj"', () => {
    it('get exist property of the obj must return right value.', () => {
        assert(
            eql(filterObj(obj, ['a']), {a: 1}),
            `filterObj(obj, ['a']), {a: 1}`
        );
    })
});

describe('根据对象点表示法，获取对应的值的测试', () => {
    it(`new objNode(obj, 'c.b').getValue() 应该等于'{ d: 5, e: 6, f:'ffff' }'`, () => {
        const t1 = new objNode(obj, 'c.b', 'ff');
        const resValue = t1.getValue();
        assert(
            eql(resValue, {e: 6, d: 5, f: 'ffff'}),
            `eql(filterObj(t1.getValue()), { d: 5, e: 6, f: 'ffff' })`,
        )
    });
});

describe('指定空字符串作为路径应该输出创建的实例调用', () => {
    it(`eql(new objNode(obj).getValue(), obj)`, () => {
        const t1 = new objNode(obj);
        const resValue = t1.getValue();
        assert(eql(resValue, obj), `eql(new objNode(obj).getValue(), obj)`);
    });
});

describe('测试字符串outputStr', () => {
    const t1 = new objNode(obj, 'c.b', 'ff');
    t1.handleByValue();
    const outputStr1 = t1.getOutputMatched();
    console.log(outputStr1);

    it(`应该输出分割线`, () => {
        assert(
            eql(/----------/.test(outputStr1), true),
            `eql(/----------/.test(outputStr1), true)`,
        )
    });

    it(`按值搜索应该匹配上/\[c\]\[b\]\[f\]: ffff/`, () => {
        assert(
            eql(/\[c\]\[b\]\[f\]: ffff/.test(outputStr1), true),
            `eql(/\[c\]\[b\]\[f\]: ffff/.test(outputStr1), true)`,
        )
    });

    const t2 = new objNode(obj, 'b', 'ff');
    t2.handleByValue();
    const outputStr2 = t2.getOutputMatched();
    console.log(outputStr2, 797979);
    // it(`按值搜索应该匹配上/\[c\]\[b\]\[f\]: ffff/`, () => {
    //     assert(
    //         eql(/\[c\]\[b\]\[f\]: ffff/.test(outputStr), true),
    //         `eql(/\[c\]\[b\]\[f\]: ffff/.test(outputStr), true)`,
    //     )
    // });
});


// describe('在obj中搜索字符串"ff"', () => {
//     it(`应该输出分割线`, ()=>{
//         assert(
//             eql(/----------/.test(outputStr), true),
//             `eql(/----------/.test(outputStr), true)`,
//         )
//     });
//     // it(`在c.b下的值中搜索"ff"字符串`, () => {
//     //     const t1 = new objNode(obj, 'c.b', 'ff');
//     //     t1.search();
//     //     const outputStr = t1.getOutputMatched();
//     //     console.log(outputStr);
//     // })
// });
