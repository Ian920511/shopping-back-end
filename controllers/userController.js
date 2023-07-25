const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const { User, Product, Order, Cart, OrderDetail} = require('./../models')

const userController = {
  getOrders: async (req, res, next) => {
    const userId = req.user.id
    const role = req.user.role
    
    try {
      let orders = []

      if (role === "buyer") { 
        orders = await Order.findAll({
          where: { buyerId: userId },
          include: [
            {
              model: OrderDetail,
              as: "OrderDetails",
              include: [
                {
                  model: Product,
                  as: "Product",
                  attributes: ["id", "name", "price"],
                },
              ],
            },
          ],
        });
      } else if (role === "seller") {
        orders = await OrderDetail.findAll({
          where: { sellerId: userId },
          include: [
            { model: Product, as : 'Product', attributes: ['id', 'name', 'price'] },
            { model: Order, as: 'Order', attributes: ['id', 'totalPrice', 'createdAt'] }
          ]
        })
      }

      if (!orders || orders.length === 0 ) {
        return res.json({ message: '沒有任何訂單'})
      }

      return res.json(orders)

    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },
  getProducts: async (req, res, next) => {
    const userId = req.user.id

    try {
      const products = await Product.findAll({
        where: {
          sellerId: userId
        }
      })

      if (!products || products.length === 0) {
        return res.status(404).json({ error: "沒有販賣任何商品" })
      }

      return res.json(products)

    } catch (error) {
      next(error)
    }
  },
  getUserProfile: async (req, res, next) => {
    const userId = req.user.id

    if (req.user.id !== Number(userId)) {
      return res.status(403).json({ message: '非本人無法觀看個人資訊' })
    }

    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      })

      if (!user) {
        return res.status(404).json({ message: '無此使用者' })
      }

      return res.json(user)

    } catch (error) {
      next(error)
    }
  },
  updateRole: async (req, res, next) => {
    const userId = req.user.id

    try {
      const user = await User.findByPk(userId)

      if (!user) {
          return res.status(404).json({ message: '無此使用者' })
        }

      user.role = user.role === 'buyer' ? 'seller' : 'buyer'

      await user.save()

      return res.json(user)
    } catch (error) {
      next(error)
    }
  },
  updateUser: async (req, res, next) => {
    const userId = req.user.id
    const { name, password, tel, address} = req.body

    if (req.user.id !== Number(userId)) {
      return res.status(403).json({ message: "非本人無法修改個人資訊" })
    }

    if (typeof password === "undefined") {
      return res.status(400).json({ message: "密碼不能為空" })
    }

    try {
      const user = await User.findByPk(userId)

      if (!user) {
        return res.status(404).json({ message: "無此使用者" })
      }

      const hash = await bcrypt.hash(password, 10)

      await user.update({
        name,
        password: hash,
        tel,
        address,
      })

      return res.json(user)
    } catch (error) {
      next(error)
    }
  },
  login: async (req, res, next) => {
    try {
      const { password, ...userData } = req.user.toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "30d",
      })
      
      const userId = req.user.id
      console.log('userId', userId)
      const cart = await Cart.findOne({ where: { userId } })

      if (!cart) {
        await Cart.create({ userId })
      }

      return res.json({ token, user: userData})
    } catch(error) {
      next(error)
    }
  },
  register: async (req, res, next) => {
    const { account, name, password, tel, address } = req.body

    const checkAccount = await User.findOne({ where: { account }})

    if (checkAccount) {
      return res.status(403).json({ message: "此帳號已有人使用" })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({
      account,
      name,
      password: hash,
      tel,
      address,
      role: 'buyer'
    })

    const newUser = user.toJSON()
    delete newUser.password

    return res.json(newUser)
  },

  getCurrentUser: (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      account: req.user.account,
      tel: req.user.tel,
      address: req.user.address,
      role: req.user.role
    })
  }
}

module.exports = userController