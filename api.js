require("express");
require("mongodb");

exports.setApp = function (app, client) {
  
  const JWT = require("./createJWT.js");
  const ObjectId = require('mongodb').ObjectId;
  const bcrypt = require("bcrypt");
  const { sendVerificationEmail, sendPassRec, sendPassConfirmation } = require('./authenticationHandler');
  const randomstring = require('randomstring');
  
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
    
    try
    {
      let users = client.db("MainDatabase").collection("Users");
      
      const result = await users.findOne({ Username: login });
      
      if (result != null)
      {
        const auth = await bcrypt.compare(password, result.Password);
        
        if (auth)
        {
          let { _id, FirstName, LastName, Verified } = result;
          
          // Create the token
          token = JWT.createAccessToken(FirstName, LastName, Verified, _id).accessToken;
        }
        else
        {
          error = "Login/Password incorrect";
          status = 400;
        }
      }
      else
      {
        error = "Login/Password incorrect";
        status = 400;
      }
    }
    catch (e)
    {
      error = e.message;
      status = 500;
    }
    
    let ret = { token: token, error: error };
    
    res.status(status).json(ret);
  });
  
  // Signup
  //
  // Incoming: FirstName, LastName, Email, Username, Password
  // Outgoing: token, error
  //
  // Signup
  //
  // Incoming: FirstName, LastName, Email, Username, Password
  // Outgoing: token, error
  //
  app.post("/api/signup", async (req, res, next) => {
    
    const { FirstName, LastName, Email, Username, Password } = req.body;
    
    let token = null;
    let error = "";
    let status = 200;
    
    if (Username)
    {
      try
      {
        let users = client.db("MainDatabase").collection("Users");
        let userCourses = client.db("MainDatabase").collection("UserCourses");
        
        // Check if Username is available
        const existingUser = await users.findOne({ Username: Username });
        
        if (existingUser == null)
        {
          // Hash the password before storing it
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(Password, salt);
          
          // Add user to database
          const newUser = await users.insertOne({ FirstName: FirstName, LastName: LastName, Email: Email, Username: Username, Password: hashedPassword, Verified: false });

          
        const languages = ['c++', 'python', 'haskell'];
        let userCourseDocuments = [];

        for (const language of languages) {
            const userCourseDoc = await userCourses.insertOne({
                Language: language,
                UserId: newUser.insertedId.toString(), 
                DateLastWorked: 0,
                CurrentQuestion: 0,
                NumCorrect: 0
            });

            userCourseDocuments.push(userCourseDoc);
        }
          
          // Create the token
          token = JWT.createAccessToken(FirstName, LastName, false, newUser.insertedId).accessToken;
        }
        else
        {
          error = "Username already exists";
          status = 400;
        }
      }
      catch (e)
      {
        error = e.message;
        status = 500;
      }
    }
    else
    {
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
  app.post('/api/sendVerificationLink', async (req, res, next) => {
    
    const { token } = req.body;
    
    let error = "";
    let status = 200;
    
    try
    {
      if (JWT.isValidAccessToken(token))
      {
        const { userId, verified } = JWT.getPayload(token);
        
        if (verified)
        {
          error = "Account already verified";
          status = 400;
        }
        else
        {
          // Connect to database
          
          let users = client.db("MainDatabase").collection("Users");
          
          if (users != null)
          {
            const user = await users.findOne({"_id": ObjectId.createFromHexString(userId)});
            
            if (user)
            {
              if (!(user.Verified))
              {
                sendVerificationEmail(user);
                //sendPassRec(user);
                //sendPassConfirmation(user);
              }
              else
              {
                error = "Account already verified";
                status = 400;
              }
            }
            else
            {
              error = "User not found";
              status = 400;
            }
          }
          else
          {
            error = "Unable to connect to database";
            status = 500;
          }
        }
      }
      else
      {
        error = "Access token is not valid";
        status = 401;
      }
    }
    catch (e)
    {
      error = e.message;
      status = 500;
    }
    
    res.status(status).json({error: error});
  });
  
  
  // Request Password Reset
  //
  // Incoming: username, email
  // Outgoing: error
  //
  app.post('/api/requestPasswordReset', async (req, res, next) => {
    
    const { username, email } = req.body;
    
    let status = 200;
    let error = "";
    
    try
    {
      if (username && email)
      {
        let Users = client.db("MainDatabase").collection("Users");

        if (Users != null)
        {
          const user = await Users.findOne({"Username": username});

          if (user)
          {
            // Send Email
            sendPassRec(user);
            
          }
        }
      }
      else
      {
        status = 400;
        error = 'username or email is not defined';
      }
    }
    catch (e)
    {
      status = 500;
      error = e.message;
    }
    
    res.status(status).json({error: error});
  });


  // Change Password
  //
  // Incoming: token, oldPassword, newPassword
  // Outgoing: token, error
  //
  app.post('/api/changePassword', async (req, res, next) => {

    const { token, oldPassword, newPassword } = req.body;

    let refreshedToken = null;

    let status = 200;
    let error = "";

    try
    {
      if (JWT.isValidAccessToken(token))
      {
        let { userId, verified } = JWT.getPayload(token);

        if (verified)
        {
          if (oldPassword && newPassword)
          {
            const Users = client.db("MainDatabase").collection("Users");

            if (Users)
            {
              const result = await Users.findOne({"_id": ObjectId.createFromHexString(userId)});

              if (result)
              {
                const auth = await bcrypt.compare(oldPassword, result.Password);

                if (auth)
                {
                  // Hash the password before storing it
                  const salt = await bcrypt.genSalt();
                  const hashedPassword = await bcrypt.hash(newPassword, salt);

                  Users.updateOne({"_id": ObjectId.createFromHexString(userId)}, {$set: {Password: hashedPassword}});

                  // Refresh the token
                  refreshedToken = JWT.refresh(token).accessToken;
                }
                else
                {
                  status = 400;
                  error = "Password incorrect";
                }
              }
              else
              {
                status = 400;
                error = "User not found";
              }
            }
            else
            {
              status = 500;
              error = "Unable to connect to database";
            }
          }
          else
          {
            status = 400;
            error = "Password missing";
          }
        }
        else
        {
          status = 403;
          error = "User not verified";
        }
      }
      else
      {
        status = 401;
        error = "Access token not valid";
      }
    }
    catch (e)
    {
      status = 500;
      error = e.message;
    }

    res.status(status).json({token: refreshedToken, error: error});
  });
  
  
  // Process email verification link
  //
  app.get('/verify/:token', async (req, res) => {
    
    const { token } = req.params;
    
    let status;
    let message;
    
    try
    {
      if (!JWT.isValidVerificationToken(token))
      {
        status = 400;
        message = 'The verification link has expired ):';
      }
      else
      {
        const { userId } = JWT.getPayload(token);
        
        let users = client.db("MainDatabase").collection("Users");
        
        if (users != null)
        {
          const user = await users.findOne({"_id": ObjectId.createFromHexString(userId)});
          
          if (user.Verified)
          {
            status = 400;
            message = 'This account is already verified |:';
          }
          else
          {
            users.updateOne({"_id": ObjectId.createFromHexString(userId)}, {$set: {Verified: true}});
            
            status = 200;
            message = '<h1>Yay! Your account is now verified (:</h1><br><a href="http://localhost:3000/login">Click here to login</a>';
          }
        }
        else
        {
          status = 500;
          message = 'There was an error connecting to our database. Please try again later... );';
        }
      }
    }
    catch (e)
    {
      status = 500;
      message = e.message;
    }
    
    res.status(status).send(message);
  });
  
  
  // Process password reset link
  //
  app.get('/reset/:token', async (req, res) => {
    
    const { token } = req.params;
    
    let status;
    let message;
    
    try
    {
      if (!JWT.isValidVerificationToken(token))
      {
        status = 400;
        message = 'The password reset link has expired';
      }
      else
      {
        const { userId } = JWT.getPayload(token);
        
        let Users = client.db("MainDatabase").collection("Users");
        
        if (Users != null) {
          let user = await Users.findOne({ "_id": ObjectId.createFromHexString(userId) });
          if (user) {
            let randPassword = randomstring.generate(15);
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(randPassword, salt);
            await Users.updateOne({ "_id": ObjectId.createFromHexString(userId) }, { $set: { Password: hashedPassword } });
            status = 200;
            message = `Password successfully reset\n\nNew password: ${randPassword}`;
            sendPassConfirmation(user);
          } else {
            status = 404;
            message = 'User not found';
          }
        }
        else
        {
          status = 500;
          message = 'There was an error connecting to our database. Please try again later...';
        }
      }
    }
    catch (e)
    {
      status = 500;
      message = e.message;
    }
    
    res.status(status).send(message);
  });
  
  
  // Process password reset link
  //
  app.get('/reset/:token', async (req, res) => {
    
    const { token } = req.params;
    
    let status;
    let message;
    
    try
    {
      if (!JWT.isValidVerificationToken(token))
      {
        status = 400;
        message = 'The password reset link has expired';
      }
      else
      {
        const { userId } = JWT.getPayload(token);
        
        let Users = client.db("MainDatabase").collection("Users");
        
        if (Users != null) {
          let user = await Users.findOne({ "_id": ObjectId.createFromHexString(userId) });
          if (user) {
            // new password 
            let randPassword = randomstring.generate(15);

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(randPassword, salt);
            await Users.updateOne({ "_id": ObjectId.createFromHexString(userId) }, { $set: { Password: hashedPassword } });
            status = 200;
            message = `Password successfully reset\n\nNew password: ${randPassword}`;
            sendPassConfirmation(user);
          } else {
            status = 404;
            message = 'User not found';
          }
        }
        else
        {
          status = 500;
          message = 'There was an error connecting to our database. Please try again later...';
        }
      }
    }
    catch (e)
    {
      status = 500;
      message = e.message;
    }
    
    res.status(status).send(message);
  });

// Return User Courses
//
// Incoming: Authorization token
// Outgoing: Array of user-specific course objects, error
//

  app.get("/api/user-courses", async (req, res, next) => {
    let status = 200;
    let userCoursesData = [];
    let error = "";
  
    try {
        // Check if the Authorization header exists
        if (!req.headers.authorization) {
            error = "Authorization header is missing";
            status = 400;
        } else {
          const token = req.headers.authorization.split(" ")[1];

          if (!token) {
              error = "Bearer token is missing";
              status = 400;
          } else {
            if (JWT.isValidAccessToken(token)) {
              const payload = JWT.getPayload(token);
              const { userId, verified } = payload;
              let userCoursesCollection = client.db("MainDatabase").collection("UserCourses");
    
              if (verified){
                // Fetch user course IDs from UserCourses collection
                userCoursesData = await userCoursesCollection.find({ UserId: userId.toString() }).toArray();
    
                if (userCoursesData.length === 0) {
                    error = "No courses found for this user";
                    status = 404;
                }
              } else {
                status = 403;
                error = "User not verified";
              }
            } else {
              status = 401;
              error = "Invalid access token";
            }
          }
        }
    } catch (e) {
        error = e.message;
        status = 500;
    }

    res.status(status).json({ courses: userCoursesData, error: error });
});

  // Return Course Question Bank
//
// Incoming: CourseID
// Outgoing: Array of questions for the specific course, error
//

  app.get("/api/course-question-bank/:courseId", async (req, res, next) => {
    const courseId = req.params.courseId;
    let questions = [];
    let error = "";
    let status = 200;

    try {
      // Check if the CourseID is valid
      if (courseId == "") {
        throw new Error("Invalid CourseID");
      }

      let questionBankCollection = client.db("MainDatabase").collection("QuestionBank");

      // Fetch questions from QuestionBank collection for the given CourseID
      questions = await questionBankCollection.find({ Language: courseId }).toArray();
      if (questions.length === 0) {
        error = "No questions found for this course";
        status = 404;
      }
    } catch (e) {
      error = e.message;
      status = 500;
    }

    res.status(status).json({ questions: questions, error: error });
  });

  //Update Progress API
  app.post('/api/updateProgress', async (req, res, next) => {

    const { token, userCourses, currentQuestion, numCorrect } = req.body;

    let error = "";
    let status = 200;

    try {
      if (JWT.isValidAccessToken(token)) {
        const { userId, verified } = JWT.getPayload(token);

        if (!verified) {
          error = "Account not verified";
          status = 403;
        } else {

          if (userCourses !== undefined &&
              currentQuestion !== undefined &&
              numCorrect !== undefined)
          {
            // Connect to database

            let usersCourses = client.db("MainDatabase").collection("UserCourses");

            if (usersCourses != null) {
              const result = await usersCourses.findOne({ UserId: userId, Language: userCourses });
              
              if (result)
              {
                usersCourses.updateOne({ "_id": (result._id) }, { $set: { "CurrentQuestion": currentQuestion, "NumCorrect": numCorrect, "DateLastWorked": new Date() } });
              }
              else
              {
                error = "UserCourse is not valid";
                status = 400;
              }
            }
            else {
              error = "Unable to connect to database";
              status = 500;
            }
          }
          else
          {
            error = "Undefined parameters";
            status = 400;
          }
        }
      }
      else {
        error = "Access token is not valid";
        status = 401;
      }
    }
    catch (e) {
      error = e.message;
      status = 500;
    }

    res.status(status).json({ error: error });
  });

// Get Course Info API

    app.get("/api/getCourse/:language", async (req, res) => {
    let status = 200;
    let courseData = null;
    let error = "";

    try {
        let courses = client.db("MainDatabase").collection("Courses");
        courseData = await courses.findOne({ Language: req.params.language });

        if (!courseData) {
            error = "Course not found";
            status = 404;
        }
    } catch (e) {
        error = e.message;
        status = 500;
    }

    res.status(status).json({ courseData: courseData, error: error });
});
  
};