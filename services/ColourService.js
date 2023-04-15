class ColourService {
    constructor(db) {
        this.client = db.sequelize;
        this.Colour = db.Colour
    }

    async getOne() { 
        return this.Colour.findAll({
        }).catch(function (err) {
            console.log(err)
        });
    }
/*
    async getUser(UserId) {
        return this.colour.findAll({
            where: {UserId: UserId}
        }).catch(function (err) {
            console.log(err)
        });
    }
*/
    async getColour(id) {
        return this.Colour.findOne({
            where: {id: id}
        }).catch(function (err) {
            console.log(err)
        });
    }

    async getColourName(name) { 
        return this.Colour.findOne({ //find all?
            where: {name: name}
        }).catch(function (err) {
            console.log(err)
        });
    }

    async update(id, name) { //works
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

    async create(Name) { //works
        const model = this.Colour;
                const newColour = await model.create({
                    name: Name
                });
                return newColour;
            }catch (err) {
                console.log(err)
                throw err;
            }
        

    async delete(id) {
        return this.Colour.destroy({
            where: {id: id}
        }).catch(function (err) {
            console.log(err)
        });
    }
       
}




module.exports = ColourService;