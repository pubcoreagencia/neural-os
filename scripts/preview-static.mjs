import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";

const root = process.cwd();
const appDir = resolve(root, ".next/server/app");
const staticDir = resolve(root, ".next/static");
const port = Number(process.argv[2] || process.env.PORT || 3000);

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2"
};

function safePath(base, urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(base, clean);
  return filePath.startsWith(base) ? filePath : null;
}

function sendFile(response, filePath) {
  if (!filePath || !existsSync(filePath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": mime[extname(filePath)] || "application/octet-stream",
    "cache-control": "no-store"
  });
  createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (url.pathname.startsWith("/_next/static/")) {
    const relative = url.pathname.replace("/_next/static/", "");
    sendFile(response, safePath(staticDir, relative));
    return;
  }

  if (url.pathname === "/robots.txt") {
    sendFile(response, join(appDir, "robots.txt.body"));
    return;
  }

  if (url.pathname === "/sitemap.xml") {
    sendFile(response, join(appDir, "sitemap.xml.body"));
    return;
  }

  sendFile(response, join(appDir, "index.html"));
});

server.listen(port, () => {
  console.log(`Static preview ready at http://localhost:${port}`);
});
