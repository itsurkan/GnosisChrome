document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-query-input');
  const searchButton = document.getElementById('search-button');
  const chunksContainer = document.getElementById('chunks-container');
  const noChunksMessage = document.getElementById('no-chunks-message');
  const searchResultsCard = document.getElementById('search-results-card');

  const currentUserQueryInput = document.getElementById('current-user-query');
  const analyzeButton = document.getElementById('analyze-button');
  
  const aiAnalysisResultSection = document.getElementById('ai-analysis-result-section');
  const aiShouldInject = document.getElementById('ai-should-inject');
  const aiReason = document.getElementById('ai-reason');
  const prepareTextButton = document.getElementById('prepare-text-button');

  const preparedTextSection = document.getElementById('prepared-text-section');
  const textToAttachTextarea = document.getElementById('text-to-attach');
  const copyButton = document.getElementById('copy-button');

  const loginButton = document.getElementById('login-button');
  const authStatusDiv = document.getElementById('auth-status');

  let currentChunks = [];
  let currentAiAnalysisResult = null;
  let userProfile = null;

  // --- Authentication ---
  function updateLoginStatus() {
    if (userProfile) {
      authStatusDiv.innerHTML = `<span>Logged in as ${userProfile.name || userProfile.email}</span> <button id="logout-button">Logout</button>`;
      document.getElementById('logout-button').addEventListener('click', handleLogout);
      loginButton.style.display = 'none';
    } else {
      authStatusDiv.innerHTML = `<button id="login-button-inner">Sign in with Google</button>`;
      document.getElementById('login-button-inner').addEventListener('click', handleLogin);
      if(loginButton) loginButton.style.display = 'block';
    }
  }
  
  function handleLogin() {
    chrome.runtime.sendMessage({ type: 'LOGIN' }, (response) => {
      if (response && response.success && response.user) {
        userProfile = response.user;
        showToast('Logged in successfully!');
      } else {
        showToast('Login failed: ' + (response ? response.error : 'Unknown error'), 'error');
      }
      updateLoginStatus();
    });
  }

  function handleLogout() {
     chrome.runtime.sendMessage({ type: 'LOGOUT' }, (response) => {
      if (response && response.success) {
        userProfile = null;
        showToast('Logged out.');
      } else {
        showToast('Logout failed.', 'error');
      }
      updateLoginStatus();
    });
  }

  // Check initial login state
  chrome.runtime.sendMessage({ type: 'GET_AUTH_STATE' }, (response) => {
    if (response && response.isLoggedIn && response.user) {
      userProfile = response.user;
    }
    updateLoginStatus();
  });
  // Add event listener for the main login button if it exists
  if(loginButton) loginButton.addEventListener('click', handleLogin);


  // --- Toast Notifications ---
  function showToast(message, type = 'success') {
    const toastElement = document.getElementById('toast-notification');
    const toastMessageElement = document.getElementById('toast-message');
    
    if (!toastElement || !toastMessageElement) return;

    toastMessageElement.textContent = message;
    toastElement.className = 'toast'; // Reset classes
    if (type === 'error') {
      toastElement.classList.add('error'); // Add error class for styling if needed
    }
    toastElement.style.display = 'block';

    setTimeout(() => {
      toastElement.style.display = 'none';
    }, 3000);
  }

  // --- Search Functionality ---
  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) {
      showToast('Please enter a search term.', 'error');
      return;
    }
    searchButton.disabled = true;
    searchButton.textContent = 'Searching...';
    
    chrome.runtime.sendMessage({ type: 'SEARCH_FILES', query }, (response) => {
      searchButton.disabled = false;
      searchButton.textContent = 'Search';
      if (response && response.success) {
        currentChunks = response.chunks;
        renderChunks(currentChunks);
        if (currentChunks.length === 0) {
          showToast(`No chunks found for "${query}".`);
        }
      } else {
        showToast('Error searching files: ' + (response ? response.error : 'Unknown error'), 'error');
        renderChunks([]);
      }
    });
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchButton.click();
    }
  });

  function renderChunks(chunks) {
    chunksContainer.innerHTML = ''; // Clear previous results
    if (chunks.length === 0) {
      noChunksMessage.style.display = 'block';
      searchResultsCard.style.display = 'none';
    } else {
      noChunksMessage.style.display = 'none';
      searchResultsCard.style.display = 'block';
      chunks.forEach(chunk => {
        const div = document.createElement('div');
        div.className = 'chunk-item';
        div.innerHTML = `
          <label for="chunk-${chunk.id}">
            <input type="checkbox" id="chunk-${chunk.id}" data-chunk-id="${chunk.id}">
            <span class="chunk-file-name">From: ${chunk.fileName}</span>
          </label>
          <p>${chunk.text.length > 100 ? chunk.text.substring(0, 100) + '...' : chunk.text}</p>
        `;
        chunksContainer.appendChild(div);
      });
    }
    // Reset AI sections
    aiAnalysisResultSection.style.display = 'none';
    preparedTextSection.style.display = 'none';
    textToAttachTextarea.value = '';
  }

  // --- AI Analysis ---
  analyzeButton.addEventListener('click', async () => {
    const userQuery = currentUserQueryInput.value.trim();
    const selectedChunkIds = Array.from(chunksContainer.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.dataset.chunkId);
    
    const selectedChunks = currentChunks.filter(chunk => selectedChunkIds.includes(chunk.id));

    if (!userQuery || selectedChunks.length === 0) {
      showToast('Please enter your query and select at least one chunk.', 'error');
      return;
    }

    analyzeButton.disabled = true;
    analyzeButton.textContent = 'Analyzing...';

    const documentChunksText = selectedChunks.map(chunk => chunk.text);

    chrome.runtime.sendMessage({ type: 'ANALYZE_QUERY', payload: { query: userQuery, documentChunks: documentChunksText } }, (response) => {
      analyzeButton.disabled = false;
      analyzeButton.textContent = 'Analyze with AI';
      if (response && response.success) {
        currentAiAnalysisResult = response.analysis;
        displayAiResult(currentAiAnalysisResult);
        showToast('AI Analysis Complete: ' + currentAiAnalysisResult.reason);
      } else {
        showToast('AI Analysis Error: ' + (response ? response.error : 'Unknown error'), 'error');
        aiAnalysisResultSection.style.display = 'none';
      }
    });
  });

  function displayAiResult(result) {
    if (!result) {
      aiAnalysisResultSection.style.display = 'none';
      return;
    }
    aiShouldInject.textContent = result.shouldInject ? "Inject Documents: YES" : "Inject Documents: NO";
    aiShouldInject.className = result.shouldInject ? 'positive' : 'negative';
    aiReason.textContent = `Reason: ${result.reason}`;
    aiAnalysisResultSection.style.display = 'block';
    if (result.shouldInject) {
      prepareTextButton.style.display = 'block';
    } else {
      prepareTextButton.style.display = 'none';
    }
    preparedTextSection.style.display = 'none'; // Hide prepared text when new analysis is done
    textToAttachTextarea.value = '';
  }

  // --- Prepare Text and Copy ---
  prepareTextButton.addEventListener('click', () => {
    if (!currentAiAnalysisResult || !currentAiAnalysisResult.shouldInject) return;

    const selectedChunkIds = Array.from(chunksContainer.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.dataset.chunkId);
    const selectedChunkObjects = currentChunks.filter(chunk => selectedChunkIds.includes(chunk.id));

    if (selectedChunkObjects.length === 0) {
      showToast('No chunks selected to prepare text.', 'error');
      return;
    }
    
    const userQuery = currentUserQueryInput.value.trim();
    const chunksText = selectedChunkObjects.map(chunk => `Relevant Document Snippet from "${chunk.fileName}":\n${chunk.text}`).join("\n\n---\n\n");
    const combinedText = `${userQuery}\n\n${chunksText}`;
    
    textToAttachTextarea.value = combinedText;
    preparedTextSection.style.display = 'block';
  });

  copyButton.addEventListener('click', () => {
    if (!textToAttachTextarea.value) return;
    navigator.clipboard.writeText(textToAttachTextarea.value)
      .then(() => showToast('Copied to clipboard!'))
      .catch(err => showToast('Failed to copy: ' + err.message, 'error'));
  });

});
