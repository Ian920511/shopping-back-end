const express = require('express')

const router = express.Router()

const userController = require('./../../../controllers/userController')

const { checkRole } = require("./../../middleware/api-auth");

router.get('/:userId/orders', userController.getOrders)
router.get('/:userId/products', checkRole('seller'), userController.getProducts)
router.get('/:userId/profile', userController.getUserProfile)
router.put('/:userId', userController.updateUser)
router.put('/role', userController.updateRole)


module.exports = router