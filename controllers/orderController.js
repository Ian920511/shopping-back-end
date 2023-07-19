const { Order, User, OrderDetail, Product, Cart } = require("./../models");

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
        include: [{ model: Product }],
      });

      if (!cart) {
        return res.status(404).json({ error: "無此購物車" });
      }

      //檢查庫存 計算總價格
      let totalPrice = 0
      const orderDetails = await Promise.all(
        cart.Products.map( async (product) => {
          const remainStock = product.stock - product.Cart.quantity
          if (remainStock < 0 ) {
            return res
              .status(400)
              .json({ error: `數量不足，商品剩餘數量: ${remainStock}` })
          }

          totalPrice += product.price * product.Cart.quantity

          return OrderDetail.create({
            quantity: product.Cart.quantity,
            price: product.price,
            productId: product.id,
            orderId : -1,
          })
        })
      )
      //建立訂單
      const order = await Order.create({ totalPrice, buyerId: userId })

      await Promise.all(
        orderDetails.map( async (orderDetail) => {
          orderDetail.orderId = order.id

          await orderDetail.save()
        })
      )
      //清空購物車的商品
      await cart.setProducts([])

      return res.json({
        order,
        orderDetails
      })

      
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
