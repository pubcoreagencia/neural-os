import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";

export interface ParsedSource {
  text: string;
  parser: string;
}

export async function parseSourceFile(filePath: string): Promise<ParsedSource> {
  const lower = filePath.toLowerCase();

  if (lower.endsWith(".md") || lower.endsWith(".txt")) {
    return {
      text: await readFile(filePath, "utf8"),
      parser: lower.endsWith(".md") ? "markdown" : "text"
    };
  }

  if (lower.endsWith(".pdf")) {
    const buffer = await readFile(filePath);
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return {
      text: result.text,
      parser: "pdf"
    };
  }

  throw new Error(`Unsupported file type: ${filePath}`);
}

export function cleanText(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function chunkText(text: string, maxChars = 1200) {
  const paragraphs = text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) chunks.push(current);
    if (paragraph.length <= maxChars) {
      current = paragraph;
      continue;
    }

    const sentences = paragraph.split(/(?<=[.!?])\s+/);
    let sentenceBuffer = "";
    for (const sentence of sentences) {
      const sentenceCandidate = sentenceBuffer ? `${sentenceBuffer} ${sentence}` : sentence;
      if (sentenceCandidate.length <= maxChars) {
        sentenceBuffer = sentenceCandidate;
      } else {
        if (sentenceBuffer) chunks.push(sentenceBuffer);
        sentenceBuffer = sentence;
      }
    }
    current = sentenceBuffer;
  }

  if (current) chunks.push(current);
  return chunks;
}
