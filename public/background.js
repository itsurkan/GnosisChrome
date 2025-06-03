// Background service worker for Chrome Extension
console.log("Background service worker started.");

// Example: Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background:", message);
  
  if (message.action === "fetchFiles") {
    // Simulate API call, eventually call localhost:8000/files
    // Requires 'host_permissions' for http://localhost:8000/* in manifest.json
    // And also handling of the auth token.
    chrome.storage.local.get(['authToken'], function(result) {
      if (!result.authToken) {
        sendResponse({ error: "Not authenticated" });
        return true; // Indicates asynchronous response
      }
      // Mocked API call
      console.log("Background: Mocking fetchFiles with token", result.authToken);
      setTimeout(() => {
        const mockFiles = [
          { id: 'file1_ext', name: 'Extension Proposal.docx', type: 'document' },
          { id: 'file2_ext', name: 'Extension Notes.pdf', type: 'document' },
        ];
        sendResponse({ files: mockFiles });
      }, 500);
    });
    return true; // Indicates asynchronous response
  }

  if (message.action === "searchFiles") {
    chrome.storage.local.get(['authToken'], function(result) {
      if (!result.authToken) {
        sendResponse({ error: "Not authenticated" });
        return true;
      }
      console.log("Background: Mocking searchFiles with token", result.authToken, "query:", message.query);
      setTimeout(() => {
        const mockChunks = [
          { id: 'chunk1_ext', fileId: 'file1_ext', fileName: 'Extension Proposal.docx', text: `Content related to ${message.query} from extension.` },
        ];
        sendResponse({ chunks: mockChunks });
      }, 500);
    });
    return true;
  }

  // Simple echo response for other messages
  // sendResponse({ farewell: "goodbye from background" });
  return false; // For synchronous response, or if not sending a response
});

// Example: Handling extension installation or update
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log("AIAssist extension installed.");
    // Perform initial setup if needed
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    const thisVersion = chrome.runtime.getManifest().version;
    console.log(`AIAssist extension updated from ${details.previousVersion} to ${thisVersion}.`);
  }
});

// To open the Next.js app (or a bundled version of it) as the main UI:
// You might need a way to signal the popup to open a specific page,
// or have the popup itself contain the logic to render the dashboard.

// The README.md mentions:
// "The UI developed in this Next.js app (specifically the /dashboard page and its components)
// could be adapted and bundled to serve as the extension's popup HTML page."
// This means you would build your Next.js dashboard into static files and
// potentially load it in an iframe within popup.html or directly if it's simple enough.
// Alternatively, the `action.default_popup` in manifest.json could point to a static HTML
// file that is a self-contained version of your dashboard.

// For now, popup.html is very simple.
// To make it use your Next.js dashboard:
// 1. Create a build of your Next.js app that outputs static HTML/JS/CSS for the dashboard.
//    For example, `next build && next export` if your pages are static.
//    If dynamic, you'd need to serve it or find a way to bundle it.
// 2. Place these static files (e.g., `dashboard.html`, `_next/static/...`) in the `public` folder.
// 3. Update `manifest.json` to point `action.default_popup` to `dashboard.html`.
// 4. Ensure `web_accessible_resources` includes `dashboard.html` and any assets it needs.
// This part is complex and highly dependent on your Next.js app's structure.
