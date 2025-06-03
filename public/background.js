// AIAssist Chrome Extension - Background Script (Service Worker)

// Mock data (simulating what might come from a backend or local file index)
const mockFiles = [
  { id: 'file1', name: 'Project Proposal.docx', type: 'document' },
  { id: 'file2', name: 'Client Meeting Notes.pdf', type: 'document' },
  { id: 'file3', name: 'UI Mockups.png', type: 'image' },
];

const mockChunks = [
  { id: 'chunk1', fileId: 'file1', fileName: 'Project Proposal.docx', text: 'The primary goal of this project is to enhance user engagement by 20%.' },
  { id: 'chunk2', fileId: 'file1', fileName: 'Project Proposal.docx', text: 'Key performance indicators (KPIs) will include daily active users and session duration.' },
  { id: 'chunk3', fileId: 'file2', fileName: 'Client Meeting Notes.pdf', text: 'Client emphasized the need for a simplified user interface and faster load times.' },
  { id: 'chunk4', fileId: 'file4', fileName: 'helper_functions.py', text: 'def calculate_sum(a, b):\n  return a + b' },
];

// --- Authentication State (Simplified) ---
let globalAuthToken = null;
let globalUserProfile = null;


chrome.runtime.onInstalled.addListener(() => {
  console.log('AIAssist Extension Installed');
  // Here you could initialize default settings using chrome.storage.local
});

// --- Message Listener ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);

  if (request.type === 'LOGIN') {
    // In a real scenario, this would involve chrome.identity.getAuthToken
    // and potentially fetching user profile from Google.
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        console.error('Login failed:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError ? chrome.runtime.lastError.message : "Token not retrieved." });
        return;
      }
      globalAuthToken = token;
      // Fetch user info using the token
      fetch('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + token)
        .then(response => response.json())
        .then(data => {
          globalUserProfile = {
            id: data.id,
            email: data.email,
            name: data.name,
            avatarUrl: data.picture
          };
          // Store user profile and token for persistence if needed (e.g., chrome.storage.local)
          chrome.storage.local.set({ authToken: globalAuthToken, authUser: globalUserProfile });
          sendResponse({ success: true, user: globalUserProfile });
        })
        .catch(error => {
          console.error('Failed to fetch user info:', error);
          sendResponse({ success: false, error: 'Failed to fetch user info.' });
        });
    });
    return true; // Indicates that the response is sent asynchronously
  } 
  
  if (request.type === 'LOGOUT') {
    if (globalAuthToken) {
      // Revoke the token (optional, but good practice)
      // Note: The URL to revoke may vary. This is a common one.
      fetch(`https://accounts.google.com/o/oauth2/revoke?token=${globalAuthToken}`)
        .then(() => {
          chrome.identity.removeCachedAuthToken({ token: globalAuthToken }, () => {
            console.log('Token revoked and cache cleared.');
          });
        })
        .catch(error => console.error('Error revoking token:', error))
        .finally(() => {
          globalAuthToken = null;
          globalUserProfile = null;
          chrome.storage.local.remove(['authToken', 'authUser']);
          sendResponse({ success: true });
        });
    } else {
      sendResponse({ success: true }); // Already logged out
    }
    return true; // Async
  }

  if (request.type === 'GET_AUTH_STATE') {
     chrome.storage.local.get(['authToken', 'authUser'], (result) => {
      if (result.authToken && result.authUser) {
        globalAuthToken = result.authToken;
        globalUserProfile = result.authUser;
        sendResponse({ isLoggedIn: true, token: globalAuthToken, user: globalUserProfile });
      } else {
        sendResponse({ isLoggedIn: false });
      }
    });
    return true; // Async
  }


  if (request.type === 'SEARCH_FILES') {
    // Simulate API call
    // TODO: Replace with actual API call to your backend if files are not local
    // For now, using mock data. Requires auth.
    if (!globalAuthToken) {
      sendResponse({ success: false, error: 'Not authenticated' });
      return true;
    }
    setTimeout(() => {
      const query = request.query.toLowerCase();
      const results = mockChunks.filter(chunk =>
        chunk.text.toLowerCase().includes(query) ||
        chunk.fileName.toLowerCase().includes(query)
      );
      sendResponse({ success: true, chunks: results });
    }, 500);
    return true; // Indicates that the response is sent asynchronously
  }

  if (request.type === 'ANALYZE_QUERY') {
    // Simulate AI call. Requires auth.
    // TODO: Replace with actual API call to your backend running the Genkit flow
    if (!globalAuthToken) {
      sendResponse({ success: false, error: 'Not authenticated' });
      return true;
    }
    const { query, documentChunks } = request.payload;
    console.log("Simulating AI analysis with:", query, documentChunks);
    setTimeout(() => {
      // Mock AI logic
      let shouldInject = false;
      let reason = "The AI couldn't determine relevance based on the provided mock logic.";
      if (documentChunks.length > 0 && query.length > 5) {
         if (documentChunks.some(chunk => chunk.toLowerCase().includes(query.split(" ")[0].toLowerCase()))) {
            shouldInject = true;
            reason = "The provided document chunks seem relevant to your query based on keyword matching.";
         } else {
            shouldInject = false;
            reason = "The document chunks do not appear to be directly relevant to the keywords in your query.";
         }
      } else if (documentChunks.length === 0) {
        reason = "No document chunks were provided for analysis.";
      } else {
        reason = "The query is too short for meaningful analysis.";
      }
      
      sendResponse({ 
        success: true, 
        analysis: { 
          shouldInject, 
          reason 
        } 
      });
    }, 1000);
    return true; // Indicates that the response is sent asynchronously
  }
  
  // For content script to inject text
  if (request.type === 'INJECT_TEXT') {
    if (sender.tab && sender.tab.id) {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        func: pasteTextIntoActiveElement,
        args: [request.textToInject]
      }).then(() => sendResponse({success: true}))
        .catch(err => sendResponse({success: false, error: err.message}));
    } else {
       sendResponse({success: false, error: "No active tab found to inject text."});
    }
    return true; // Async
  }

  // Default: if no request.type matches
  // sendResponse({ success: false, error: 'Unknown request type' });
  // return false; // Or true if you might handle it asynchronously later
});


// Function to be injected into the content script's context
function pasteTextIntoActiveElement(textToPaste) {
  const activeElement = document.activeElement;
  if (activeElement && (activeElement.tagName === 'TEXTAREA' || (activeElement.tagName === 'INPUT' && activeElement.type === 'text') || activeElement.isContentEditable)) {
    if (activeElement.isContentEditable) {
        // For contentEditable elements, try to insert at cursor position
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            let range = sel.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(textToPaste);
            range.insertNode(textNode);
            // Move cursor after inserted text
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            sel.removeAllRanges();
            sel.addRange(range);
        } else { // Fallback for contentEditable
            activeElement.textContent = textToPaste;
        }
    } else { // For input/textarea
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const text = activeElement.value;
        activeElement.value = text.substring(0, start) + textToPaste + text.substring(end);
        activeElement.selectionStart = activeElement.selectionEnd = start + textToPaste.length;
    }
    // Dispatch input event to trigger any framework listeners (e.g., React, Vue)
    activeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    return true;
  }
  return false;
}

console.log('AIAssist Background Script Loaded');
