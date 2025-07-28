const axios = require('axios');

const data = {
  companyName: "SwarnaAI",
  ownerName: "Swarna Kanagandla",
  rollNo: "12345678",
  ownerEmail: "swarna@example.com",
  accessCode: "FKDLjg"
};

axios.post('https://20.244.56.144/evaluation-service/register', data)
  .then(response => {
    console.log("✅ Registration Success:");
    console.log(response.data);
  })
  .catch(error => {
    console.error("❌ Error registering:");
    console.error(error.response ? error.response.data : error.message);
  });
