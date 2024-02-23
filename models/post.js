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
      Post.belongsToMany(models.Tag, {
        through: "Posts_Tags",
        foreignKey: "PostsId",
      });
    }

    get timeSincePosted() {
      const diff = Date.now() - this.createdAt; // selisih dalam milidetik
      const seconds = Math.floor(diff / 1000); // konversi ke detik

      const units = [
        ["tahun", 60 * 60 * 24 * 365],
        ["bulan", 60 * 60 * 24 * 30],
        ["hari", 60 * 60 * 24],
        ["jam", 60 * 60],
        ["menit", 60],
        ["detik", 1],
      ];

      // Cari unit waktu yang paling cocok
      for (let [unit, limit] of units) {
        if (seconds >= limit) {
          const value = Math.floor(seconds / limit);
          return `${value} ${unit} yang lalu`;
        }
      }

      return "baru saja";
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
