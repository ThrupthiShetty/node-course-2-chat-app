const expect = require('expect')
var {Users} = require('./users')

describe('Users',()=>{

    var newUsers ;

    beforeEach(()=>{
        newUsers = new Users();
        newUsers.users = [{
            id : '1',
            name : 'Andy',
            room : 'Node course'
        },{
            id : '2',
            name : 'Jen',
            room : 'React course'
        },{
            id : '3',
            name : 'Julie',
            room : 'Node course'
        }]
    })
    it('should add new user',()=>{
        var newUsers = new Users();
        var user={
            id: 'Abcs#234',
            name :'Andrew',
            room : 'The Ofiice plans'
        }
        var resUser = newUsers.addUser(user.id,user.name,user.room)

        expect(newUsers.users).toEqual([user])
    })

    it('should remove user',()=>{
        var userId  = '2'
        var user= newUsers.removeUser(userId)
        expect(user.id).toBe(userId)
        expect(newUsers.users.length).toBe(2)
    })

    it('should not remove user',()=>{
        var userId  = '99'
        var user= newUsers.removeUser(userId)
        expect(user).toNotExist()
        expect(newUsers.users.length).toBe(3)

    })

    it('should find user',()=>{
        var userId  = '2'
        var user= newUsers.getUser(userId)
        expect(user.id).toBe(userId)
    })

    it('should not find user',()=>{
        var userId  = '23'
        var user= newUsers.getUser(userId)
        expect(user).toNotExist()
    })

    it('should retun names for Node course',()=>{
        var userList = newUsers.getUserList('Node course')

        expect(userList).toEqual(['Andy','Julie'])
    })
    it('should retun names for React course',()=>{
        var userList = newUsers.getUserList('React course')

        expect(userList).toEqual(['Jen'])
    })
})