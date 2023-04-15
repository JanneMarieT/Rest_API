module.exports = (sequelize, Sequelize) => {
    const Colour = sequelize.define('Colour', {
      name: {
        type: Sequelize.DataTypes.STRING,
  
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
    );
    return Colour;
  };
  
  