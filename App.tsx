
import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { CopyIcon, ShieldCheckIcon } from '@/components/IconComponents';
import type { AudioFile, SortOption } from '@/types';

// Lazy load components for better performance
const Header = React.lazy(() => import('@/components/Header').then(module => ({ default: module.Header })));
const UploadForm = React.lazy(() => import('@/components/UploadForm').then(module => ({ default: module.UploadForm })));
const FileList = React.lazy(() => import('@/components/FileList').then(module => ({ default: module.FileList })));
const InactivityWarningModal = React.lazy(() => import('@/components/InactivityWarningModal').then(module => ({ default: module.InactivityWarningModal })));
const InfoModal = React.lazy(() => import('@/components/InfoModal').then(module => ({ default: module.InfoModal })));

// Natural sort comparator to correctly sort strings with numbers
const naturalSortComparator = (a: string, b: string): number => {
  const partsA = a.match(/\d+|\D+/g) || [];
  const partsB = b.match(/\d+|\D+/g) || [];

  const len = Math.min(partsA.length, partsB.length);

  for (let i = 0; i < len; i++) {
    const partA = partsA[i];
    const partB = partsB[i];

    const isNumA = /^\d+$/.test(partA);
    const isNumB = /^\d+$/.test(partB);

    if (isNumA && isNumB) {
      const numA = parseInt(partA, 10);
      const numB = parseInt(partB, 10);
      if (numA !== numB) {
        return numA - numB;
      }
    } else {
      if (partA !== partB) {
        return partA.localeCompare(partB);
      }
    }
  }

  return partsA.length - partsB.length;
};

const sanitizeFilename = (filename: string): string => {
    // Escape characters that could be interpreted as HTML tags to prevent XSS
    // if the output is pasted into an HTML-interpreting context.
    let sanitized = filename.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    
    // Replace control characters (like tabs, newlines) with a single space.
    sanitized = sanitized.replace(/[\t\n\r]+/g, ' ');
    
    // Remove non-printable control characters.
    // eslint-disable-next-line no-control-regex
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    return sanitized.trim();
};


