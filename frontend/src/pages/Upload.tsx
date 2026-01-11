import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { meetingService } from '@/services';
import { retryWithBackoff, isRetryableError } from '@/utils/retry.utils';

interface FileUploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  error: string | null;
}

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const acceptedExtensions = '.mp3,.wav,.m4a,.aac,.mp4,.mpeg,.mov,.avi';

  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (uploadState.uploading) {
          event.preventDefault();
          return (event.returnValue = 'Upload in progress. Are you sure you want to leave?');
        }
      },
      [uploadState.uploading]
    )
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (uploadState.uploading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [uploadState.uploading]);

  const validateFile = (file: File): string | null => {
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'File size must be less than 500MB';
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['mp3', 'wav', 'm4a', 'aac', 'mp4', 'mpeg', 'mov', 'avi'];
    
    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      return 'Invalid file type. Please upload an audio or video file.';
    }

    return null;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadState({
        file: null,
        uploading: false,
        progress: 0,
        error,
      });
      return;
    }

    setUploadState({
      file,
      uploading: false,
      progress: 0,
      error: null,
    });

    if (!meetingTitle) {
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setMeetingTitle(fileName);
    }
  };

  const handleUpload = async () => {
    if (!uploadState.file) return;

    try {
      setUploadState(prev => ({ ...prev, uploading: true, error: null }));

      const meeting = await retryWithBackoff(
        () => meetingService.uploadMeetingFile(
          uploadState.file!,
          meetingTitle || uploadState.file!.name,
          `Meeting uploaded on ${new Date().toLocaleDateString()}`,
          undefined,
          (progress) => {
            setUploadState(prev => ({ ...prev, progress }));
          }
        ),
        {
          maxAttempts: 3,
          onRetry: (error, attempt) => {
            console.log(`Upload retry ${attempt}:`, error);
            setUploadState(prev => ({ 
              ...prev, 
              error: `Connection issue, retrying... (${attempt}/3)` 
            }));
          }
        }
      );

      setUploadState(prev => ({ ...prev, error: null }));

      navigate(`/dashboard/processing/${meeting.id}`);
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = isRetryableError(error)
        ? 'Upload failed due to network issues. Please check your connection and try again.'
        : 'Failed to upload file. Please try again.';
      
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage,
      }));
    }
  };

  const clearFile = () => {
    if (uploadState.uploading) {
      setShowCancelDialog(true);
      return;
    }
    
    setUploadState({
      file: null,
      uploading: false,
      progress: 0,
      error: null,
    });
    setMeetingTitle('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancelUpload = () => {
    setShowCancelDialog(false);
    setUploadState({
      file: null,
      uploading: false,
      progress: 0,
      error: null,
    });
    setMeetingTitle('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="Cancel Upload?"
        message="Upload is in progress. Are you sure you want to cancel? All progress will be lost."
        confirmText="Yes, Cancel"
        cancelText="Continue Upload"
        variant="warning"
        onConfirm={handleCancelUpload}
        onCancel={() => setShowCancelDialog(false)}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Upload Meeting</h1>
        <p className="mt-2 text-muted-foreground">
          Upload an audio or video file of your meeting for AI-powered analysis
        </p>
      </div>

      {/* Meeting Title */}
      <Card className="p-6">
        <label className="block mb-2 font-semibold">Meeting Title</label>
        <Input
          type="text"
          placeholder="e.g., Sprint Planning Meeting - Q1 2025"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          disabled={uploadState.uploading}
        />
      </Card>

      {/* File Upload Area */}
      <Card className="p-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          } ${uploadState.uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedExtensions}
            onChange={handleFileInput}
            disabled={uploadState.uploading}
          />

          {!uploadState.file ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold mb-1">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadState.uploading}
                >
                  Select File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: MP3, WAV, M4A, AAC, MP4, MPEG, MOV, AVI (Max 500MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">{uploadState.file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(uploadState.file.size)}
                </p>
              </div>
              {!uploadState.uploading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFile}
                >
                  Change File
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploadState.uploading && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{Math.round(uploadState.progress)}%</span>
            </div>
            <Progress value={uploadState.progress} />
          </div>
        )}

        {/* Error Message */}
        {uploadState.error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-sm text-destructive">{uploadState.error}</p>
          </div>
        )}
      </Card>

      {/* Processing Information */}
      <Card className="p-6 bg-blue-100 dark:bg-blue-500/20 border-blue-400">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What happens next?
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <span className="mr-2">1.</span>
            <span>AI will transcribe your meeting with speaker identification</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">2.</span>
            <span>Key discussion points and decisions will be extracted</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">3.</span>
            <span>Action items will be identified with priority levels</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">4.</span>
            <span>A comprehensive summary will be generated</span>
          </li>
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          disabled={uploadState.uploading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!uploadState.file || uploadState.uploading || !meetingTitle.trim()}
        >
          {uploadState.uploading ? 'Uploading...' : 'Upload & Process'}
        </Button>
      </div>
    </div>
  );
};

export default Upload;
