'use strict';
var fs = require('fs');
const axios = require('axios');



async function analyzeDataStarling(inputText)
{

  const prompt = `tldr; ${inputText}`;
  // const prompt = `Write a concise summary of the following text, only respond with 5 bullet poinsts that cover the key points of the text. Only print the 5 points, no explanations needed. If not enough text was provided then echo back as is. Text: ${inputText}`;

    let response = await fetch("http://127.0.0.1:8080/completion", {
          method: 'POST',
          body: JSON.stringify({
              "prompt": prompt,
              "n_predict": 1024,
          })
      })
      console.log((await response.json()).content)
}

async function analyzeData(dataToAnalyze) {
  const url = 'http://localhost:11434/api/generate';
  //const url = 'http://localhost:8080/completion';
  const jsonDataStr = JSON.stringify(dataToAnalyze);
  const requestData = {
      model: 'llama3',
      //prompt: `<|start_header_id|>assistant<|end_header_id|>: Write a concise summary of the following text, only respond with 5 bullet poinsts that cover the key points of the text. Only print the 5 points, no explanations needed. If not enough text was provided then echo back as is. Text: ${jsonDataStr}`,
      //prompt: `<|start_header_id|>assistant<|end_header_id|>: Write a concise summary of the text, cover the key points of the text. ${jsonDataStr}`,
      prompt: `<|start_header_id|>assistant<|end_header_id|>: Write a concise summary of the text, cover the key points of the text. Organize in bullet points not more than 10. ${jsonDataStr}`,
      //prompt: `tldr; ${jsonDataStr}`,
      stream: false,
      options: {
        num_ctx: 56000
      }
    };


  try {
    // Send a POST request to the specified URL with the request payload
    console.log(url)
    console.log(requestData)
    const response = await axios.post(url, requestData);
    // Log the response data

    
    return response.data.response;
  } catch (error) {
    // Handle errors
    console.error('Error:', error.message);
  }
}

async function translateDatallama3(dataToAnalyze) {
  const url = 'http://localhost:11434/api/generate';
  //const url = 'http://127.0.0.1:8080/completion';
  //const jsonDataStr = JSON.stringify(dataToAnalyze);
  const requestData = {
      model: 'llama3',
      "prompt": `translate this text from English to Arabic. Do not mix english words in and do not explain approach: ${dataToAnalyze}`,
      //prompt: `tldr; ${jsonDataStr}`,
      stream: false,
      options: {
        num_ctx: 4096
      }
    };
      try {
      // Send a POST request to the specified URL with the request payload
      console.log(url)
      console.log(requestData)
  
      const response = await axios.post(url, requestData);
  
      // Log the response data
  
      return response.data.response;
    } catch (error) {
      // Handle errors
      console.error('Error:', error.message);
    }
  }

async function translateSummary(dataToAnalyze) {
  //const url = 'http://localhost:11434/api/generate';
  const url = 'http://127.0.0.1:8080/completion';
  const jsonDataStr = JSON.stringify(dataToAnalyze);
  const requestData = {
      //  model: 'llama3',
      "prompt": `translate this text from English to Arabic. Do not mix english words in and do not explain approach: ${jsonDataStr}`,
      "n_predict": 1024,
      //prompt: `<|start_header_id|>assistant<|end_header_id|>: Write a concise summary of the text, cover the key points of the text. Only print the 5 points, no explanations needed${jsonDataStr}`,
      //prompt: `tldr; ${jsonDataStr}`,
      stream: false,
      options: {
        num_ctx: 4096
      }
    };

  var inputText = `translate this text from English to Arabic. Do not mix english words in and do not explain approach: ${dataToAnalyze}`
  try {
    // Send a POST request to the specified URL with the request payload
    //const response = await axios.post(url, requestData);

    const response = await axios.post(url, {
      data: {"prompt": `translate this text from English to Arabic. Do not mix english words in and do not explain approach: ${inputText}`,
            "n_predict": 1024}
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // Log the response data

    
    return response.data.response;
  } catch (error) {
    // Handle errors
    console.error('Error:', error.message);
  }
}


async function loadTranscriptFile(transcript)
{
  try {
      const data = fs.readFileSync(transcript, 'utf8');
      return data;
  } catch (err) {
      console.error(err);
  }
}


async function runScript(transcript)
{
  //const transcriptData =  await parseTranscript(transcript);
  //already have screenshots, skip as a test
  //await generateScreenshots3(times1)

  //await buildPPT(text1);
  // await scanImageList()

  const text = await loadTranscriptFile(transcript)
  

  var linesPerChunk = 12
  // Split the file content into an array of lines
  const lines = text.split('\n');
        
  // Chunk the lines
  const chunks = [];
  for (let i = 0; i < lines.length; i += linesPerChunk) {
      chunks.push(lines.slice(i, i + linesPerChunk));
  }
  var summarizedText;
  var slide;
  for (let i = 0; i < chunks.length; i++) {
    summarizedText = await analyzeData(chunks[i])  
    console.log(chunks[i])  
    //summarizedText = await analyzeDataStarling(chunks[i])
    console.log(summarizedText)  
    //slide = pptx.makeNewSlide();
    //slide.addText(summarizedText)

    summaryFile.write(summarizedText);
  } 
  // Close the stream
  summaryFile.end();

  summaryFile.on('finish', () => {
      console.log('File written successfully');
  });

  // const outputStream = fs.createWriteStream(pptxPath);
  // pptx.generate(outputStream);


}

runScript( "./output/finCondensedRefined.txt")

// Export functions
module.exports = {
  analyzeData
};
