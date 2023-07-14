'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(
        models.Booking, {
          foreignKey: 'spotId',
          onDelete: "CASCADE",
          hooks: true
        }
      )
      Spot.hasMany(
        models.SpotImage, {
          foreignKey: "spotId",
          onDelete: "CASCADE",
          hooks: true
        }
      )
      Spot.hasMany(
        models.Review, {
          foreignKey: "spotId",
          onDelete: "CASCADE",
          hooks: true
        }
      )
      Spot.belongsTo(
        models.User, {
          foreignKey: 'ownerId',
          as: "Owner"
        }
      )
      Spot.belongsToMany(models.User, {
          through: models.Review,
          foreignKey: 'spotId',
          otherKey: 'userId'
        }
      )
      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: "spotId",
        otherKey: "userId",
        }
      )
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        as: 'previewImage',
        onDelete: 'CASCADE',
        hooks: true
        }
      )
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: -50,
        max: 50
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      validate: {
        isNumeric: true,
        min: -150,
        max: 150
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 49]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
