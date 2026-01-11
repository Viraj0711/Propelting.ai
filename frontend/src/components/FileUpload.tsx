import React, { useCallback, useState } from 'react';
import { Upload, X, FileAudio, FileVideo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Progress } from '@/components/ui';
import {
  isValidFileType,
  isValidFileSize,
  formatFileSize,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
} from '@/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = ALLOWED_FILE_TYPES.join(','),
  maxSizeMB = MAX_FILE_SIZE_MB,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!isValidFileType(file, ALLOWED_FILE_TYPES)) {
        return 'Invalid file type. Please upload an audio or video file.';
      }
      if (!isValidFileSize(file, maxSizeMB)) {
        return `File size exceeds ${maxSizeMB}MB limit.`;
      }
      return null;
    },
    [maxSizeMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setSelectedFile(file);
      setUploadProgress(0);
      onFileSelect(file);
    },
    [validateFile, onFileSelect]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError(null);
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('audio/')) {
      return <FileAudio className="h-12 w-12 text-primary" aria-hidden="true" />;
    }
    if (file.type.startsWith('video/')) {
      return <FileVideo className="h-12 w-12 text-primary" aria-hidden="true" />;
    }
    return <Upload className="h-12 w-12 text-primary" aria-hidden="true" />;
  };

  return (
    <div className={cn('w-full', className)}>
      {!selectedFile ? (
        <div
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 transition-colors',
            isDragging && 'border-primary bg-primary/5',
            'hover:border-primary hover:bg-primary/5 cursor-pointer'
          )}
          role="button"
          tabIndex={0}
          aria-label="Upload file area"
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={accept}
            onChange={handleFileInput}
            aria-label="File upload input"
          />
          <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center">
            <Upload className="mb-4 h-16 w-16 text-muted-foreground" aria-hidden="true" />
            <p className="mb-2 text-lg font-medium">
              Drag & drop your file here, or{' '}
              <span className="text-primary underline">browse</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Supports audio and video files up to {maxSizeMB}MB
            </p>
          </label>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            {getFileIcon(selectedFile)}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="mt-2 text-sm text-muted-foreground">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          className="mt-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
