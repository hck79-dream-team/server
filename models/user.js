"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "Email already exists",
        },
        validate: {
          isEmail: {
            msg: "Invalid email format",
          },
          notEmpty: {
            msg: "Email is required",
          },
          notNull: {
            msg: "Email is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Password is required",
          },
          notNull: {
            msg: "Password is required",
          },
          len: {
            args: [6, 20],
            msg: "Password must be between 6 and 20 characters",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user) => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  });
  return User;
};
