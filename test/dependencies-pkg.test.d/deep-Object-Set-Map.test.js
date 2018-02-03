const assert = require('simple-assert');
const eql = require("deep-eql");
const setExists = typeof Set === 'function';
const mapExists = typeof Map === 'function';

function describeIf(condition) {
    return condition ? describe : describe.skip;
}

describe(`use simple-assert and deep-eql to test deep equalment of object.`, ()=>{

    describe('objects', function () {

        it('returns true with objects containing same literals', function () {
            assert(eql({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }), 'eql({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })');
            assert(eql({ foo: 'baz' }, { foo: 'baz' }), 'eql({ foo: "baz" }, { foo: "baz" })');
        });

        it('returns true for deeply nested objects', function () {
            assert(eql({ foo: { bar: 'foo' } }, { foo: { bar: 'foo' } }),
                'eql({ foo: { bar: "foo" }}, { foo: { bar: "foo" }})');
        });

        it('returns true with objects with same circular reference', function () {
            var objectA = { foo: 1 };
            var objectB = { foo: 1 };
            var objectC = { a: objectA, b: objectB };
            objectA.bar = objectC;
            objectB.bar = objectC;
            assert(eql(objectA, objectB) === true,
                'eql({ foo: 1, bar: objectC }, { foo: 1, bar: objectC }) === true');
        });

        it('returns false with objects containing different literals', function () {
            assert(eql({ foo: 1, bar: 1 }, { foo: 1, bar: 2 }) === false,
                'eql({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }) === false');
            assert(eql({ foo: 'bar' }, { foo: 'baz' }) === false, 'eql({ foo: "bar" }, { foo: "baz" }) === false');
            assert(eql({ foo: { bar: 'foo' } }, { foo: { bar: 'baz' } }) === false,
                'eql({ foo: { bar: "foo" }}, { foo: { bar: "baz" }}) === false');
        });

        it('returns false with objects containing different keys', function () {
            assert(eql({ foo: 1, bar: 1 }, { foo: 1, baz: 2 }) === false,
                'eql({ foo: 1, bar: 2 }, { foo: 1, baz: 2 }) === false');
            assert(eql({ foo: 'bar' }, { bar: 'baz' }) === false, 'eql({ foo: "bar" }, { foo: "baz" }) === false');
        });

    });
});

describeIf(mapExists)('maps', function () {
    it('returns true for Maps with same entries', function () {
        var mapA = new Map();
        var mapB = new Map();
        mapA.set('a', 1);
        mapA.set('b', 2);
        mapA.set('c', 3);
        mapB.set('c', 3);
        mapB.set('b', 2);
        mapB.set('a', 1);
        assert(eql(mapA, mapB), 'eql(Map { a => 1, b => 2, c => 3 }, Map { a => 1, b => 2, c => 3 })');
    });

    it('returns false for Maps with different entries', function () {
        var mapA = new Map();
        var mapB = new Map();
        mapA.set('a', 1);
        mapB.set('a', 1);
        mapA.set('b', 2);
        mapB.set('b', 2);
        mapA.set('c', 3);
        mapB.set('c', 3);
        assert(eql(mapA, mapB), 'eql(Map { a => 1, b => 2, c => 3 }, Map { a => 1, b => 2, c => 3 })');
    });
});

describeIf(setExists)('sets', function () {

    it('returns true for Sets with same entries', function () {
        var setA = new Set();
        var setB = new Set();
        setA.add('a');
        setA.add('b');
        setA.add('c');
        setB.add('a');
        setB.add('b');
        setB.add('c');
        assert(eql(setA, setB), 'eql(Set { "a", "b", "c" }, Set { "a", "b", "c" })');
    });

    it('returns true for Sets with same entries in different order', function () {
        var setA = new Set();
        var setB = new Set();
        setA.add('a');
        setA.add('b');
        setA.add('c');
        setB.add('b');
        setB.add('c');
        setB.add('a');
        assert(eql(setA, setB), 'eql(Set { "a", "b", "c" }, Set { "b", "c", "a" })');
    });

    it('returns true for Sets with nested entries', function () {
        var setA = new Set();
        var setB = new Set();
        setA.add([ [], [], [] ]);
        setB.add([ [], [], [] ]);
        assert(eql(setA, setB) === true, 'eql(Set [ [], [], [] ], Set [ [], [], [] ]) === true');
    });

    it('returns true for Sets with same circular references', function () {
        var setA = new Set();
        var setB = new Set();
        var setC = new Set();
        setA.add(setC);
        setB.add(setC);
        setC.add(setA);
        setC.add(setB);
        assert(eql(setA, setB) === true, 'eql(Set { setC }, Set { setC }) === true');
    });

    it('returns false for Sets with different entries', function () {
        var setA = new Set();
        var setB = new Set();
        setA.add('a');
        setA.add('b');
        setA.add('c');
        setB.add('d');
        setB.add('e');
        setB.add('f');
        assert(eql(setA, setB) === false, 'eql(Set { "a", "b", "c" }, Set { "d", "e", "f" }) === false');
    });

    it('returns true for circular Sets', function () {
        var setA = new Set();
        var setB = new Set();
        setA.add(setB);
        setB.add(setA);
        assert(eql(setA, setB) === true, 'eql(Set { -> }, Set { <- }) === true');
    });

});
