const { User, Post, Profile } = require("../models");
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
    const { username, email, password, role } = req.body;
    const profileImage = req.file.filename;
    // console.log(profileImage);
    // console.log(req.body, "<<<<<<<<<");

    try {
      await User.create({ username, email, password, role, profileImage });
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
    const user = await User.findOne({ where: { id: req.session.userId } });
    const dataPosts = await Post.findAll({ include: User });
    // const Post = await Post.findByPk(req.session.userId);
    try {
      // res.json(user);
      // res.json(dataPosts.posts);
      // console.log(dataPosts);
      res.render("homepage", { dataPosts, user });
    } catch (error) {}
  }

  static async createPost(req, res) {
    const filePosts = req.file.filename;
    const { title, content, image } = req.body;
    try {
      await Post.create({ title, content, filePosts, UserId: req.session.userId });
      res.redirect("/homepage");
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async profile(req, res) {
    try {
      res.send(`test`);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
}

module.exports = Controller;
