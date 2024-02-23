const { Op } = require("sequelize");
const formatTime = require("../helpers/formatWaktu");
const { User, Post, Profile, Tag } = require("../models");
const bcrypt = require("bcryptjs");

class Controller {
  static async register(req, res) {
    const { error } = req.query;
    try {
      res.render("register", { error });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async postRegister(req, res) {
    const { username, email, password } = req.body;
    // const profileImage = req.file.filename;
    // console.log(profileImage);
    // console.log(req.body, "<<<<<<<<<");

    try {
      await User.create({ username, email, password, role: "user" });
      res.redirect("/login");
    } catch (error) {
      console.log(error);

      if (error.name == "SequelizeValidationError") {
        let errormsg = error.errors.map((el) => {
          return el.message;
        });
        res.redirect(`/register?error=${errormsg}`);
      } else {
        res.send(error.message);
      }
    }
  }

  static async login(req, res) {
    const { error } = req.query;
    try {
      res.render("login", { error });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async postLogin(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (isValidPassword) {
          // case berhasil login
          req.session.userId = user.id; // ini artinya ngasih jejak kalau user ini sedang login, set di controller
          //   console.log(req.session)

          res.redirect(`/homepage`);
        } else {
          const error = `Password salah.`;
          res.redirect(`/login?error=${error}`);
        }
      } else {
        const error = `Username tidak ada.`;
        res.redirect(`/login?error=${error}`);
      }
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async getLogout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/login");
        }
      });
    } catch (error) {}
  }

  static async homepage(req, res) {
    const { error } = req.query;
    const dataTags = await Tag.findAll({ include: Post });
    // res.json(dataTags);
    try {
      const user = await User.findOne({
        include: Profile,
        where: { id: req.session.userId },
      });
      const dataPosts = await Post.findAll({
        include: [
          {
            model: User,
            include: [Profile],
          },
          {
            model: Tag,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // res.json(user);
      // res.json(dataPosts.posts);
      // console.log(dataPosts);
      //   res.send(dataPosts);
      const getPostCount = await User.getPostCount(req.session.userId)
    //   res.json(getPostCount)
    //   console.log(getPostCount)
      res.render("homepage", { dataPosts, user, formatTime, error, dataTags, getPostCount });
      //   res.send(user);
    } catch (error) {
      console.log(error);
    }
  }

  static async createPost(req, res) {
    const filePosts = req.file ? req.file.filename : null; // Jika req.file ada, gunakan req.file.filename. Jika tidak, gunakan null.
    const { title, content } = req.body;
    try {
      //   if ((tags[0] && tags[1]) || (tags[1] && tags[0])) {
      //     const tagsErrMs = `Choose tags or create a new one!`;
      //     return res.redirect(`/homepage?error=${tagsErrMs}`);
      //   } else if (tags[0] == "" && tags[1]) { // create tags
      //     await Tag.create({ name: tags[1] });
      //   }
      //   const [tag, created] = await Tag.findOrCreate({
      //     where: { name: tags },
      //   });

      const post = await Post.create({
        title,
        content,
        filePosts,
        UserId: req.session.userId,
      });
      // Array tag
      const tags = req.body.tags.split(",").map((tag) => tag.trim());
      //   const tags = ["tag1", "tag2", "tag3"];

      // Iterasi melalui setiap tag
      for (let tagName of tags) {
        // Mencari atau membuat tag
        const [tag, created] = await Tag.findOrCreate({
          where: { name: tagName },
        });
        // Menambahkan tag ke post
        await post.addTag(tag);
      }

      //   await post.addTag(tag);
      res.redirect("/homepage");
    } catch (error) {
      console.log(error);

      if (error.name == "SequelizeValidationError") {
        let errormsg = error.errors.map((el) => {
          return el.message;
        });
        res.redirect(`/homepage?error=${errormsg}`);
      } else {
        res.send(error.message);
      }
    }
  }

  static async profile(req, res) {
    try {
      const dataUser = await User.findOne({
        where: { id: req.session.userId },
        include: [
          Profile,
          {
            model: Post,
            where: { UserId: req.session.userId },
            required: false,
          },
        ],
        order: [[Post, "createdAt", "DESC"]], // ini akan mengurutkan post berdasarkan createdAt dalam urutan menurun
      });

      if (!dataUser.Profile) {
        res.redirect("/profile/create");
      } else {
        res.render("userProfile", { dataUser, formatTime });
      }

      //   res.send(dataUserPost)
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async createProfile(req, res) {
    const { error } = req.query;
    try {
      const dataUserProfile = await User.findOne({
        include: Profile,
        where: { id: req.session.userId },
      });

      res.render("createProfile", { dataUserProfile, error });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async saveProfile(req, res) {
    const { fullName, phoneNumber, address } = req.body;
    const profileImage = req.file.filename;
    try {
      await Profile.create({
        fullName,
        UserId: req.session.userId,
        phoneNumber,
        address,
        profilePicture: profileImage,
      });
      res.redirect("/profile");
    } catch (error) {
      console.log(error);

      if (error.name == "SequelizeValidationError") {
        let errormsg = error.errors.map((el) => {
          return el.message;
        });
        res.redirect(`/profile/create?error=${errormsg}`);
      } else {
        res.send(error.message);
      }
    }
  }

  static async othersProfile(req, res) {
    const { username } = req.params;

    try {
      const dataUser = await User.findOne({
        where: { username: username },
        include: [
          Profile,
          {
            model: Post,
            required: false,
          },
        ],
        order: [[Post, "createdAt", "DESC"]], // ini akan mengurutkan post berdasarkan createdAt dalam urutan menurun
      });

      res.render("othersProfile", { dataUser, formatTime });

      //   res.send(dataUserPost)
    } catch (error) {
      console.log(error);
    }
  }

  static async editProfile(req, res) {
    try {
      const dataUserProfile = await User.findOne({
        include: Profile,
        where: { id: req.session.userId },
      });

      res.render("editProfile", { dataUserProfile });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async search(req, res) {
    const { search } = req.query;
    try {
      const searchData = await Post.findAll({
        include: [
          {
            model: User,
            include: [Profile],
          },
        ],
        where: {
          content: {
            [Op.iLike]: `%${search}%`,
          },
        },
      });

      //   console.log(searchData);
      //   res.send(searchData);
      res.render("search", { searchData, search, formatTime });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
  static async saveEditProfile(req, res) {
    const { fullName, phoneNumber, address } = req.body;
    // console.log(req.body, "<<<<<<<<<<<");
    const profileImage = req.file ? req.file.filename : null;
    try {
      const [profile, created] = await Profile.findOrCreate({
        where: { UserId: req.session.userId },
        defaults: {
          UserId: req.session.userId,
          fullName,
          phoneNumber,
          address,
          profilePicture: profileImage,
        },
      });

      if (!created) {
        await profile.update({
          fullName,
          phoneNumber,
          address,
          profilePicture: profileImage,
        });
      }

      res.redirect("/profile");
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
  static async deletePost(req, res) {
    const { id: postId } = req.params;
    try {
      const posts = await Post.findByPk(postId);
      await posts.destroy();
      res.redirect("/homepage");
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
  static async deletePostInProfile(req, res) {
    const { id: postId } = req.params;
    try {
      // res.send("hapus");
      const posts = await Post.findByPk(postId);
      await posts.destroy();
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
  static async likePost(req, res) {
    const { id: postId } = req.params;
    try {
      const posts = await Post.findByPk(postId);
      const incrementResult = await posts.increment("likes", { by: 1 });
      res.redirect("/homepage");
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
}

module.exports = Controller;
