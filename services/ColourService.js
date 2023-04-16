class ColourService {
    constructor(db) {
        this.client = db.sequelize;
        this.Colour = db.Colour
    }

    //GET
    async getOne() { 
        return this.Colour.findAll({
        }).catch(function (err) {
            console.log(err)
        });
    }

    //POST
    async create(Name) { 
        try {
        const model = this.Colour;
                const newColour = await model.create({
                    name: Name
                });
                return newColour;
            } catch (err) {
                console.log('Error updating category:', err)
                throw err;
        }
    }

    //PUT
    async update(id, name) { 
        try {
          const colour = await this.Colour.findOne({
            where: {id: id}
          })
          if (!colour) {
            throw new Error('colour not found.');
          }
            const updatedColour = await this.Colour.update({
                name: name
            },
                    {
                        where: {
                            id: id,
                        },
                    }
            );
            return updatedColour;
            } catch (err) {
            console.log('Error updating colour:', err);
            throw err;
          }
        }

    //DELETE & PUT + POST in flower
    async getColour(id) {
        return this.Colour.findOne({
            where: {id: id}
        }).catch(function (err) {
            console.log(err)
        });
    }

    //DELETE
    async getColourName(name) { 
        return this.Colour.findOne({ 
            where: {name: name}
        }).catch(function (err) {
            console.log(err)
        });
    }

    //DELETE
    async delete(id) {
        return this.Colour.destroy({
            where: {id: id}
        }).catch(function (err) {
            console.log(err)
        });
    }
       
}


module.exports = ColourService;