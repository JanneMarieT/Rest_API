class FlowerService {
    constructor(db) {
        this.client = db.sequelize;
        this.Flower = db.Flower;
    }

    async getOne(UserId) {
        return this.Flower.findAll({
            where: {UserId: UserId}
        }).catch(function (err) {
            console.log(err)
        });
    }

    async getUser(UserId) {
        return this.Flower.findAll({
            where: {UserId: UserId}
        }).catch(function (err) {
            console.log(err)
        });
    }

    async getFlower(id) {
        return this.Flower.findOne({
            where: {id: id}
        }).catch(function (err) {
            console.log(err)
        });
    }

    async CheckFlowerId(ColourId) {
        return this.Flower.findOne({
            where: {ColourId: ColourId}
        }).catch(function (err) {
            console.log(err)
        });
    }

    async getFlowerName(name) {
        return this.Flower.findOne({
            where: {name: name}
        }).catch(function (err) {
            console.log(err)
        });
    }

    async update(id, name, ColourId) {
        try {
          const flower = await this.Flower.findOne({
            where: {id: id}
          })
          if (!flower) {
            throw new Error('flower not found.');
          }
            const updatedFlower = await this.Flower.update({
                name: name,
                ColourId: ColourId,
            },
                    {
                        where: {
                            id: id,
                        },
                    }
            );
            return updatedFlower;
            } catch (err) {
            console.log('Error updating flower:', err);
            throw err;
          }
        }

    async create(Name, ColourId, UserId) {
        try {
        const model = this.Flower;
                const flower = await model.create({
                    name: Name,
                    ColourId: ColourId,
                    UserId: UserId
                });
                return flower;
            } catch (err) {
                console.log(err)
                throw err;
            }
        }
    

    async delete(id) {
        return this.Flower.destroy({
            where: {id: id}
        }).catch(function (err) {
            console.log(err)
        });
    }
       
}




module.exports = FlowerService;