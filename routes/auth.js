const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const ArtistModel = require("./../model/Artist");
const uploader = require("./../config/cloudinary");
const protectAdminRoute = require("./../middlewares/protectAdminRoute");
const StyleModel = require("./../model/Style");
const UsersModel = require("./../model/User");

router.get("/signin", (req, res, next) => {
  res.render("auth/signin.hbs");
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signin", async (req, res, next) => {
  // DO something
  //   res.render("auth/signin.hbs");
  const { email, password } = req.body;
  const foundUser = await UsersModel.findOne({ email: email });

  if (!foundUser) {
    //   Display an error message telling the user that either the password
    // or the email is wrong
    req.flash("error", "Invalid credentials");
    res.redirect("/auth/signin");
    // res.render("auth/signin.hbs", { error: "Invalid credentials" });
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      // Display an error message telling the user that either the password
      // or the email is wrong
      req.flash("error", "Invalid credentials");
      res.redirect("/auth/signin");
      // res.render("auth/signin.hbs", { error: "Invalid credentials" });
    } else {
      // everything is fine so :
      // Authenticate the user...
      const userObject = foundUser.toObject();
      delete userObject.password; // remove password before saving user in session
      // console.log(req.session, "before defining current user");
      req.session.currentUser = userObject; // Stores the user in the session (data server side + a cookie is sent client side)

      req.flash("success", "Successfully logged in...");
      res.redirect("/profile");
    }
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    console.log(req.body);
    const newUser = { ...req.body };
    const foundUser = await UsersModel.findOne({ email: newUser.email });
    if (foundUser) {
      req.flash("warning", "Email already registered");
      res.redirect("/auth/signup");
    } else {
      const hashedPassword = bcrypt.hashSync(newUser.password, 10); //
      // console.log(newUser.password, hashedPassword);
      newUser.password = hashedPassword; //setting hashedpassword as the new password
      await UsersModel.create(newUser); // creating a user inside de user database with encrypted password instead of the regular one
      req.flash("success", "Congrats ! You are now registered !");
      res.redirect("/auth/signin");
    }
  } catch (err) {
    let errorMessage = "";
    for (field in err.errors) {
      console.log(field);
      errorMessage += err.errors[field].message + "\n";
    }
    req.flash("error", errorMessage);
    res.redirect("/auth/signup");
  }
});

router.get("/signout", (req, res, next) => {
  req.session.destroy(function (err) {
    res.redirect("/auth/signin");
  });
});

// email already used?
//good password ?

// router.post("/signup",(req, res, next) => {
//     res.render("auth/signin")
// });

module.exports = router;
