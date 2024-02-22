"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Profile.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Full Name is required",
          },
          notNull: {
            msg: "Full Name is required",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Phone Number is required",
          },
          notNull: {
            msg: "Phone Number is required",
          },
          isNumeric: {
            msg: "Phone Number must only digits",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Address is required",
          },
          notNull: {
            msg: "Address is required",
          },
        },
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Profile Picture is required",
          },
          notNull: {
            msg: "Profile Picture is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};
