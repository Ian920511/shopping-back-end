'use strict';

const { faker } = require("@faker-js/faker")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products',
    Array.from({ length: 40 }).map((_, index) => ({
      id: index + 1,
      name: faker.commerce.product(),
      sellerId: 2,
      description: faker.commerce.productDescription(),
      price: Math.random() * 1000,
      stock: Math.random() * 100,
      image: `https://loremflickr.com/320/240/product/?random=${ Math.random() * 1000}`,
      categoryId: Math.floor(Math.random() * 5) + 1,
      status: Math.random() < 0.8 ? 'active': 'inactive',
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
   )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", {});
  }
};
