import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Prevent directory traversal attacks
    const sanitizedFilename = filename.replace(/\.\./g, "").replace(/\//g, "");

    const filepath = path.join(
      process.cwd(),
      "public",
      "uploads",
      sanitizedFilename
    );

    // Check if file exists
    try {
      const fileStat = await stat(filepath);
      if (!fileStat.isFile()) {
        return NextResponse.json({ error: "Not a file" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read the file
    const buffer = await readFile(filepath);

    // Determine content type based on extension
    const ext = sanitizedFilename.split(".").pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      bmp: "image/bmp",
      ico: "image/x-icon",
    };

    const contentType = contentTypes[ext || ""] || "application/octet-stream";

    // Return the image with proper headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}
