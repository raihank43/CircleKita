const { User } = require("../models");
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

    try {
      await User.create({ username, email, password, role });
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

          res.redirect("/homepage");
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
    res.render("homepage");
  }
}

module.exports = Controller;
