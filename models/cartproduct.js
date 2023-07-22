'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CartProduct.belongsTo(models.Cart, { foreignKey: "cartId" })
      CartProduct.belongsTo(models.Product, { foreignKey: "productId" })
    }
  }
  CartProduct.init(
    {
      quantity: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      cartId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CartProduct",
      tableName: "CartProducts",
      // underscored: true,
    }
  );
  return CartProduct;
};