const { Cart, Product } = require("./../models");

const cartController = {
  getCart: async (req, res, next) => {
    const userId = req.user.id;

    try {
      const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: Product }],
      });

      if (!cart) {
        return res.status(404).json({ error: "無此購物車" });
      }

      return res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  postCart: async (req, res, next) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ error: "查無此商品" });
      }

      let cart = await Cart.findOne({ where: { userId, productId } });

      if (cart) {
        cart.quantity += quantity 

        await Cart.update(
          { quantity: cart.quantity },
          { where: { userId, productId } }
        );

        cart = await Cart.findOne({ where: { userId, productId } });

      } else {
        cart = await Cart.create({
          userId,
          productId,
          quantity
        })
      }


      return res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  updateCart: async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
      const cart = await Cart.findOne({
        where: { userId, productId },
        include: [{ model: Product }]
      });

      if (!cart) {
        return res.status(404).json({ error: "無此購物車" });
      }

      const product = cart.Product
      const remainStock = product.stock - quantity

      if (remainStock < 0) {
        return res.status(400).json({ error: `數量不足，商品剩餘數量: ${remainStock}`})
      }

      await Cart.update(
        { quantity },
        { where: { userId, productId } }
      );

      const updatedCart = await Cart.findOne({
        where: { userId, productId },
        include: [{ model: Product }]
      })

      return res.json(updatedCart);
    } catch (error) {
      next(error);
    }
  },

  deleteCartProduct: async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
      const cart = await Cart.findOne({ where: { userId } });

      if (!cart) {
        return res.status(404).json({ error: "無此購物車" });
      }

      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ error: "查無此商品" });
      }

      await cart.destroy({ where: { userId, productId }})

      return res.json(cart);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cartController;
