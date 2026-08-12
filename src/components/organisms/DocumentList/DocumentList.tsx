"use client";

import { formatFileSize, formatDateTime } from "@/lib/utils";
import { File, Download, Trash2, FileText, Image } from "lucide-react";
import { Button } from "@/components/atoms";

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
}

interface DocumentListProps {
  documents: Document[];
  onDelete?: (id: string) => void;
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-5 w-5 text-blue-500" />;
    if (type === "application/pdf") return <FileText className="h-5 w-5 text-red-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No hay documentos adjuntos</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          {getFileIcon(doc.fileType)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{doc.fileName}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(doc.fileSize)} · {formatDateTime(doc.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <a
              href={`/api/upload/${doc.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
            </a>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(doc.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
