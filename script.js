const addNewNoteBtn = document.getElementById('addNewNoteBtn');
const homeView = document.getElementById('homeView');
const newNoteView = document.getElementById('newNoteView');

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const saveNewNoteBtn = document.getElementById('saveNewNoteBtn');
const cancelNewNoteBtn = document.getElementById('cancelNewNoteBtn');

const newNoteTitle = document.getElementById('newNoteTitle');
const newNoteContent = document.getElementById('newNoteContent');
const transcriptStatus = document.getElementById('transcriptStatus');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = 'en-US';

let isListening = false;
let finalTranscript = '';

addNewNoteBtn.addEventListener('click', () => {
  showNewNoteView();
});

function showNewNoteView() {
  homeView.style.display = 'none';
  newNoteView.style.display = 'block';
  newNoteTitle.value = '';
  newNoteContent.value = '';
  finalTranscript = '';
  transcriptStatus.textContent = 'Click Start Listening to begin.';
}

function showHomeView() {
  homeView.style.display = 'block';
  newNoteView.style.display = 'none';
  displayNotes();
}

startBtn.addEventListener('click', () => {
  finalTranscript = '';
  transcriptStatus.textContent = 'Listening...';
  recognition.start();
  isListening = true;
});

stopBtn.addEventListener('click', () => {
  recognition.stop();
  isListening = false;
  transcriptStatus.textContent = 'Stopped.';
});

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
  newNoteContent.value = finalTranscript + interimTranscript;
});

recognition.addEventListener('end', () => {
  isListening = false;
});

saveNewNoteBtn.addEventListener('click', () => {
  const title = newNoteTitle.value.trim();
  const content = newNoteContent.value.trim();
  const date = new Date().toLocaleString();

  if (!title || !content) {
    alert('Title and content are required!');
    return;
  }

  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.push({ title, content, tag: 'Personal', date });
  localStorage.setItem('notes', JSON.stringify(notes));

  showHomeView();
});

cancelNewNoteBtn.addEventListener('click', () => {
  showHomeView();
});
function displayNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
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

function showNoteDetails(note) {
  const detailsCard = document.getElementById('noteDetailsCard');
  detailsCard.innerHTML = `
    <h2>${note.title}</h2>
    <p><strong>Tag:</strong> ${note.tag || 'None'}</p>
    <p><strong>Date:</strong> ${note.date}</p>
    <p>${note.content}</p>
  `;
}

window.onload = displayNotes;


function deleteNote(index) {
  swal({
    title: "Are you sure?",
    text: "This note will be deleted permanently.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.splice(index, 1);
      localStorage.setItem('notes', JSON.stringify(notes));
      displayNotes();
      swal("Your note has been deleted!", { icon: "success" });
    }
  });
}
// ✅ 10️⃣ Modal Close
