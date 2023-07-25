'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Product, { as: "Products", foreignKey: "sellerId" });
      User.hasMany(models.Cart, { foreignKey: "userId" });
      User.hasMany(models.Order, { as: "BuyerOrders", foreignKey: "buyerId" });
      User.hasMany(models.OrderDetail, { foreignKey: "sellerId" });
    }
  }
  User.init({
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.ENUM('buyer', 'seller'),
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    // underscored: true,
  });
  return User;
};