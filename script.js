 // Check browser support
 window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 if (!('SpeechRecognition' in window)) {
   alert("Sorry, your browser does not support Speech Recognition. Try Chrome!");
 }

 const recognition = new SpeechRecognition();
 recognition.interimResults = true; // live, in-progress transcription while the user is still speaking. Without this, you'd only get the final result after a pause.
 recognition.continuous = true; // Keeps listening until stopped
 recognition.lang = 'en-US'; // language for recognition

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
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.push(note);
      localStorage.setItem('notes', JSON.stringify(notes));
      finalTranscript = '';
      transcriptDiv.textContent = '';
      displayNotes();
    } else {
      alert('Nothing to save!');
    }
  });
  
  function displayNotes() {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
  
    notes.forEach((note, index) => {
      const li = document.createElement('li');
      li.textContent = note;
  
      // Use your delete icon
      const deleteIcon = document.createElement('img');
      deleteIcon.src = 'recycle-bin.png'; 
      deleteIcon.alt = 'Delete';
      deleteIcon.addEventListener('click', () => {
        deleteNote(index);
      });
  
      li.appendChild(deleteIcon);
      notesList.appendChild(li);
    });
  }
  
  
  function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
  }
  
  window.onload = displayNotes;

 /*
  Creates a Blob (Binary Large OBject) from the transcript.

A blob lets you handle data like files in memory.

Here, it's a plain text blob.
 */