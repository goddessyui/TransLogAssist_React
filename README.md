
App Documentation
This tool is designed to streamline the process of logging audio file information.

Upload Files: Click the upload area or drag and drop your audio files (.m4a, .mp3, .wav, etc.) into the window.
Review List: The app will automatically extract the duration and file name for each valid audio file. You can sort the list by date, name, or reorder manually.
Copy & Clear: Click the "Copy All & Clear List" button. This copies the formatted list (Duration + File Name) to your clipboard, ready to be pasted into a spreadsheet, and clears the list for the next batch.
Start Over: If you've uploaded the wrong files or wish to start over, use the "Start Over" button to return to the upload screen without copying.
Copy Last List: If you accidentally clear the list, you can use the "Copy Last List" button to retrieve the previously copied data.
Privacy & Security Implementation
Your data is safe. This application is built with security and privacy as a top priority, making it a secure choice for handling sensitive information. Below is a comprehensive list of its security features:

Purely Local File Processing
The application's most critical security feature is that it operates entirely offline.

No Uploads: Your audio files are never sent to any external server or over the internet. All processing, including metadata extraction, happens directly on your machine.
Offline Functionality: The tool does not require an internet connection to function, which guarantees that your data never leaves your computer.
Robust Input Sanitization
To prevent vulnerabilities like Cross-Site Scripting (XSS), every file name is rigorously sanitized before being displayed.

HTML Character Escaping: Characters like < and > are converted into their HTML-safe equivalents to prevent them from being executed as code.
Control Character Removal: Non-printable control characters are stripped out, ensuring clean and safe data handling.
Automatic Session Timeout
To protect your information, the application includes an inactivity timer.

15-Minute Timeout: After 15 minutes of inactivity, a warning modal appears.
Automatic Clearing: If you don't respond, the application automatically clears the current file list to prevent unauthorized viewing.
No Persistent Data Storage
The application is designed to be stateless to ensure your privacy.

In-Memory State: All file information is held in memory and is immediately discarded when you clear the list or close the application.
No Cookies or Local Storage: The app does not use cookies or any other method to permanently store your data on your computer.
Strict File Validation
Before any processing occurs, the application validates all uploaded files to ensure they are safe and appropriate.

Type and Size Limits: Only specific audio file types under a 500MB size limit are accepted.
Empty File Rejection: Files with a size of zero bytes are automatically skipped.
Processing Safeguards
The application is built to handle potentially problematic files gracefully without crashing.

Metadata Timeout: A 30-second timeout is in place for reading each file's metadata. If a file is corrupted, the application safely skips it and notifies you.
Sandboxed Application Environment
As a desktop application built with Electron, the user interface runs in a sandboxed environment.

System Isolation: This sandbox isolates the application from your computer's core system functions, creating a strong barrier against malicious files.
Technologies Used
This application is built with modern, efficient, and secure technologies:

React: A JavaScript library for building user interfaces.
TypeScript: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
Vite: A next-generation frontend tooling that provides a faster and leaner development experience.
Electron: A framework for creating native applications with web technologies like JavaScript, HTML, and CSS.
Updating the Application
This is a standalone desktop application. To update to a newer version, you must first delete or uninstall the current version and then download and install the new version from the source.

Developer
Developed by Tzarina Paula S. This application was built from scratch with a focus on security, performance, and a user-friendly experience. It is not a copy of another application.