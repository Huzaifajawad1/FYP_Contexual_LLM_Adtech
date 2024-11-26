const { callToPython } =require('./app2');
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
// MongoDB connection URI
const url = 'mongodb+srv://huzaifa:fyp123@cluster1.sua0mdw.mongodb.net/';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });


app.post('/save', async (req, res) => {
  const { prompt, response, rating } = req.body;
  console.log(req.body);

  try {
    await client.connect();
    console.log("Reinforcement learning dataset connected");

    // Assuming 'Feedback' is the name of your collection
    const collection = client.db("Info").collection("Feedback");

    // Insert the data into the MongoDB collection
    const result = await collection.insertOne({ prompt, response, rating });
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    // Send a successful response back to the client
    res.status(201).send(`Document inserted with ID: ${result.insertedId}`);
  } catch (error) {
    console.error("Failed to insert document:", error);
    res.status(500).send("Failed to save data");
  } finally {
    await client.close();
}
});


// Define the route handler for the root endpoint
app.get('/', async (req, res) => {
  console.log('Route handler called');
  
  // Hardcoded values for user ID and topic
 // Replace with the desired topic
 console.log(req.query);
const x= req.query.userId;
const y = req.query.userPrompt;

 const userTopic =await callToPython(y);
 const userId = parseInt(x, 10); // Replace with the desired user ID------------------------------------------------------------------------>>>>>>>>>>>>>>>>>>>
  // const userTopic = y;
console.log(userId+" "+ userTopic );


if (userTopic!="none"){
  try {
    // Connect to MongoDB Atlas
    await client.connect();
    console.log('Successfully connected to Atlas');

    // Access the required collections
    const marksCollection = client.db('Info').collection('Marks');
    const rangeCollection = client.db('Info').collection('Range');
    const promptsCollection = client.db('Info').collection('Prompts');

    // Get marks for the specified ID and topic
    const marksQuery = { ID: userId };
    const marks = await marksCollection.findOne(marksQuery);

    // Get range for the specified topic
    const rangeQuery = { Column: userTopic };
    const range = await rangeCollection.findOne(rangeQuery);

    // Initialize variables for user marks, range low, range high, and prompt level
    const userMarks = marks ? marks[userTopic] : null;
    const rangeLow = range ? range.Low : null;
    const rangeHigh = range ? range.High : null;
    let promptLevel = '';

    // Determine prompt level based on user marks
    if (userMarks !== null && rangeLow !== null && rangeHigh !== null) {
      if (userMarks <= rangeLow) {
        promptLevel = 'Beginner ';
      } else if (userMarks > rangeLow && userMarks <= rangeHigh) {
        promptLevel = 'Intermediate';
      } else if (userMarks > rangeHigh) {
        promptLevel = 'Expert';
      }
    }

    // Get prompt for the specified topic and level
    const promptQuery = { topic_id: userTopic };
    const promptProjection = { _id: 0, [promptLevel]: 1 };
    const prompt = await promptsCollection.findOne(promptQuery, { projection: promptProjection });

    // Extract prompt string based on the determined prompt level
    const promptString = prompt ? prompt[promptLevel] : null;

    // Log the results to the console
    console.log(userId)
    console.log(userTopic);;
    console.log('User Marks:', userMarks);
    console.log('Range Low:', rangeLow);
    console.log('Range High:', rangeHigh);
    console.log('Prompt Level:', promptString);

    // Prepare response JSON
    const responseData = {
      marks: marks ? marks[userTopic] : null,
      range: range ? { low: range.Low, high: range.High } : null,
      prompt: promptString
    };

    // Send the results as JSON response
    res.json(responseData);
  } catch (err) {
    // Log errors and send an internal server error response
    console.log(err.stack);
    res.status(500).send('Internal Server Error');
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}
else{
  try {
    // Prepare response JSON
    const responseData = {
      marks: null,
      range: null,
      prompt: ""
    };

    // Send the results as JSON response
    res.json(responseData);
  } catch (err) {
    // Log errors and send an internal server error response
    console.log(err.stack);
    res.status(500).send('Internal Server Error');
  }
}
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

