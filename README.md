# AIAssist Next.js Application & Chrome Extension

This is a Next.js application that simulates the UI and core logic for **AIAssist**, a conceptual tool designed to be a Chrome Extension.
**Initial files for the Chrome Extension part have been scaffolded in the `public` directory (`manifest.json`, `popup.html`, `background.js`, `content_script.js`).**

## App Overview

AIAssist aims to help users by allowing them to:
1.  Log in (simulated via Google Auth in this Next.js app, and via `chrome.identity` in the extension context).
2.  Access and search their local files (mocked interaction with `localhost:8000` or via background script in extension).
3.  Select relevant text chunks from these files.
4.  Use an AI reasoning tool to determine if these chunks should be injected into their current chat query on platforms like ChatGPT, Grok Chat, or Gemini.
5.  Prepare the combined text (query + chunks) for easy attachment to the chat.

## Core Features (Simulated in Next.js / Implemented in Extension)

*   **Google Auth**: 
    *   Next.js: Simulated login.
    *   Extension: Uses `chrome.identity.getAuthToken`. A basic flow is started in `public/popup.js`.
*   **File Display & Search**: 
    *   Next.js: Fetches and displays a list of mock files from `src/lib/api.ts`.
    *   Extension: Would involve `background.js` making requests to `localhost:8000` (or a remote server) and `popup.js` or a dedicated UI displaying results.
*   **Contextual Chunk Selection**: Users can select relevant text chunks from search results.
*   **AI Query Injection Analysis**: Users input their current chat query. An AI tool (`injectAiQuery` flow) analyzes whether the selected chunks are relevant to the query. This Genkit flow would ideally be called from `background.js`.
*   **Text Preparation**: If AI recommends injection, the app prepares the combined text. `content_script.js` can be used to paste text into chat inputs.

## UI Style

*   **Primary Color**: Deep violet (`#7951A8`)
*   **Background Color**: Light violet (`#F2EFF6`)
*   **Accent Color**: Sky blue (`#74B9FF`)
*   **Typography**: Clean and modern sans-serif fonts (Geist Sans).
*   **Iconography**: Minimalist icons (Lucide React).
*   **Layout**: Simple, intuitive single-page application feel for the main dashboard.

## Running This Next.js Application (For UI Simulation)

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002` (or the port specified in `package.json`).

## Building and Running the Chrome Extension

1.  **Create Icons**: Place `icon16.png`, `icon48.png`, and `icon128.png` in the `public/icons/` directory.
2.  **Adapt UI for Popup**:
    *   The current `public/popup.html` is a placeholder.
    *   To use the UI from the Next.js app (e.g., `/dashboard`), you need to:
        *   Option A: Build your Next.js dashboard page into static HTML, JS, and CSS files.
        *   Place these built files (e.g., `dashboard.html` and its assets) into the `public` folder.
        *   Update `public/manifest.json`'s `"action": {"default_popup": "dashboard.html"}`.
        *   Ensure `dashboard.html` and its assets are listed in `web_accessible_resources` in `manifest.json`.
        *   This approach requires careful handling of routing, state management, and API calls within the extension's popup context.
    *   Alternatively, recreate a simpler UI directly in `public/popup.html` and `public/popup.js` using vanilla JavaScript or a lightweight library, and have it communicate with `background.js` for data and logic.
3.  **Develop Extension Logic**:
    *   Implement actual Google Sign-In using `chrome.identity.getAuthToken` in `public/popup.js`.
    *   Implement API calls to `localhost:8000` (or your backend) from `public/background.js`, passing the auth token.
    *   Develop `public/content_script.js` to interact with chat platforms (e.g., inject buttons, paste text).
4.  **Load the Extension in Chrome**:
    *   Open Chrome and go to `chrome://extensions`.
    *   Enable "Developer mode".
    *   Click "Load unpacked".
    *   Select the `public` directory (or the root directory of your project if you adjust paths in `manifest.json` to be relative to the root, which is more standard for extensions). For simplicity with Next.js structure, using `public` as the extension root for loading is an initial step. A better approach for a final extension would be a build step that copies all necessary files (manifest, scripts, icons, built UI assets) to a dedicated `dist/extension` folder.
5.  **Packaging**: Once development is complete, use the "Pack extension" button on the `chrome://extensions` page to create a `.crx` file for distribution.

## Important Note: Chrome Extension Context (Original from Next.js setup)

This Next.js application **simulates** the user interface and some of the logic that would be part of the AIAssist Chrome Extension's popup or options page.

To build the actual Chrome Extension, the following would be required (summary from above, detailed in the extension files):

*   **Manifest File (`public/manifest.json`)**: Defines properties, permissions, scripts, popup. (Initial version created)
*   **Content Scripts (`public/content_script.js`)**: Injected into web pages. (Initial version created)
*   **Background Script (`public/background.js`)**: Handles tasks, state, communication. (Initial version created)
*   **Popup UI (`public/popup.html`, `public/popup.js`)**: UI for the extension popup. (Initial simple version created, requires adaptation of Next.js UI)
*   **Authentication**: Use `chrome.identity.getAuthToken`.
*   **API Calls**: `fetch` from background script.
*   **Packaging**: Create `.crx` file.

This Next.js project provides a solid foundation for the UI/UX, and the newly added files in `public` provide the starting point for the Chrome Extension structure.
