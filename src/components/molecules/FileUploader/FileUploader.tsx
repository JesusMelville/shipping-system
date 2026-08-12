"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, Image, FileText } from "lucide-react";
import { Button } from "@/components/atoms";
import { formatFileSize } from "@/lib/utils";

interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
}

export function FileUploader({
  files,
  onFilesChange,
  maxFiles = 10,
  accept = {
    "application/pdf": [".pdf"],
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  },
}: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      onFilesChange(newFiles);
    },
    [files, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
  });

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (type === "application/pdf") return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? (
            "Suelta los archivos aquí..."
          ) : (
            <>
              Arrastra archivos aquí o{" "}
              <span className="text-primary font-medium">haz clic para seleccionar</span>
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, imágenes, Word, Excel (máx. {maxFiles} archivos)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
