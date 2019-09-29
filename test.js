const { expect } = require('chai');
const { coerce } = require('./coerce');


describe('Coerce', () => {
  describe('Keywords', () => {
    it('turns \'true\' values to true', () => {
      expect(coerce({
        foo: 'true'
      })).to.deep.equal({
        foo: true
      });
    });

    it('turns \'false\' values to false', () => {
      expect(coerce({
        foo: 'false'
      })).to.deep.equal({
        foo: false
      });
    });

    it('turns \'null\' values to null', () => {
      expect(coerce({
        foo: 'null'
      })).to.deep.equal({
        foo: null
      });
    });

    it('turns \'undefined\' values to undefined', () => {
      expect(coerce({
        foo: 'undefined'
      })).to.deep.equal({
        foo: undefined
      });
    });
  });

  describe('Integars', () => {
    it('turns string values comprised of integer values to integers', () => {
      expect(coerce({
        foo: '23094'
      })).to.deep.equal({
        foo: 23094
      });
    });
  });

  describe('Arrays', () => {
    it('turns array of string values comprised of integer values to an array of integers', () => {
      expect(coerce({
        foos: ['1', '2', '3']
      })).to.deep.equal({
        foos: [1, 2, 3]
      });
    });

    it('turns array of string values comprised of integer values to an array of integers', () => {
      expect(coerce({
        foos: [
          {
            foo: 'true',
            boo: '123'
          },
          {
            foo: 'false',
            boo: '456'
          }
        ]
      })).to.deep.equal({
        foos: [
          {
            foo: true,
            boo: 123
          },
          {
            foo: false,
            boo: 456
          }
        ]
      });
    });
  });

  describe('Params', () => {
    it('runs shallow param through an uppercase formatter', () => {
      expect(coerce({
        foo: 'hi'
      }, { coerceMap: { foo: (val) => val.toUpperCase() }}, 'foo')).to.deep.equal({
        foo: 'HI'
      });
    });

    it('runs deep param through an uppercase formatter', () => {
      expect(coerce({
        foo: {
          boo: 'hi'
        }
      }, { coerceMap: { 'foo.boo': (val) => val.toUpperCase() }}, 'foo.boo')).to.deep.equal({
        foo: {
          boo: 'HI'
        }
      });
    });
  });
});
