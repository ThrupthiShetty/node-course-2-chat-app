const expect = require('expect')
const {isRealString} = require('./validation')

describe('isRealString',()=>{
    it('should reject no tring values',()=>{
        var res = isRealString(98)
        expect(res).toBe(false)
    });
    it('should reject string with only places',()=>{
        var res = isRealString(98)
        expect(res).toBe(false)
    });
    it('should allow string with non space chaacters',()=>{
        var res = isRealString('  Andrew Andy  ')
        expect(res).toBe(true)
    })
})