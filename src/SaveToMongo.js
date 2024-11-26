const axios = require('axios'); // Ensure you have axios installed

// Define the function to save data to MongoDB via your backend
async function savetomongo(prompt, response, rating) {
  try {
    // Construct the payload
    const payload = {
      prompt: prompt,
      response: response,
      rating: rating
    };

    // Make an HTTP POST request to your backend
    const result = await axios.post('http://localhost:3000/save', payload);
    console.log('Data successfully sent to the backend:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error sending data to the backend:', error);
    throw error;  // Re-throw the error to handle it further up the call stack if needed
  }
}

// Export the function to be used in other parts of your application
module.exports = { savetomongo };
