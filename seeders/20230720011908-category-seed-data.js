'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Categories',
      ['食品', '3C', '家電', '日用', '美妝']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", {});
  }
};
