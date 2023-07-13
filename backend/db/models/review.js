'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(
        models.Spot, {
          foreignKey: "spotId"
        }
      )

      Review.belongsTo(
        models.User, {
          foreignKey: "userId"
        }
      )

      Review.hasMany(
        models.ReviewImage, {
          foreignKey: "reviewId",
          onDelete: "CASCADE",
          hooks: true
        }
      )
    }
  }
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    spotId: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true
      }
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        min: 1,
        max: 5
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
