// Label animations
document.querySelectorAll('.form input, .form textarea').forEach(function(input) {
    input.addEventListener('keyup', handleLabel);
    input.addEventListener('blur', handleLabel);
    input.addEventListener('focus', handleLabel);
  });
  
  function handleLabel(e) {
    const input = e.target;
    const label = input.previousElementSibling;
  
    console.log(`Label handler: ${e.type}, input value: "${input.value}"`);
  
    if (e.type === 'keyup') {
      if (input.value === '') {
        console.log('Keyup: empty value → remove active/highlight');
        label.classList.remove('active', 'highlight');
      } else {
        console.log('Keyup: has value → add active/highlight');
        label.classList.add('active', 'highlight');
      }
    } else if (e.type === 'blur') {
      if (input.value === '') {
        console.log('Blur: empty → remove active/highlight');
        label.classList.remove('active', 'highlight');
      } else {
        console.log('Blur: has value → remove highlight');
        label.classList.remove('highlight');
      }
    } else if (e.type === 'focus') {
      if (input.value === '') {
        console.log('Focus: empty → remove highlight');
        label.classList.remove('highlight');
      } else {
        console.log('Focus: has value → add highlight');
        label.classList.add('highlight');
      }
    }
  }
  
  // Tab switching
  document.querySelectorAll('.tab a').forEach(function(tabLink) {
    tabLink.addEventListener('click', function(e) {
      e.preventDefault();
  
      console.log(`Tab click: ${this.getAttribute('href')}`);
  
      this.parentElement.classList.add('active');
  
      this.parentElement.parentElement.querySelectorAll('li').forEach(li => {
        if (li !== this.parentElement) {
          li.classList.remove('active');
        }
      });
  
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
  
      console.log(`Switching to tab: ${targetId}`);
  
      document.querySelectorAll('.tab-content > div').forEach(div => {
        div.style.display = 'none';
      });
  
      fadeIn(target, 600);
    });
  });
  
  function fadeIn(element, duration) {
    console.log(`Fading in element: ${element.id}`);
    element.style.opacity = 0;
    element.style.display = 'block';
  
    let last = +new Date();
    const tick = function() {
      element.style.opacity = +element.style.opacity + (new Date() - last) / duration;
      last = +new Date();
  
      if (+element.style.opacity < 1) {
        requestAnimationFrame(tick);
      }
    };
    tick();
  }
  
  // ✅ SIGNUP
  document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const email = document.querySelector('#signupForm input[type="email"]').value.trim();
    const password = document.querySelector('#signupForm input[type="password"]').value;
  
    console.log(`Signup attempt → Email: ${email}`);
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('✅ Firebase createUserWithEmailAndPassword success:', userCredential);
        alert('Signed up successfully!');
      })
      .catch((error) => {
        console.error('❌ Firebase signup error:', error.code, error.message);
        alert(`Signup Error: ${error.message}`);
      });
  });
  
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // ✅ prevent default form submit
  
    const email = document.querySelector('#loginForm input[type="email"]').value.trim();
    const password = document.querySelector('#loginForm input[type="password"]').value.trim();
  
    console.log("Trying to log in → Email:", email, "| Password:", password);
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('✅ Firebase signIn success:', userCredential);
        alert('Logged in successfully!');
        // ✅ Redirect to your Speech Recognition Notes app
        window.location.href = "index.html";  // <-- your app page here
      })
      .catch((error) => {
        console.error('❌ Firebase login error:', error.code, error.message);
        alert(`Login Error: ${error.message}`);
      });
  });
  
  