
import React from 'react';
import { CloseIcon } from './IconComponents';

interface InfoModalProps {
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="info-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="info-title">About TransLog Assist</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          <section>
            <h3>App Documentation</h3>
            <p>
              This tool is designed to streamline the process of logging audio file information.
            </p>
            <ol>
              <li><strong>Upload Files:</strong> Click the upload area or drag and drop your audio files (.m4a, .mp3, .wav, etc.) into the window.</li>
              <li><strong>Review List:</strong> The app will automatically extract the duration and file name for each valid audio file. You can sort the list by date, name, or reorder manually.</li>
              <li><strong>Copy &amp; Clear:</strong> Click the "Copy All &amp; Clear List" button. This copies the formatted list (Duration + File Name) to your clipboard, ready to be pasted into a spreadsheet, and clears the list for the next batch.</li>
              <li><strong>Start Over:</strong> If you've uploaded the wrong files or wish to start over, use the "Start Over" button to return to the upload screen without copying.</li>
              <li><strong>Copy Last List:</strong> If you accidentally clear the list, you can use the "Copy Last List" button to retrieve the previously copied data.</li>
            </ol>
          </section>
          <section>
            <h3>Privacy & Security Implementation</h3>
            <p>
              <strong>Your data is safe.</strong> This application is built with security and privacy as a top priority, making it a secure choice for handling sensitive information. Below is a comprehensive list of its security features:
            </p>
            <ol className="security-list">
                <li>
                    <strong>Purely Local File Processing</strong>
                    <p>The application's most critical security feature is that it operates entirely offline.</p>
                    <ul>
                        <li><strong>No Uploads:</strong> Your audio files are <strong>never</strong> sent to any external server or over the internet. All processing, including metadata extraction, happens directly on your machine.</li>
                        <li><strong>Offline Functionality:</strong> The tool does not require an internet connection to function, which guarantees that your data never leaves your computer.</li>
                    </ul>
                </li>
                <li>
                    <strong>Robust Input Sanitization</strong>
                    <p>To prevent vulnerabilities like Cross-Site Scripting (XSS), every file name is rigorously sanitized before being displayed.</p>
                    <ul>
                        <li><strong>HTML Character Escaping:</strong> Characters like <code>&lt;</code> and <code>&gt;</code> are converted into their HTML-safe equivalents to prevent them from being executed as code.</li>
                        <li><strong>Control Character Removal:</strong> Non-printable control characters are stripped out, ensuring clean and safe data handling.</li>
                    </ul>
                </li>
                <li>
                    <strong>Automatic Session Timeout</strong>
                    <p>To protect your information, the application includes an inactivity timer.</p>
                    <ul>
                        <li><strong>15-Minute Timeout:</strong> After 15 minutes of inactivity, a warning modal appears.</li>
                        <li><strong>Automatic Clearing:</strong> If you don't respond, the application automatically clears the current file list to prevent unauthorized viewing.</li>
                    </ul>
                </li>
                <li>
                    <strong>No Persistent Data Storage</strong>
                    <p>The application is designed to be stateless to ensure your privacy.</p>
                    <ul>
                        <li><strong>In-Memory State:</strong> All file information is held in memory and is immediately discarded when you clear the list or close the application.</li>
                        <li><strong>No Cookies or Local Storage:</strong> The app does not use cookies or any other method to permanently store your data on your computer.</li>
                    </ul>
                </li>
                <li>
                    <strong>Strict File Validation</strong>
                    <p>Before any processing occurs, the application validates all uploaded files to ensure they are safe and appropriate.</p>
                    <ul>
                        <li><strong>Type and Size Limits:</strong> Only specific audio file types under a 500MB size limit are accepted.</li>
                        <li><strong>Empty File Rejection:</strong> Files with a size of zero bytes are automatically skipped.</li>
                    </ul>
                </li>
                 <li>
                    <strong>Processing Safeguards</strong>
                     <p>The application is built to handle potentially problematic files gracefully without crashing.</p>
                    <ul>
                        <li><strong>Metadata Timeout:</strong> A 30-second timeout is in place for reading each file's metadata. If a file is corrupted, the application safely skips it and notifies you.</li>
                    </ul>
                </li>
                <li>
                    <strong>Sandboxed Application Environment</strong>
                    <p>As a desktop application built with Electron, the user interface runs in a sandboxed environment.</p>
                    <ul>
                        <li><strong>System Isolation:</strong> This sandbox isolates the application from your computer's core system functions, creating a strong barrier against malicious files.</li>
                    </ul>
                </li>
            </ol>
          </section>
          <section>
            <h3>Technologies Used</h3>
            <p>This application is built with modern, efficient, and secure technologies:</p>
            <ul>
              <li><strong>React:</strong> A JavaScript library for building user interfaces.</li>
              <li><strong>TypeScript:</strong> A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.</li>
              <li><strong>Vite:</strong> A next-generation frontend tooling that provides a faster and leaner development experience.</li>
              <li><strong>Electron:</strong> A framework for creating native applications with web technologies like JavaScript, HTML, and CSS.</li>
            </ul>
          </section>
          <section>
            <h3>Updating the Application</h3>
            <p>
              This is a standalone desktop application. To update to a newer version, you must first delete or uninstall the current version and then download and install the new version from the source.
            </p>
          </section>
           <section>
            <h3>Developer</h3>
            <p>
              Developed by <strong>Tzarina Paula S.</strong> This application was built from scratch with a focus on security, performance, and a user-friendly experience. It is not a copy of another application.
            </p>
          </section>
        </div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          animation: fade-in-fast 0.2s ease-out forwards;
        }
        .modal-content {
          background-color: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          max-width: 42rem;
          width: calc(100% - 2rem);
          max-height: calc(100vh - 4rem);
          display: flex;
          flex-direction: column;
          border: 1px solid #DBEFF5;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #DBEFF5;
        }
        .modal-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 0.25rem;
          border-radius: 9999px;
          line-height: 0;
          transition: background-color 0.2s, color 0.2s;
        }
        .close-btn:hover {
          background-color: #DBEFF5;
          color: #1e293b;
        }
        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          color: #334155;
        }
        .modal-body section {
          margin-bottom: 2rem;
        }
        .modal-body section:last-child {
          margin-bottom: 0;
        }
        .modal-body h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin-top: 0;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid #DBEFF5;
          padding-bottom: 0.5rem;
        }
        .modal-body p, .modal-body li {
          line-height: 1.6;
        }
        .modal-body ol, .modal-body ul {
          padding-left: 1.5rem;
          margin-top: 0.5rem;
        }
        .modal-body li {
            margin-bottom: 0.5rem;
        }
        .modal-body code {
          background-color: #DBEFF5;
          color: #475569;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .security-list {
            list-style-type: none;
            padding-left: 0;
        }
        .security-list > li {
            margin-bottom: 1.25rem;
        }
        .security-list > li > strong {
            display: block;
            margin-bottom: 0.25rem;
            color: #1e293b;
        }
        .security-list > li > p {
            margin-top: 0;
            font-size: 0.9em;
        }
        .security-list > li > ul {
            font-size: 0.9em;
            list-style-type: disc;
            margin-top: 0.5rem;
        }
        @keyframes fade-in-fast {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
