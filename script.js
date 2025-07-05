 // Check browser support
 window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 if (!('SpeechRecognition' in window)) {
   alert("Sorry, your browser does not support Speech Recognition. Try Chrome!");
 }

 const recognition = new SpeechRecognition();
 recognition.interimResults = true; // live, in-progress transcription while the user is still speaking.
 recognition.continuous = true; // Keeps listening until stopped
 recognition.lang = 'en-US';

 const startStopBtn = document.getElementById('startStopBtn');
 const saveBtn = document.getElementById('saveBtn');
 const transcriptDiv = document.getElementById('transcript');

 let isListening = false;
 let finalTranscript = '';

 recognition.addEventListener('result', e => {
   let interimTranscript = '';
   for (let i = e.resultIndex; i < e.results.length; ++i) {
     const transcript = e.results[i][0].transcript;
     if (e.results[i].isFinal) {
       finalTranscript += transcript + ' ';
     } else {
       interimTranscript += transcript;
     }
   }
   transcriptDiv.textContent = finalTranscript + interimTranscript;
 });

 recognition.addEventListener('end', () => {
   if (isListening) {
     recognition.start(); // Keep listening
   }
 });

 startStopBtn.addEventListener('click', () => {
   if (isListening) {
     recognition.stop();
     isListening = false;
     startStopBtn.textContent = 'Start Listening';
   } else {
     recognition.start();
     isListening = true;
     startStopBtn.textContent = 'Stop Listening';
   }
 });

 saveBtn.addEventListener('click', () => {
   const note = finalTranscript.trim();
   if (note) {
     const blob = new Blob([note], { type: 'text/plain' });
     const url = URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = url;
     link.download = 'note.txt';
     link.click();
     URL.revokeObjectURL(url);
     alert('Note saved as note.txt!');
   } else {
     alert('Nothing to save yet!');
   }
 });