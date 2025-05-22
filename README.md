# AIAssist Next.js Application

This is a Next.js application that simulates the UI and core logic for **AIAssist**, a conceptual tool designed to be a Chrome Extension.

## App Overview

AIAssist aims to help users by allowing them to:
1.  Log in (simulated via Google Auth in this Next.js app).
2.  Access and search their local files (mocked interaction with `localhost:8000`).
3.  Select relevant text chunks from these files.
4.  Use an AI reasoning tool to determine if these chunks should be injected into their current chat query on platforms like ChatGPT, Grok Chat, or Gemini.
5.  Prepare the combined text (query + chunks) for easy attachment to the chat.

## Core Features (Simulated in this Next.js App)

*   **Google Auth Simulation**: Users can "log in" to the application.
*   **File Display & Search**: Fetches and displays a list of mock files. Users can search these files (mocked API returns text chunks).
*   **Contextual Chunk Selection**: Users can select relevant text chunks from search results.
*   **AI Query Injection Analysis**: Users input their current chat query. An AI tool (`injectAiQuery` flow) analyzes whether the selected chunks are relevant to the query.
*   **Text Preparation**: If AI recommends injection, the app prepares the combined text (original query + selected chunks) and provides a "Copy to Clipboard" option.

## UI Style

*   **Primary Color**: Deep violet (`#7951A8`)
*   **Background Color**: Light violet (`#F2EFF6`)
*   **Accent Color**: Sky blue (`#74B9FF`)
*   **Typography**: Clean and modern sans-serif fonts (Geist Sans).
*   **Iconography**: Minimalist icons (Lucide React).
*   **Layout**: Simple, intuitive single-page application feel for the main dashboard.

## Running This Next.js Application

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002` (or the port specified in `package.json`).

## Important Note: Chrome Extension Context

This Next.js application **simulates** the user interface and some of the logic that would be part of the AIAssist Chrome Extension's popup or options page.

To build the actual Chrome Extension, the following would be required:

*   **Manifest File (`manifest.json`)**: Defines the extension's properties, permissions (like `identity` for Google Auth, `storage`, `activeTab`, access to specific websites), content scripts, background scripts, and popup page.
*   **Content Scripts**: JavaScript files injected into web pages (e.g., `chatgpt.com`). These would be responsible for:
    *   Injecting the "AIAssist" button near chat input fields.
    *   Communicating with the popup/background script to trigger actions.
    *   Receiving text from the popup and pasting it into the chat input field on the active page.
*   **Background Script**: Handles long-running tasks, manages state, and facilitates communication between content scripts and the popup. It would also handle actual API calls to `localhost:8000` (or a remote server).
*   **Popup UI**: The UI developed in this Next.js app (specifically the `/dashboard` page and its components) could be adapted and bundled to serve as the extension's popup HTML page. This might involve building the Next.js app and then referencing its static assets in the manifest.
*   **Authentication**: Use `chrome.identity.getAuthToken` for Google Sign-In within the extension. The obtained token would then be used for secure API calls.
*   **API Calls**: Make actual `fetch` requests from the extension's background script or popup to `localhost:8000/files` and `localhost:8000/search`, including the authentication token in the headers.
*   **Packaging**: The final extension would be packaged as a `.crx` file for distribution or loaded as an unpacked extension during development.

This Next.js project provides a solid foundation for the UI/UX and client-side logic of the AIAssist tool.
