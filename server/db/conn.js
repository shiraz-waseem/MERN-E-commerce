const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://shirazwaseem321:4vnAcsghD3tYtncm@cluster0.epde33h.mongodb.net/EcommerceStore?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connection successfully");
  })
  .catch((e) => {
    console.log(e);
  });
