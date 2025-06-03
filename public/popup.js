// Basic popup logic
console.log("Popup script loaded");

const loginButton = document.getElementById('loginButton');
const openDashboardButton = document.getElementById('openDashboardButton');
const userInfoDisplay = document.getElementById('userInfo');

// Check if user is already authenticated (simplified)
chrome.storage.local.get(['authToken', 'authUser'], function(result) {
  if (result.authToken && result.authUser) {
    loginButton.style.display = 'none';
    openDashboardButton.style.display = 'block';
    try {
        const user = JSON.parse(result.authUser);
        userInfoDisplay.textContent = `Logged in as: ${user.name}`;
    } catch(e) {
        userInfoDisplay.textContent = `Logged in.`;
    }
  } else {
    loginButton.style.display = 'block';
    openDashboardButton.style.display = 'none';
    userInfoDisplay.textContent = 'Please log in.';
  }
});

if (loginButton) {
  loginButton.addEventListener('click', () => {
    // In a real extension, this would trigger chrome.identity.getAuthToken
    // For now, we'll simulate by trying to open the Next.js login page in a new tab
    // or redirecting the popup to the dashboard if auth is successful.
    // The actual auth flow from the Next.js app won't directly work here without adaptation.
    console.log("Login button clicked. Implement chrome.identity.getAuthToken flow.");
    
    // Example: Get Auth Token
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      // if (chrome.runtime.lastError || !token) {
      //   console.error("Google Auth Error:", chrome.runtime.lastError.JSON);
      //   userInfoDisplay.textContent = 'Login failed. See console.';
      //   return;
      // }
      console.log("Acquired token:", token);
      // Simulate fetching user profile with this token (mocked for now)
      // In a real scenario, you'd call your backend or Google's userinfo endpoint
      const MOCK_USER = {
        id: 'ext_user_1',
        name: 'Extension User',
        email: 'ext_user@example.com',
      };
      
      chrome.storage.local.set({ authToken: token, authUser: JSON.stringify(MOCK_USER) }, function() {
        console.log('User and token stored locally.');
        userInfoDisplay.textContent = `Logged in as: ${MOCK_USER.name}`;
        loginButton.style.display = 'none';
        openDashboardButton.style.display = 'block';
        // Potentially, instead of opening a new tab for the dashboard,
        // you could load the dashboard content directly into the popup
        // if you adapt your Next.js app for this (complex).
        // For now, this button will open the Next.js app's dashboard page.
      });
    });
  });
}

if (openDashboardButton) {
    openDashboardButton.addEventListener('click', () => {
        // This demonstrates opening a page from your Next.js app.
        // For a true "popup UI" using your Next.js components,
        // you'd typically build those components into static assets
        // and load them here, or use an iframe.
        // The simplest way for now, is to open the Next.js app's page in a new tab.
        // However, the instructions say the Next.js app SIMULATES the UI.
        // So the goal is to make this popup BE the UI.
        // For now, let's point to a conceptual "dashboard.html" which would be
        // a bundled version of your Next.js dashboard.
        
        // Option 1: Open the running Next.js app (if accessible)
        // chrome.tabs.create({ url: 'http://localhost:9002/dashboard' });

        // Option 2: Open a bundled dashboard page (requires build step)
        // This assumes you have a way to build your dashboard into a standalone HTML file.
        // Let's assume you'll create `dashboard.html` based on your Next.js dashboard.
        const dashboardUrl = chrome.runtime.getURL('dashboard.html');
        chrome.tabs.create({ url: dashboardUrl });
        // To make this work, you'd need to:
        // 1. Build your Next.js dashboard page/components into static HTML/JS/CSS.
        // 2. Place these files in the `public` folder (e.g., `public/dashboard.html`, `public/dashboard.js`).
        // 3. Ensure `manifest.json` lists `dashboard.html` in `web_accessible_resources`.
        console.log("Attempting to open bundled dashboard.html. This requires a separate build step for your Next.js dashboard page.");
    });
}

// Example of sending a message to the content script
// chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//   if (tabs[0] && tabs[0].id) {
//     chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello from popup" }, function(response) {
//       console.log("Response from content script:", response);
//     });
//   }
// });
