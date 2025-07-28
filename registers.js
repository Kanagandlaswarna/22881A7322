const axios = require("axios");

const data = {
  email: "kanagandlaswarna22aiml@student.vardhaman.org",
  name: "Kanagandla Swarna",
  mobileNo: "7780641678",
  githubUsername: "kanagandlaswarna",
  rollNo: "22881A7322",
  accessCode: "wPEfGZ"
};

axios.post("http://20.244.56.144/evaluation-service/register", data)
  .then(res => {
    console.log("Registered successfully:", res.data);
  })
  .catch(err => {
    console.error("Error registering:", err.response?.data || err.message);
  });
