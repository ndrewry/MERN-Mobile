require("express");
require("mongodb");

exports.setApp = function (app, client) {
  const JWT = require("./createJWT.js");
  const ObjectId = require("mongodb").ObjectId;
  const bcrypt = require("bcrypt");

  // Login
  //
  // Incoming: login, password
  // Outgoing: token, error
  //
  app.post("/api/login", async (req, res, next) => {
    const { login, password } = req.body;

    let token = null;
    let error = "";
    let status = 200;

    try {
      let users = client.db("MainDatabase").collection("Users");

      const result = await users.findOne({ Username: login });

      if (result != null) {
        const auth = await bcrypt.compare(password, result.Password);

        if (auth) {
          let { _id, FirstName, LastName, Verified } = result;

          // Create the token
          token = JWT.createToken(
            FirstName,
            LastName,
            Verified,
            _id
          ).accessToken;
        } else {
          error = "Login/Password incorrect";
          status = 400;
        }
      } else {
        error = "Login/Password incorrect";
        status = 400;
      }
    } catch (e) {
      error = e.message;
      status = 500;
    }

    let ret = { token: token, error: error };

    res.status(status).json(ret);
  });

  // Signup
  //
  // Incoming: FirstName, LastName, Email, Username, Password, Course
  // Course takes in ID,ID,ID. (As many ID's needed but with commas to seperate)
  // Outgoing: token, error
  //
  app.post("/api/signup", async (req, res, next) => {
    const { FirstName, LastName, Email, Username, Password, Course } = req.body;

    let token = null;
    let error = "";
    let progressArray = [
      { CurrentQuestion: 0, NumCorrect: 0 },
      { CurrentQuestion: 0, NumCorrect: 0 },
      { CurrentQuestion: 0, NumCorrect: 0 },
    ];
    let status = 200;

    if (Username) {
      try {
        let users = client.db("MainDatabase").collection("Users");
        let userCourses = client.db("MainDatabase").collection("UserCourses");

        // Check if Username is available
        const existingUser = await users.findOne({ Username: Username });

        if (existingUser == null) {
          // Hash the password before storing it
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(Password, salt);

          // Convert Course from comma-separated string to an array
          const courseArray = Course ? Course.split(",") : [];

          // Add user to database
          const newUser = await users.insertOne({
            FirstName: FirstName,
            LastName: LastName,
            Email: Email,
            Username: Username,
            Password: hashedPassword,
            Verified: false,
          });

          const userCoursesDocuments = courseArray.map((courseId) => ({
            CourseID: courseId.trim(),
            UserID: newUser.insertedId.toString(),
            DateLastWorked: new Date(),
            TimeSpent: 0,
            Progress: progressArray,
          }));

          if (userCoursesDocuments.length > 0) {
            await userCourses.insertMany(userCoursesDocuments);
          }

          // Create the token
          token = JWT.createToken(
            FirstName,
            LastName,
            false,
            newUser.insertedId
          ).accessToken;
        } else {
          error = "Username already exists";
          status = 400;
        }
      } catch (e) {
        error = e.message;
        status = 500;
      }
    } else {
      error = "Username field missing";
      status = 400;
    }

    let ret = { token: token, error: error };

    res.status(status).json(ret);
  });

  // Send Verification Link
  //
  // Incoming: token
  // Outgoing: error
  //
  app.post("/api/sendVerificationLink", async (req, res, next) => {
    const { token } = req.body;

    let error = "";

    const { userId, verified } = JWT.getPayload(token);

    if (verified) {
      error = "Account already verified";
    } else {
      // Connect to database
      let users = null;
      try {
        users = client.db("MainDatabase").collection("Users");
      } catch (e) {
        error = e.message;
      }

      if (users != null) {
        const user = await users.findOne({
          _id: ObjectId.createFromHexString(userId),
        });

        if (user) {
          console.log(user.Email);
        } else {
          error = "User not found";
        }
      }
    }

    res.status(200).json({ error: error });
  });

  // Process email verification link
  //
  app.get("/verify/:token", (req, res) => {
    const { token } = req.params;

    try {
      if (JWT.isExpired(token)) {
        res.status(200).send("The verification link has expired ):");
      } else if (JWT.isVerified(token)) {
        res.status(200).send("This account is already verified |:");
      } else {
        // Actually change the verification status in the database

        const { userId } = JWT.getPayload(token);

        // Connect to database
        let users = null;

        users = client.db("MainDatabase").collection("Users");

        if (users != null) {
          users.updateOne(
            { _id: ObjectId.createFromHexString(userId) },
            { $set: { Verified: true } }
          );

          res.status(200).send("Yay! Your account is now verified (:");
        } else {
          res
            .status(500)
            .send(
              "There was an error connecting to our database. Please try again later... );"
            );
        }
      }
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
};