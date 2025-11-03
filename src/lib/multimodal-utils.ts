import type { ContentBlock, Data } from "@langchain/core/messages";
import { toast } from "sonner";

// Support both new format (ContentBlock.Multimodal) and deprecated format (Data.Base64ContentBlock)
// for backwards compatibility
export type Base64ContentBlock =
  | ContentBlock.Multimodal.Image
  | ContentBlock.Multimodal.File
  | Data.Base64ContentBlock; // Deprecated format, kept for backwards compatibility

// Returns a Promise of a typed multimodal block for images or PDFs
export async function fileToContentBlock(
  file: File,
): Promise<Base64ContentBlock> {
  const supportedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const supportedFileTypes = [...supportedImageTypes, "application/pdf"];

  if (!supportedFileTypes.includes(file.type)) {
    toast.error(
      `Unsupported file type: ${file.type}. Supported types are: ${supportedFileTypes.join(", ")}`,
    );
    return Promise.reject(new Error(`Unsupported file type: ${file.type}`));
  }

  const data = await fileToBase64(file);

  if (supportedImageTypes.includes(file.type)) {
    return {
      type: "image" as const,
      mimeType: file.type,
      data,
      metadata: { name: file.name },
    } satisfies ContentBlock.Multimodal.Image;
  }

  // PDF
  return {
    type: "file" as const,
    mimeType: "application/pdf",
    data,
    metadata: { filename: file.name },
  } satisfies ContentBlock.Multimodal.File;
}

// Helper to convert File to base64 string
export async function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data:...;base64, prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Type guard for Base64ContentBlock (supports both new and deprecated formats)
export function isBase64ContentBlock(
  block: unknown,
): block is Base64ContentBlock {
  if (typeof block !== "object" || block === null || !("type" in block))
    return false;

  const blockType = (block as { type: unknown }).type;

  // New format: ContentBlock.Multimodal (has data and mimeType, no source_type)
  if (
    (blockType === "image" || blockType === "file") &&
    "data" in block &&
    typeof (block as { data?: unknown }).data === "string" &&
    "mimeType" in block &&
    typeof (block as { mimeType?: unknown }).mimeType === "string"
  ) {
    const mimeType = (block as { mimeType: string }).mimeType;
    if (
      blockType === "image"
        ? mimeType.startsWith("image/")
        : mimeType === "application/pdf"
    ) {
      return true;
    }
  }

  // Deprecated format: Data.Base64ContentBlock (has source_type and mime_type)
  if (
    (blockType === "file" || blockType === "image") &&
    "source_type" in block &&
    (block as { source_type: unknown }).source_type === "base64" &&
    "mime_type" in block &&
    typeof (block as { mime_type?: unknown }).mime_type === "string"
  ) {
    const mimeType = (block as { mime_type: string }).mime_type;
    if (
      blockType === "file"
        ? mimeType === "application/pdf" || mimeType.startsWith("image/")
        : mimeType.startsWith("image/")
    ) {
      return true;
    }
  }

  return false;
}
