import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// MBC 표준FM 스트림 URL 목록
const STREAM_URLS = [
  "https://miniplay.imbc.com/Live?id=sfm",
  "http://miniplay.imbc.com/Live?id=sfm&cmp=m",
];

export async function GET(req: NextRequest) {
  const urlIndex = parseInt(req.nextUrl.searchParams.get("src") || "0", 10);
  const streamUrl = STREAM_URLS[Math.min(urlIndex, STREAM_URLS.length - 1)];

  try {
    const upstream = await fetch(streamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MBCRadioProxy/1.0)",
        "Accept": "*/*",
        "Icy-MetaData": "1",
      },
    });

    if (!upstream.ok) {
      return new Response(`Stream unavailable: ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", "no-cache, no-store");

    const contentType = upstream.headers.get("Content-Type");
    if (contentType) headers.set("Content-Type", contentType);

    const iceStreamTitle = upstream.headers.get("icy-name");
    if (iceStreamTitle) headers.set("icy-name", iceStreamTitle);

    return new Response(upstream.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    return new Response(`Proxy error: ${err}`, { status: 502 });
  }
}
