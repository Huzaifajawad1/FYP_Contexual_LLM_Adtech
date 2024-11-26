const { MongoClient } = require('mongodb');

async function getPrompt(userId, userTopic) {
  const url = 'mongodb+srv://huzaifa:fyp123@cluster1.sua0mdw.mongodb.net/';
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Successfully connected to Atlas');

    const marksCollection = client.db('Info').collection('Marks');
    const rangeCollection = client.db('Info').collection('Range');
    const promptsCollection = client.db('Info').collection('Prompts');

    const marksQuery = { ID: userId };
    const marks = await marksCollection.findOne(marksQuery);

    const rangeQuery = { Column: userTopic };
    const range = await rangeCollection.findOne(rangeQuery);

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




    const promptQuery = { topic_id: userTopic };
    const promptProjection = { _id: 0, [promptLevel]: 1 };
    const prompt = await promptsCollection.findOne(promptQuery, { projection: promptProjection });

    const promptString = prompt ? prompt[promptLevel] : null;
    // console.log(prompt);
    // console.log(marks[userTopic]);
    // console.log(range);

    return {
      marks: marks ? marks[userTopic] : null,
      range: range ? { low: range.Low, high: range.High } : null,
      prompt: promptString
    };
  } catch (err) {
    console.error(err.stack);
    throw new Error('Internal Server Error');
  } finally {
    await client.close();
  }
}
const x = 1;
const y = "what is a pointer?";
getPrompt(x,y);


module.exports = getPrompt;
