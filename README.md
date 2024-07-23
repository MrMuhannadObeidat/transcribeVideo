# transcribeVideo
<!-- ABOUT THE PROJECT -->
## About The Project

This is a foundational project for how to do the following:
Extract audio from a video recording into a wav file in mono format
Use VOSK model to transcribe the audio file into text
Use llama3 model to summarize the text of the video into summarized chunks/bullet points
<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

Major frameworks/libraries used to bootstrap this project.

* ollama to run models
* Quantized llama3 model running locally
* VOSK model (Big US English model with dynamic graph, vosk-model-en-us-0.22-lgraph)
* ffmpeg
* python
* nodejs

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
* python 3.11 and above
* python libraries: wave, json, vosk
* nodejs
* nodejs libraries: axios, fs

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage
* Use ffmpeg to extract audio file from your video.
```sh
   ffmpeg -i fin.mp4 -q:a 0 -map a ./output/fin.wav
```
* File may have more than one channel, split into two channels and confirm where the audio is by playing both files in an audio player
```sh
   ffmpeg -i ../output/fin.wav -ar 16000 -ac 1 -acodec pcm_s16le  -map_channel 0.0.0 ./output/left.wav -map_channel 0.0.1 ./output/right.wav
```
* If the file that has the audio is the left channel, then use that in transcribe.py. Edit filename and add to python script. Also edit output file name where the transcribed audio will go.
```sh
   python transcribe.py
```
* Cleanup output file to only include full text fragments
```sh
   cat fin24.txt | grep text | grep -v \"\" | grep -v partial > finCondensed.txt
```
* start llama3 using ollama and default port
```sh
   ollama run llama3
```

* Run the analyze nodejs script to chunk through the text 12 lines at a time and summarize
```sh
   node analyzeTranscript
```

* Inpsect output file named finCondensedRefined.txt




<p align="right">(<a href="#readme-top">back to top</a>)</p>