const App: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [lastCopied, setLastCopied] = useState<string>('');
  const [showToast, setShowToast] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>('alpha-asc');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInactivityModal, setShowInactivityModal] = useState(false);

  const inactivityTimerRef = useRef<number>();
  const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const displayToast = (message: string) => {
    setShowToast(message);
  };

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const processFileMetadata = (file: File): Promise<AudioFile> => {
    return new Promise((resolve, reject) => {
      const TIMEOUT_MS = 30000;
      let audio: HTMLAudioElement | null = new Audio();
      const objectUrl = URL.createObjectURL(file);
      let timeoutId: number;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);
        if (audio) {
          audio.removeEventListener('loadedmetadata', onLoadedMetadata);
          audio.removeEventListener('error', onError);
          audio.src = '';
          audio = null;
        }
      };

      const onLoadedMetadata = () => {
        if (!audio || isNaN(audio.duration) || !isFinite(audio.duration)) {
          onError('Invalid audio duration');
          return;
        }

        const sanitizedName = sanitizeFilename(file.name);
        if (!sanitizedName || sanitizedName.replace(/\.[^/.]+$/, "").trim() === "") {
            cleanup();
            reject(new Error(`File name for "${file.name}" is invalid or empty after sanitization.`));
            return;
        }

        const result: AudioFile = {
          id: `${file.name}-${file.lastModified}-${Math.random()}`,
          name: sanitizedName,
          duration: formatDuration(audio.duration),
          durationInSeconds: audio.duration,
          size: (file.size / 1024 / 1024).toFixed(2),
          lastModified: file.lastModified,
        };
        cleanup();
        resolve(result);
      };

      const onError = (e: Event | string) => {
        console.error(`Error loading audio file: ${file.name}`, e);
        cleanup();
        reject(new Error(`Could not read metadata for ${file.name}`));
      };

      timeoutId = window.setTimeout(() => {
        onError('Processing timed out');
      }, TIMEOUT_MS);

      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('error', onError);
      
      audio.src = objectUrl;
    });
  };

  const handleFilesSelected = useCallback(async (files: FileList) => {
    setAudioFiles([]);
    setIsProcessing(true);

    const allFiles = Array.from(files);

    const ALLOWED_EXTENSIONS = ['.m4a', '.mp3', '.wav', '.ogg', '.flac'];
    const MAX_FILE_SIZE_MB = 500;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const MAX_FILES = 100;

    let validFiles: File[] = [];
    let invalidFileMessages: string[] = [];

    for (const file of allFiles) {
      const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(fileExtension)) invalidFileMessages.push(`${file.name}: Invalid file type`);
      else if (file.size > MAX_FILE_SIZE_BYTES) invalidFileMessages.push(`${file.name}: Exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      else if (file.size === 0) invalidFileMessages.push(`${file.name}: File is empty`);
      else validFiles.push(file);
    }

    if (invalidFileMessages.length > 0) {
      if (invalidFileMessages.length > 3) displayToast(`Skipped ${invalidFileMessages.length} files (invalid type, size, or empty).`);
      else invalidFileMessages.forEach(msg => displayToast(`Skipped: ${msg}`));
    }

    if (validFiles.length === 0) {
      setIsProcessing(false);
      setProgress(null);
      if (allFiles.length > 0) displayToast('No valid audio files were found to process.');
      return;
    }
    
    let filesToProcess = validFiles;
    if (filesToProcess.length > MAX_FILES) {
      displayToast(`Processing the first ${MAX_FILES} valid files. Limit is 100.`);
      filesToProcess = filesToProcess.slice(0, MAX_FILES);
    }

    setProgress({ current: 0, total: filesToProcess.length });
    let processedFiles: AudioFile[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      setProgress({ current: i + 1, total: filesToProcess.length });
      try {
        const audioData = await processFileMetadata(file);
        processedFiles.push(audioData);
      } catch (error: any) {
        console.error(error);
        const originalName = file.name;
        if (error.message.includes('sanitization')) displayToast(`Skipped: "${originalName}" (invalid name)`);
        else displayToast(`Skipped: "${originalName}" (could not read)`);
      }
    }

    processedFiles.sort((a, b) => {
      const nameCompare = naturalSortComparator(a.name, b.name);
      if (nameCompare !== 0) return nameCompare;
      const sizeA = parseFloat(a.size);
      const sizeB = parseFloat(b.size);
      if (sizeA !== sizeB) return sizeA - sizeB;
      return a.lastModified - b.lastModified;
    });

    const duplicatesMap = new Map<string, number>();
    processedFiles.forEach(file => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        duplicatesMap.set(key, (duplicatesMap.get(key) || 0) + 1);
    });

    let duplicateFileCount = 0;
    processedFiles.forEach(file => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if ((duplicatesMap.get(key) || 0) > 1) {
            file.isDuplicate = true;
            duplicateFileCount++;
        }
    });

    if (duplicateFileCount > 0) {
        let duplicateGroups = 0;
        duplicatesMap.forEach(count => { if (count > 1) duplicateGroups++; });
        displayToast(`Found and grouped ${duplicateGroups} set(s) of duplicate files.`);
    }

    setAudioFiles(processedFiles);
    setSortOrder('alpha-asc');
    setIsProcessing(false);
    setProgress(null);
  }, []);

  const handleCopyAndClear = useCallback(() => {
    if (audioFiles.length === 0) {
      displayToast('No files to copy.');
      return;
    }
    const textToCopy = audioFiles
      .map(file => `${file.duration}\t${file.name.replace(/\.[^/.]+$/, "")}`)
      .join('\n');
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setLastCopied(textToCopy);
      const message = `Copied ${audioFiles.length} item(s) and cleared the list.`;
      displayToast(message);
      setAudioFiles([]); // This clears the list and returns to the upload view
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      displayToast('Failed to copy. Please try again.');
    });
  }, [audioFiles]);

  const copyLastList = useCallback(() => {
    if (!lastCopied) {
      displayToast('No list has been copied yet.');
      return;
    }
    navigator.clipboard.writeText(lastCopied).then(() => {
      displayToast('Last copied list is back in your clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      displayToast('Failed to copy. Please try again.');
    });
  }, [lastCopied]);

  const handleStartOver = useCallback(() => {
    setAudioFiles([]);
  }, []);

  const handleSortChange = useCallback((newSortOrder: SortOption) => {
    setSortOrder(newSortOrder);

    setAudioFiles(prevFiles => {
      const filesToSort = [...prevFiles];
      switch (newSortOrder) {
        case 'date-asc': return filesToSort.sort((a, b) => a.lastModified - b.lastModified);
        case 'alpha-asc':
          return filesToSort.sort((a, b) => {
            const nameCompare = naturalSortComparator(a.name, b.name);
            if (nameCompare !== 0) return nameCompare;
            const sizeA = parseFloat(a.size);
            const sizeB = parseFloat(b.size);
            if (sizeA !== sizeB) return sizeA - sizeB;
            return a.lastModified - b.lastModified;
          });
        case 'date-desc': default: return filesToSort.sort((a, b) => b.lastModified - a.lastModified);
      }
    });
  }, []);

  // Removed handleReorderFiles as manual mode is deprecated
  // const handleReorderFiles = useCallback((reorderedFiles: AudioFile[]) => {
  //   setSortOrder('manual');
  //   setAudioFiles(reorderedFiles);
  // }, []);

  // --- Inactivity Logic ---
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = window.setTimeout(() => {
      if (audioFiles.length > 0) {
        setShowInactivityModal(true);
      }
    }, INACTIVITY_TIMEOUT_MS);
  }, [audioFiles.length, INACTIVITY_TIMEOUT_MS]);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    if (audioFiles.length > 0) {
      events.forEach(event => window.addEventListener(event, resetInactivityTimer));
      resetInactivityTimer();
    }
    return () => {
      events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [audioFiles.length, resetInactivityTimer]);

  const handleContinueSession = () => {
    setShowInactivityModal(false);
    resetInactivityTimer();
  };

  const handleClearSession = () => {
    setShowInactivityModal(false);
    setAudioFiles([]);
    displayToast('List cleared due to inactivity.');
  };
  // --- End Logic ---

  return (
    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="container">
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <Header onInfoClick={() => setShowInfoModal(true)} />
            <main style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {audioFiles.length === 0 ? (
                <UploadForm onFilesSelected={handleFilesSelected} isProcessing={isProcessing} progress={progress} lastCopied={lastCopied} />
              ) : (
                <FileList
                  files={audioFiles}
                  onCopyAndClear={handleCopyAndClear}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  // Removed onReorder as manual mode is deprecated
                  // onReorder={handleReorderFiles}
                  onStartOver={handleStartOver}
                />
              )}
            </main>
            {lastCopied && audioFiles.length === 0 && (
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={copyLastList}
                  className="copy-last-btn"
                  aria-label="Copy the last generated list to clipboard"
                >
                  <CopyIcon />
                  Copy Last List
                </button>
              </div>
            )}
          </div>
        </div>
        <footer style={{ textAlign: 'center', marginTop: '5px', marginBottom: '5px'}}>
           <div className="hipaa-banner">
            <ShieldCheckIcon />
            <p style={{ textAlign: 'left', margin: 0 }}>
              <strong>Designed for Security & Privacy:</strong> All files are processed locally on your computer and are never uploaded online.
            </p>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '5px', marginBottom: '5px' }}>
            © {new Date().getFullYear()} <strong style={{ color: '#35C5CF' }}>TransLog Assist</strong>. For <strong style={{ color: '#35C5CF' }}>team</strong> use only. Do not duplicate. Do not sell.
          </p>
        </footer>

        {showToast && (
          <div role="alert" className="toast">
            {showToast}
          </div>
        )}

        {showInfoModal && (
          <InfoModal onClose={() => setShowInfoModal(false)} />
        )}

        {showInactivityModal && (
          <InactivityWarningModal
            onContinue={handleContinueSession}
            onClear={handleClearSession}
            countdownSeconds={30}
          />
        )}

        <style>{`
          .container {
            max-width: 1024px;
            margin-left: auto;
            margin-right: auto;
            padding: 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          @media (max-width: 640px) {
            .container {
              padding: 1rem;
            }
          }
          .card {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border: 1px solid #DBEFF5;
          }
          .copy-last-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background-color: #fff;
            color: #334155;
            border-radius: 0.5rem;
            border: 1px solid #81C9F3;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .copy-last-btn:hover {
            background-color: #DBEFF5;
          }
          .hipaa-banner {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            font-size: 0.75rem;
            color: #334155;
            background-color: #DBEFF5;
            padding: 0.75rem;
            border-radius: 0.5rem;
            max-width: 512px;
            margin-left: auto;
            margin-right: auto;
            border: 1px solid #81C9F3;
          }
          .hipaa-banner svg {
            width: 2rem;
            height: 2rem;
            flex-shrink: 0;
            color: #16a34a;
          }
          .toast {
            position: fixed;
            bottom: 1.25rem;
            right: 1.25rem;
            background-color: #1e293b;
            color: #fff;
            padding: 0.75rem 1.25rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1);
            z-index: 100;
            animation: toast-in 0.3s ease-out forwards;
          }
          @keyframes toast-in {
            from {
              opacity: 0;
              transform: translateY(1rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </Suspense>
  );
};

export default App;
