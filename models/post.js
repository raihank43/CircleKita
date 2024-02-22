"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: "UserId" });
      Post.belongsToMany(models.Tag, { through: "Posts_Tags", foreignKey: "PostsId" });
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title is required",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Content is required",
          },
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      likes: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      filePosts: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  Post.beforeCreate(async (posts, options) => {
    posts.likes = 0;
  });
  return Post;
};
