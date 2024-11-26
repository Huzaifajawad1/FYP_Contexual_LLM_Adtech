const { spawn } = require('child_process');

function runPythonScript(inputString) {
  return new Promise((resolve, reject) => {
    // Spawn Python process
    const pythonProcess = spawn('python', ['./your_script.py']);

    let outputString = '';

    // Send data to Python script
    pythonProcess.stdin.write(inputString);
    pythonProcess.stdin.end();

    // Receive output from Python script
    pythonProcess.stdout.on('data', (data) => {
      outputString += data.toString();
    });

    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python script: ${data}`);
      reject(data.toString());
    });

    // Handle process exit
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        // Successfully executed
        resolve(outputString.trim());
      } else {
        console.log(`Python script exited with code ${code}`);
        reject(`Python script exited with code ${code}`);
      }
    });
  });
}

async function callToPython(input) {
  console.log(input);

  try {
    const response = await runPythonScript(input);
    console.log('Response:', response);
    // return JSON.stringify(response[0].generated_text);
    return response;
  } catch (error) {
    console.error('Error:', error);
    // Handle the error appropriately
    return null;
  }
}
// callToPython("what is a function?")
module.exports = { callToPython };

// Example usage

