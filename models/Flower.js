module.exports = (sequelize, Sequelize) => {
    const Flower = sequelize.define('Flower', {
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
    );
  
    Flower.associate = function (models) {
      Flower.belongsTo(models.Colour, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    };
  
    return Flower;
  };
  
  