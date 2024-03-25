const app_name = "syntax-sensei-a349ca4c0ed0";

exports.buildPath = function (route) {
  if (process.env.NODE_ENV === "production")
  {
    return `https://${app_name}.herokuapp.com/${route}`;
  }
  else
  {
    return `http://localhost:5000/${route}`;
  }
}