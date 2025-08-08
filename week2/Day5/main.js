const app = document.getElementById("app");

function loadPage(pageUrl) {
  fetch(pageUrl)
    .then(res => res.text())
    .then(html => {
      app.innerHTML = html;
      // Use requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        attachEvents();
      });
    });
}

function attachEvents() {
  const getStartedBtn = document.getElementById("getStartedBtn");
  const goToLoginFromSignup = document.getElementById("loginpage");
  const goToSignupFromLogin = document.getElementById("backtosignup");
  const signupForm = document.querySelector("#signupform");
  const loginForm = document.querySelector("#loginform");

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => loadPage("signup.html"));
  }

  if (goToLoginFromSignup) {
    goToLoginFromSignup.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage("login.html");
    });
  }

  if (goToSignupFromLogin) {
    goToSignupFromLogin.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage("signup.html");
    });
  }

  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fullName = document.getElementById("full-name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirm_password = document.getElementById("confirm-password").value.trim();

      if (!fullName || !email || !password || !confirm_password) {
        alert("All fields are required!");
        return;
      }

      if (password !== confirm_password) {
        alert("Passwords do not match!");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];

      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        alert("Email already registered. Please login.");
        return;
      }

      users.push({ fullName, email, password });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Signup Successful!");
      loadPage("login.html");
    });
  }

  // Login form
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please enter both Email and Password");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const foundUser = users.find(user => user.email === email && user.password === password);

      if (foundUser) {
        localStorage.setItem("currentUser", email);
        alert("Login Successful!");
        loadPage("profile.html");
      } else {
        alert("Invalid email or password!");
      }
    });
  }

  // Check if we're on the profile page
  if (document.getElementById('profile-name')) {
    // Add multiple attempts to ensure it works
    loadProfileData();
    setTimeout(loadProfileData, 100);
    setTimeout(loadProfileData, 500);
  }
}

function loadProfileData() {
  // Get current user data from localStorage
  const currentUserEmail = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Find current user
  const currentUser = users.find(user => user.email === currentUserEmail);
  
  if (currentUser && currentUser.fullName) {
    // Update profile elements with more aggressive approach
    const profileNameEl = document.getElementById('profile-name');
    const profileFullNameEl = document.getElementById('profile-full-name');
    const profileEmailEl = document.getElementById('profile-email');
    
    if (profileNameEl) {
      profileNameEl.textContent = currentUser.fullName;
      profileNameEl.innerHTML = currentUser.fullName;
      // Force a style update
      profileNameEl.style.display = 'block';
    }
    if (profileFullNameEl) {
      profileFullNameEl.textContent = currentUser.fullName;
      profileFullNameEl.innerHTML = currentUser.fullName;
      profileFullNameEl.style.display = 'block';
    }
    if (profileEmailEl) {
      profileEmailEl.textContent = currentUser.email;
      profileEmailEl.innerHTML = currentUser.email;
      profileEmailEl.style.display = 'block';
    }
    
    // Update profile image alt text
    const profileImg = document.querySelector('img[alt="User Profile"]');
    if (profileImg) {
      profileImg.alt = currentUser.fullName;
    }
    
    console.log('Profile updated with:', currentUser.fullName);
    console.log('Current content of profile-name:', profileNameEl ? profileNameEl.textContent : 'not found');
    console.log('Current content of profile-full-name:', profileFullNameEl ? profileFullNameEl.textContent : 'not found');
    console.log('Current content of profile-email:', profileEmailEl ? profileEmailEl.textContent : 'not found');
  }
  
  // Load quiz history
  loadQuizHistory();
}

function loadQuizHistory() {
  const historyContainer = document.getElementById('quiz-history-container');
  if (!historyContainer) return;
  
  // Get quiz history from localStorage
  const quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
  
  if (quizHistory.length === 0) {
    // Show empty state
    historyContainer.innerHTML = `
      <div class="text-center py-8">
        <p class="text-sm text-neutral-600">No quiz history found. Take a quiz to see your results here!</p>
      </div>
    `;
    return;
  }
  
  // Create table with actual history
  historyContainer.innerHTML = `
    <div class="overflow-hidden rounded-lg border border-neutral-200" role="region" aria-label="Quiz history table">
      <table class="w-full text-left text-xs sm:text-sm">
        <thead class="bg-neutral-50 text-black">
          <tr class="[&>th]:px-4 [&>th]:py-3">
            <th class="font-medium">Quiz Name</th>
            <th class="font-medium">Score</th>
            <th class="font-medium">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y text-base/8 divide-neutral-200">
          ${quizHistory.map(quiz => `
            <tr class="[&>td]:px-4 [&>td]:py-4">
              <td>${quiz.quizName}</td>
              <td class="text-[#61738A]">${quiz.score}/${quiz.total}</td>
              <td class="text-[#61738A]">${formatDate(quiz.date)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Start with landing page
loadPage("landingpage.html");
