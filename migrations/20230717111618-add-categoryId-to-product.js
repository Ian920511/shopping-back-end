'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     return queryInterface.addColumn("Products", "CategoryId", {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: {
         model: "Categories",
         key: "id",
       },
     });
},

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("Products", "CategoryId");
  }
};
