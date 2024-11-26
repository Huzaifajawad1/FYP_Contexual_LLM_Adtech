import  axios  from 'axios';
let testdata='';

export  async function sendMsgToModel(input) {
 

 const preprompt = input;
 const youruserId = sessionStorage.getItem('userID');
//  sessionStorage.getItem('userID', youruserId);
//  sessionStorage.setItem('userID', idInput);
// Replace with the desired user ID<------------------------------------>
  let retrPrompt = ""; // Replace with the desired topic
  let prompt=""

  try {
    const response = await axios.get(`http://localhost:3000/?userId=${encodeURIComponent(youruserId)}&userPrompt=${encodeURIComponent(preprompt)}`);
    retrPrompt = response.data.prompt;
    console.log(retrPrompt);
    if (retrPrompt=="")
      {console.log("Recieved None");
     prompt = `You are a programming fundamentals teacher</s>  ${input} `;
      }
      else{
     prompt = `You are a programming fundamentals teacher</s>  ${input} , explain with these, ${retrPrompt} </s>`;
    }
    console.log(prompt);

    const callFuncResponse = await callFunc({ "inputs": prompt });
    console.log("my name is huzaifa");
    console.log(callFuncResponse);
    console.log("my name is huzaifa");
    console.log(JSON.stringify(callFuncResponse));
    
if (callFuncResponse) {
  return JSON.stringify(callFuncResponse);
} else {
  console.log("Target substring not found in the message.");
}
} catch (error) {
  console.error('Error fetching data in model.js:', error);
  // Handle the error appropriately
  return null;
}
  }
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  // Initialize the Google Generative AI with the API key stored in an environment variable
  const genAI = new GoogleGenerativeAI("AIzaSyArhT55iwzFJZprK5JeOGXA2I2N202hCj4");
  async function callFunc(data) {
    try {
      // Using the gemini-pro model for text generation
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = JSON.stringify(data); // Assuming 'data' contains your prompt
  
      // Generate content based on the provided prompt
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text(); // Get the text result from the response
  
      console.log(text);
      return text;
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new Error('Server error');
    }
  }
//  sendMsgToModel("what is a function?");