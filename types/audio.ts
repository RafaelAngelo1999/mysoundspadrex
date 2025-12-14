export interface AudioFile {
  id: string;
  title: string;
  author?: string;
  tags: string[];
  fileUrl: string;
  fileName: string;
  fileSize: number;
  status: "pending" | "approved" | "rejected";
  uploadedBy: string;
  uploadedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface AudioUpload {
  title: string;
  author?: string;
  tags: string[];
  file: File;
}
