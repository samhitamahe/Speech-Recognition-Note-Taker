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
    const noteText = finalTranscript.trim();
    if (noteText) {
      // Open the modal
      document.getElementById('noteModal').style.display = 'block';
      document.getElementById('noteContent').value = noteText;
    } else {
      alert('Nothing to save yet!');
    }
  });
  
  function displayNotes() {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
  
    notes.forEach((note, index) => {
      const li = document.createElement('li');
      li.textContent = note.title;
  
      li.addEventListener('click', () => {
        showNoteDetails(note);
      });
  
      const deleteIcon = document.createElement('img');
      deleteIcon.src = 'https://i.ibb.co/JWLTZ6Yy/delete-icon.png';
      deleteIcon.alt = 'Delete';
      deleteIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteNote(index);
      });
  
      li.appendChild(deleteIcon);
      notesList.appendChild(li);
    });
  }
  
  
  function deleteNote(index) {
    swal({
      title: "Are you sure?",
      text: "This note will be deleted permanently.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
        swal("Your note has been deleted!", { icon: "success" });
      }
    });
  }
  
  
  
  window.onload = displayNotes;
  document.getElementById('closeModal').onclick = () => {
    document.getElementById('noteModal').style.display = 'none';
  };

  window.onclick = function(event) {
    const modal = document.getElementById('noteModal');
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  document.getElementById('saveNoteDetailsBtn').addEventListener('click', () => {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    const tag = document.getElementById('noteTag').value.trim();
    const date = new Date().toLocaleString();
  
    if (title && content) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
  
      const newNote = {
        title: title,
        content: content,
        tag: tag,
        date: date
      };
  
      notes.push(newNote);
      localStorage.setItem('notes', JSON.stringify(notes));
  
      // Reset fields
      finalTranscript = '';
      transcriptDiv.textContent = '';
      document.getElementById('noteTitle').value = '';
      document.getElementById('noteTag').value = '';
  
      // Close modal
      document.getElementById('noteModal').style.display = 'none';
  
      // Refresh sidebar
      displayNotes();
    } else {
      alert('Title and content are required!');
    }
  });
  function showNoteDetails(note) {
    const detailsCard = document.getElementById('noteDetailsCard');
    detailsCard.innerHTML = `
      <h2>${note.title}</h2>
      <p><strong>Tag:</strong> ${note.tag || 'None'}</p>
      <p><strong>Date:</strong> ${note.date}</p>
      <p>${note.content}</p>
    `;
  }
  

 /*
  Creates a Blob (Binary Large OBject) from the transcript.

A blob lets you handle data like files in memory.

Here, it's a plain text blob.
 */