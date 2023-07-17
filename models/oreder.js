'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { as: "Buyer", foreignKey: "buyerId" });
      Order.belongsTo(models.User, { as: "Seller", foreignKey: "sellerId" });
      Order.hasMany(models.OrderDetail, { foreignKey: "orderId" });
    }
  }
  Order.init(
    {
      totalPrice: DataTypes.INTEGER,
      sellerId: DataTypes.INTEGER,
      buyerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      underscored: true,
    }
  );
  return Oreder;
};