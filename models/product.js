'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.User, { as: "Seller", foreignKey: "sellerId" });
      Product.hasMany(models.Cart, { foreignKey: "productId" });
      Product.hasMany(models.OrderDetail, { foreignKey: "productId" });
      Product.belongsTo(models.Category, { foreignKey: "categoryId" });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      status: DataTypes.ENUM("active", "inactive"),
      sellerId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      image: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      underscored: true,
    }
  );
  return Product;
};