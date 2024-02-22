'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts_Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Posts_Tag.init({
    PostsId: DataTypes.INTEGER,
    TagsId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Posts_Tag',
  });
  return Posts_Tag;
};