const express = require("express");
const app = express();
const router = require("./routes");
const session = require("express-session");
const multer = require("multer");
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(
  session({
    secret: "keyboard cat", // harus ada
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, //https
      sameSite: true, // untuk security dari csrf attack
    },
  })
);

app.use(router);
app.listen(port, () => {
  console.log(`listening app on localhost:${port}...`);
});
