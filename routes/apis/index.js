const express = require("express");
const router = express.Router();
const passport = require("passport");

const users = require('./modules/users')
const products = require("./modules/products");
const carts = require("./modules/carts");
const orders = require("./modules/orders");
const categories = require("./modules/categories");

const userController = require('./../../controllers/userController')

const { authenticate, checkRole } = require('./../../middleware/api-auth');

router.post("/login", passport.authenticate("local", { session: false }), userController.login); 
router.post('/register', userController.register)

router.use('/users', authenticate, users)
router.use('/products', authenticate, products)
router.use("/carts", authenticate, checkRole("buyer"), carts);
router.use('/orders', authenticate, orders)
router.use('/categories', authenticate, categories)


module.exports = router;