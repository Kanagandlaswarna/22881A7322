const axios = require('axios');

const authData = {
  email: "kanagandlaswarna22aiml@student.vardhaman.org",
  name: "Kanagandla Swarna",
  rollNo: "22881A7322",
  accessCode: "wPEfGZ",
  clientID: "ac5b31f5-3524-4275-b178-6ef4afa726fe",
  clientSecret: "BvEDdXtScMdjjDqW"
};

axios.post("http://20.244.56.144/evaluation-service/auth", authData)
  .then(response => {
    console.log("Authorization token response:", response.data);
  })
  .catch(error => {
    console.error("Error occurred:", error.response?.data || error.message);
  });
