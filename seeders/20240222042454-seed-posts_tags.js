"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const data = require("../data/posts_tags.json").map((element) => {
      element.createdAt = element.updatedAt = new Date();
      return element;
    });
    await queryInterface.bulkInsert("Posts_Tags", data, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Posts_Tags", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
