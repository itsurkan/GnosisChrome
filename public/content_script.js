// Content script for AIAssist
console.log("AIAssist content script loaded on this page.");

// Example: Listen for messages from the popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.greeting === "hello from popup") {
    sendResponse({ confirmation: "Hi from content script!" });
  }

  if (message.action === "injectText") {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
      if (activeElement.tagName === 'TEXTAREA') {
        activeElement.value = message.text;
      } else {
        activeElement.textContent = message.text;
      }
      sendResponse({success: true, message: "Text injected."});
    } else {
      sendResponse({success: false, message: "No active textarea or contenteditable element found."});
    }
  }
  return true; // Keep the message channel open for asynchronous response
});

// Example: Injecting a button or UI into the page
// This is highly dependent on the target website's structure (e.g., ChatGPT)
// function injectAIAssistButton() {
//   const chatInput = document.querySelector('textarea[data-id="root"]'); // Example selector for ChatGPT
//   if (chatInput && !document.getElementById('aiassist-button')) {
//     const button = document.createElement('button');
//     button.id = 'aiassist-button';
//     button.textContent = 'AIAssist';
//     button.style.marginLeft = '10px';
//     button.style.padding = '5px 10px';
//     button.style.backgroundColor = '#7951A8';
//     button.style.color = 'white';
//     button.style.border = 'none';
//     button.style.borderRadius = '4px';
//     button.onclick = () => {
//       chrome.runtime.sendMessage({ action: "openPopup" }); // Or directly open your UI logic
//     };
//     chatInput.parentNode.appendChild(button);
//     console.log("AIAssist button injected.");
//   }
// }

// Run on page load or when specific elements appear
// if (document.readyState === "complete" || document.readyState === "interactive") {
//   setTimeout(injectAIAssistButton, 1000); // Delay to ensure page elements are loaded
// } else {
//   document.addEventListener("DOMContentLoaded", injectAIAssistButton);
// }
