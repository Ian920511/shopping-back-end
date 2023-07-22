const { Category } = require('./../models')

const categoryController = {
  getCategory: async (req, res, next) => {
    const categoryId = req.params.categoryId
    
    try {
      const category = await Category.findByPk(categoryId)

      if (!category) {
        return res.status(404).json({ error: '查無此分類' })
      }

      return res.json(category)
    } catch (error) {
      next(error)
    }
  },
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll()

      return res.json(categories);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController