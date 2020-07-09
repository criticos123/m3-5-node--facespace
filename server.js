"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};
const handleHomepage = (req, res) => {
  res.status(200).render("pages/homepage", { users: users });
};
const handleProfilePage = (req, res, next) => {
  const UserId = req.params.id;
  const findUser = users.find((user) => {
    return user._id === UserId;
  });
  if (!findUser) {
    next();
  }
  const listOfFriends = findUser.friends.map((friendId) => {
    const foundUser = users.find((user) => {
      return user._id === friendId;
    });
    return foundUser;
  });
  res.render("pages/profile", { findUser, listOfFriends });
};
const handleSignIn = (req, res) => {
  res.render("pages/signin");
};
const handleName = (req, res) => {
  const firstName = req.body.firstName;
  const findObject = users.find((event) => {
    if (firstName === event.name) {
      return true;
    } else {
      return false;
    }
  });

  if (findObject === undefined) {
    res.redirect("./signin");
  } else {
    res.redirect("/users/" + findObject._id);
  }
};
// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints

  .get("/users/:id", handleProfilePage)
  .get("/signin", handleSignIn)
  .get("/", handleHomepage)
  .post("/getname", handleName)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
