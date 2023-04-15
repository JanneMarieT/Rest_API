class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    }

    async getOne(email) {
        return this.User.findOne({
          where: { email: email },
          attributes: ['id', 'email', 'encryptedPassword', 'salt']
        });
      }

    async getUser(id) {
        return this.User.findOne({
          where: { id: id },
          attributes: ['id', 'email', 'encryptedPassword', 'salt']
        });
      }

    async create(name, email, hashedPassword, salt) {
        return this.User.create({
            name: name,
            email: email,
            encryptedPassword: hashedPassword,
            salt: salt
        })
    }

    async delete(email) {
        return this.User.destroy({
            where: {
                email: email
            }
        })
    }
}

module.exports = UserService;