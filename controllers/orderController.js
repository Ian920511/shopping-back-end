const { Order, User, OrderDetail, Product, Cart, CartProduct } = require("./../models");

const orderController = {
  getOrders: async (req, res, next) => {
    const userId = req.user.id;
    const role = req.user.role;

    try {
      let orders = {};

      if (role === "buyer") {
        orders = await Order.findAll({
          where: { buyerId: userId },
          include: [{ model: User, as: "Seller" }],
          attributes: {
            include: [
              [
                sequelize.fn("SUM", sequelize.col("OrderDetails.price")),
                "totalPrice",
              ],
            ],
          },
          include: [
            {
              model: OrderDetail,
              attributes: [], 
            },
          ],
          group: ["Order.id"],
        });
      } else if (role === "seller") {
        orders = await Order.findAll({
          where: { sellerId: userId },
          include: [{ model: User, as: "Buyer" }],
          attributes: {
            include: [
              [
                sequelize.fn("SUM", sequelize.col("OrderDetails.price")),
                "totalPrice",
              ],
            ],
          },
          include: [
            {
              model: OrderDetail,
              attributes: [],
            },
          ],
          group: ["Order.id"],
        });
      } else {
        return res.status(403).json({ error: "請確認使用者身分" });
      }

      return res.json(orders);
    } catch (error) {
      next(error);
    }
  },

  getOrder: async (req, res, next) => {
    const orderId = req.params.orderId;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
      let order;
      if (userRole === "buyer") {
        order = await Order.findOne({
          where: { id: orderId, buyerId: userId },
          include: [{ model: User, as: "Seller" }],
          attributes: {
            include: [
              [
                sequelize.fn("SUM", sequelize.col("OrderDetails.price")),
                "totalPrice",
              ],
            ],
          },
          include: [
            {
              model: OrderDetail,
              attributes: [],
            },
          ],
        });
      } else if (userRole === "seller") {
        order = await Order.findOne({
          where: { id: orderId, sellerId: userId },
          include: [{ model: User, as: "Buyer" }],
          attributes: {
            include: [
              [
                sequelize.fn("SUM", sequelize.col("OrderDetails.price")),
                "totalPrice",
              ],
            ],
          },
          include: [
            {
              model: OrderDetail,
              attributes: [],
            },
          ],
        });
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (!order) {
        return res.status(404).json({ error: "找不到該訂單" });
      }

      return res.json(order);
    } catch (error) {
      next(error);
    }
  },

  createOrder: async (req, res, next) => {
    const userId = req.user.id;

    try {
      const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: CartProduct, include: [{ model: Product }] }],
      });

      if (!cart) {
        return res.status(404).json({ error: "無此購物車" });
      }

      console.log(cart.toJSON());

      //檢查庫存 計算總價格
      let totalPrice = 0
      const orderDetails = []

      const order = await Order.create({ totalPrice, buyerId: userId })

      for (const cartProduct of cart.CartProducts) {
        if (!cartProduct || !cartProduct.Product) {
          return res.status(404).json({ error: "購物車無此商品" })
        }

        const product = cartProduct.Product
        const remainStock = product.stock - cartProduct.quantity

        if (
          remainStock < 0 ||
          cartProduct.quantity <= 0 ||
          product.price <= 0
        ) {
          return res
            .status(400)
            .json({ error: `商品資訊有誤或數量不足，商品剩餘數量: ${remainStock}` });
        }

        totalPrice += product.price * cartProduct.quantity

        const orderDetail = await OrderDetail.create({
          quantity: cartProduct.quantity,
          price: product.price,
          productId: product.id,
          orderId: order.id,
          sellerId: product.sellerId
        });

        orderDetails.push(orderDetail)

      }

      await order.update({ totalPrice })

      //清空購物車的商品
      // await cart.setCartProducts([])

      return res.json({
        order,
        orderDetails
      })
    } catch (error) {
      console.log('error', error)
      next(error);
    }
  },
};

module.exports = orderController;
