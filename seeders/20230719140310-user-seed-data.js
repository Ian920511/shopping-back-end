'use strict';

const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      account: 'buyer001',
      password: bcrypt.hashSync('titaner', bcrypt.genSaltSync(10), null),
      name: faker.person.fullName(),
      role: 'buyer',
      tel: faker.phone.number('09########'),
      address: faker.location.streetAddress({ useFullAddress: true }),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      account: 'seller001',
      password: bcrypt.hashSync('titaner', bcrypt.genSaltSync(10), null),
      name: faker.person.fullName(),
      role: 'seller',
      tel: faker.phone.number('09########'),
      address: faker.location.streetAddress({ useFullAddress: true }),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", {})
  }
};
