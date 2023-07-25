'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderDetail.belongsTo(models.Order, { foreignKey: "orderId" });
      OrderDetail.belongsTo(models.User, { as: "Seller", foreignKey: "sellerId" });
      OrderDetail.belongsTo(models.Product, { foreignKey: "productId" });
    }
  }
  OrderDetail.init(
    {
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
      sellerId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderDetail",
      tableName: "OrderDetails",
      // underscored: true,
    }
  );
  return OrderDetail;
};