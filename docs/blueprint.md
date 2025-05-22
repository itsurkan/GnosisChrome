# **App Name**: AIAssist

## Core Features:

- Google Auth: Enables users to log into the Chrome extension using Google Authentication.
- Button Injection: Injects a button near the input field on specified pages (chatgpt.com, grok.com/chat, gemini.google.com).
- File Display Popup: Displays user files fetched from a local endpoint (localhost:8000/files) in a popup window after clicking the injected button. The request includes an authorization header for secure access.
- Contextual Search: Includes a search input within the popup. When users enter a query, the application returns text chunks related to that search query, utilizing an API call (localhost:8000/search).
- Text Attachment: Attaches the returned text chunks from the search to the chat input field of the target website.
- AI query injection tool: Uses a reasoning tool to decide if it makes sense to incorporate user selected document chunks into the current user query.

## Style Guidelines:

- Primary color: Deep violet (#7951A8) for a calm and intellectual feel.
- Background color: Light violet (#F2EFF6) to provide a gentle backdrop.
- Accent color: Sky blue (#74B9FF) for interactive elements, providing contrast and clarity.
- Clean and modern sans-serif fonts for optimal readability.
- Use minimalist icons to represent file types and search actions within the popup.
- Maintain a simple, intuitive layout in the popup to ensure ease of navigation and use.
- Incorporate subtle animations for button interactions and search feedback.