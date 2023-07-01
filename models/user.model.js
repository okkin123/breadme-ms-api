module.exports = class User {
    constructor(user)
    {
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.email = user.email;
        this.password = user.password;
    }
}

