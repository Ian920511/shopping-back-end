const { Product, User, Category } = require("./../models");
const { uploadImageToImgur } = require('./../helpers/imgurHelpers')

const pageLimit = 12

const productController = {
  getProduct: async (req, res, next) => {
    const { productId } = req.params;

    try {
      const product = await Product.findByPk(productId, {
        include: [
          { model: User, as: "Seller", attributes: { exclude: ["password"] } },
          { model: Category },
        ],
      });

      if (!product) {
        return res.status(404).json({ error: "找不到該商品" });
      }

      return res.json(product);
    } catch (error) {
      next(error);
    }
  },

  postProduct: async (req, res, next) => {
    const userId = req.user.id;
    const { name, description, price, stock, status, categoryId } = req.body;
    const { file } = req

    try {
      const imgurUrl= file ? await uploadImageToImgur(file) : null

      const product = await Product.create({
        name,
        description,
        price,
        stock,
        status,
        sellerId: userId,
        categoryId,
        image: imgurUrl,
      });

      return res.json(product);
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const { name, description, price, stock, status, categoryId } = req.body;
    const { file } = req

    try {
      const product = await Product.findOne({
        where: { id: productId, sellerId: userId },
      });

      if (!product) {
        return res.status(404).json({ error: "找不到該商品或非該賣家商品" });
      }

      let imgurUrl = product.image

      if (file) {
        imgurUrl = await uploadImageToImgur(file)
      }

      await product.update({
        name,
        description,
        price,
        stock,
        status,
        categoryId,
        image: imgurUrl
      });

      return res.json(product);
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
      const product = await Product.findOne({
        where: { id: productId, sellerId: userId },
      });

      if (!product) {
        return res.status(404).json({ error: "找不到該商品或非該賣家商品" });
      }

      await product.destroy();

      return res.json({ message: "商品已成功刪除" });
    } catch (error) {
      next(error);
    }
  },

  getProducts: async (req, res, next) => {
    let offset = 0;
    let whereCondition = { status: "active" };
    let categoryId = "";

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereCondition["categoryId"] = categoryId;
    }

    try {
      const data = await Product.findAndCountAll({
        include: [{ model: Category, as: "Category" }],
        where: whereCondition,
        offset: offset,
        limit: pageLimit,
        raw: true,
        nest: true,
      });

      let page = Number(req.query.page) || 1;
      let pages = Math.ceil(data.count / pageLimit);
      let totalPage = Array.from({ length: pages }).map(
        (_item, index) => index + 1
      );
      let prev = page - 1 < 1 ? 1 : page - 1;
      let next = page + 1 > pages ? pages : page + 1;

      const products = data.rows.map((product) => ({
        ...product,
        description: product.description.substring(0, 50),
      }));

      const categories = await Category.findAll();

      return res.json({
        products,
        categories,
        categoryId,
        page,
        totalPage,
        prev,
        next,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
