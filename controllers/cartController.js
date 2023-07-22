const { Cart, Product, CartProduct } = require("./../models");

const cartController = {
  getCart: async (req, res, next) => {
    const userId = req.user.id;

    try {
      const cart = await Cart.findOne({
        where: { UserId: userId },
        include: [{ model: CartProduct, include: [{ model: Product }] }],
      });

      if (!cart) {
        return res.status(404).json({ error: "無此購物車" });
      }

      const cartProducts = cart.CartProducts
      let totalPrice = 0

      for (const cartProduct of cartProducts) {
        totalPrice += cartProduct.quantity * cartProduct.Product.price
      }

      return res.json({cart, totalPrice});
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

      const remainStock = product.stock -quantity

      if (remainStock < 0) {
        return res.status(400).json({ error: `數量不足，商品剩餘數量: ${remainStock}` })
      }


      const cart = await Cart.findOne({ where: { userId } });

      if (!cart) {
        const newCart = await Cart.create({ userId })
        await CartProduct.create({
          cartId: newCart.id,
          productId,
          quantity
        }) 
      } else {
        const cartProduct = await CartProduct.findOne({
          where: { cartId: cart.id, productId }
        })

        if (cartProduct) {
          cartProduct.quantity += quantity
          await cartProduct.save()
        } else {
          await CartProduct.create({
            cartId: cart.id,
            productId,
            quantity
          })
        }
      }

      // product.stock = remainStock
      // await product.save()

      return res.json({ message: '成功加入購物車'});
    } catch (error) {
      next(error);
    }
  },

  updateCart: async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
      const cart = await Cart.findOne({ where: { userId } })

      if (!cart) {
        return res.status(404).json({ error: "無此購物車" });
      }

      const cartProduct = await CartProduct.findOne({
        where: { cartId: cart.id, productId }
      })

      if (!cartProduct) {
         return res.status(404).json({ error: "購物車中無此商品" });
      }

      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ error: "查無此商品" });
      }

      const remainStock = product.stock - quantity

      if (remainStock < 0) {
        return res.status(400).json({ error: `數量不足，商品剩餘數量: ${remainStock}`})
      }

      await CartProduct.update({ quantity }, { where: { cartId: cart.id, productId } });

      // product.stock = remainStock
      // await product.save()

      return res.json({ message: '成功更新購物車商品數量' });
    } catch (error) {
      next(error);
    }
  },

  deleteCartProduct: async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
      const cart = await Cart.findOne({ where: { userId }})

      if (!cart) {
        return res.status(404).json({ error: "無此購物車" })
      }

      const cartProduct = await CartProduct.findOne({ where: { cartId: cart.id, productId } });

      if (!cartProduct) {
        return res.status(404).json({ error: "購物車無此商品" });
      }

      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ error: "查無此商品" });
      }

      await cartProduct.destroy();

      // product.stock += cartProduct.quantity
      // await product.save()

      return res.json(cartProduct);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cartController;
