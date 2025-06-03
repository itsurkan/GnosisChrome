# AIAssist Next.js Application & Chrome Extension

This is a Next.js application that simulates the UI for **AIAssist**. The project also includes scaffolded files to build AIAssist as a Chrome Extension.

**Chrome Extension files are located in the `public` directory (`manifest.json`, `dashboard.html`, `dashboard.js`, `dashboard.css`, `background.js`, `content_script.js`).**

## App Overview

AIAssist aims to help users by allowing them to:
1.  Log in (simulated via Google Auth in Next.js, uses `chrome.identity` in the extension).
2.  Access and search their local files/documents (mocked interaction in Next.js, would be real API calls or local indexing in the extension).
3.  Select relevant text chunks from these files.
4.  Use an AI reasoning tool to determine if these chunks should be injected into their current chat query on platforms like ChatGPT, Grok Chat, or Gemini.
5.  Prepare the combined text (query + chunks) for easy attachment/pasting into the chat.

## Core Features

*   **Google Auth**:
    *   Next.js: Simulated login.
    *   Extension: Uses `chrome.identity.getAuthToken`. Basic flow started in `public/dashboard.js` and `public/background.js`.
*   **File Display & Search**:
    *   Next.js: Fetches and displays mock files/chunks from `src/lib/api.ts`.
    *   Extension: `public/dashboard.js` sends messages to `public/background.js`, which would ideally make API calls to a backend. Currently mocks these calls.
*   **Contextual Chunk Selection**: Users can select relevant text chunks from search results in the UI.
*   **AI Query Injection Analysis**: Users input their current chat query. An AI tool (`injectAiQuery` flow in Next.js) analyzes whether the selected chunks are relevant.
    *   Next.js: Calls the Genkit flow directly.
    *   Extension: `public/dashboard.js` sends data to `public/background.js`. `background.js` would ideally call a backend API endpoint that runs the Genkit flow. Currently mocks this AI analysis.
*   **Text Preparation & Injection**: If AI recommends injection, the app prepares the combined text.
    *   Next.js: Displays text for copying.
    *   Extension: `public/dashboard.js` prepares text. `public/content_script.js` can be used to paste text into chat inputs on supported websites (triggered from `background.js`).

## UI Style (Reference from Next.js app)

*   **Primary Color**: Deep violet (`#7951A8`)
*   **Background Color**: Light violet (`#F2EFF6`)
*   **Accent Color**: Sky blue (`#74B9FF`)
*   **Typography**: Clean and modern sans-serif fonts (Geist Sans in Next.js).
*   **Iconography**: Minimalist icons (Lucide React in Next.js).
*   **Layout**: Simple, intuitive single-page application feel for the main dashboard.
    *   The extension popup (`public/dashboard.html`) attempts to mimic this with static HTML and CSS.

## Running The Next.js Application (For UI Simulation & Backend Logic Dev)

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002` (or the port specified in `package.json`). This is useful for developing the UI components and the Genkit flows (which would ideally be deployed as a backend for the extension).

## Building and Running the Chrome Extension

1.  **Create Icons**: Place `icon16.png`, `icon48.png`, and `icon128.png` in the `public/icons/` directory. (Placeholders are referenced in `manifest.json`).
2.  **Develop Extension Logic**:
    *   **Authentication**: Enhance `public/dashboard.js` and `public/background.js` for robust Google Sign-In using `chrome.identity.getAuthToken` and manage user state (e.g., via `chrome.storage.local`).
    *   **API Calls**: Modify `public/background.js` to make `fetch` requests to your actual backend (where Genkit flows and file processing logic would be hosted) instead of using mock data/logic. Pass the auth token in these requests.
    *   **Content Script**: Develop `public/content_script.js` and `public/content_script.css` to interact robustly with chat platforms (e.g., identify chat input fields, inject buttons, paste text smoothly).
    *   **UI for Popup (`public/dashboard.html`)**:
        *   The current `public/dashboard.html` is a static HTML/CSS/JS representation that mimics the Next.js dashboard.
        *   For a richer, React-based UI in the popup, you would typically:
            *   **Option A (Build Next.js page to static assets):** Configure your Next.js build (`next build`) to output static HTML, JS, and CSS for the dashboard page. This can be complex with the App Router and dynamic features. These assets would then be placed in the `public` folder (or a subfolder) and `manifest.json` updated.
            *   **Option B (Separate React app for popup):** Create a small, separate React application (e.g., using Create React App or Vite, configured for extension development) specifically for the popup UI.
            *   **Option C (Enhance static HTML):** Continue building upon `public/dashboard.html` with more vanilla JavaScript or a lightweight library.
3.  **Load the Extension in Chrome**:
    *   Open Chrome and go to `chrome://extensions`.
    *   Enable "Developer mode".
    *   Click "Load unpacked".
    *   Select the `public` directory of this project.
4.  **Testing and Iteration**: Test all features: login, search, AI analysis (mocked, then with backend), text preparation, and injection on target websites.
5.  **Packaging**: Once development is complete, use the "Pack extension" button on the `chrome://extensions` page to create a `.crx` file for distribution. You'll also need to provide a private key for consistent extension ID if you repackage.

## Important Notes on Extension Development:

*   **Backend Requirement**: For real file processing and Genkit AI flows, you will need a backend server. The extension's `background.js` would make API calls to this server. The Next.js part of this project can serve as a starting point for such a backend if deployed.
*   **Security**: Be mindful of Chrome Extension security policies, especially regarding permissions and handling user data.
*   **Error Handling**: Implement robust error handling in `dashboard.js` and `background.js` for API calls, `chrome` API interactions, etc.
*   **State Management**: For more complex popups, consider a simple state management approach in `dashboard.js` or use `chrome.storage.local` for persisting state across popup openings.

This project provides a foundational UI/UX concept in Next.js and a scaffolded structure for the Chrome Extension. Significant development is required to create a fully functional and robust extension.
