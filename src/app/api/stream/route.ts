import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const TOKEN_URL =
  "https://sminiplay.imbc.com/aacplay.ashx?channel=sfm&agent=webapp&cmp=m";

const HEADERS = {
  Referer: "https://miniwebapp.imbc.com/",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("mode") ?? "url";

  try {
    // 1단계: 실제 HLS URL (토큰 포함) 획득
    const tokenRes = await fetch(TOKEN_URL, { headers: HEADERS });
    if (!tokenRes.ok) {
      return new NextResponse(`Token fetch failed: ${tokenRes.status}`, {
        status: 502,
      });
    }

    const hlsUrl = (await tokenRes.text()).trim();

    if (!hlsUrl.startsWith("http")) {
      return new NextResponse(`Invalid stream URL: ${hlsUrl}`, { status: 502 });
    }

    // mode=url → 클라이언트에 URL 반환 (클라이언트가 직접 HLS.js로 재생)
    if (mode === "url") {
      return NextResponse.json(
        { url: hlsUrl },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache, no-store",
          },
        }
      );
    }

    // mode=proxy → 스트림을 프록시
    const stream = await fetch(hlsUrl, { headers: HEADERS });
    if (!stream.ok) {
      return new NextResponse(`Stream unavailable: ${stream.status}`, {
        status: stream.status,
      });
    }

    const resHeaders = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache, no-store",
    });

    const ct = stream.headers.get("Content-Type");
    if (ct) resHeaders.set("Content-Type", ct);

    return new NextResponse(stream.body, { status: 200, headers: resHeaders });
  } catch (err) {
    return new NextResponse(`Error: ${err}`, { status: 500 });
  }
}
