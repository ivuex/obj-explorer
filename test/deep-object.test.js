const assert = require('simple-assert');
const eql = require("deep-eql");

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
