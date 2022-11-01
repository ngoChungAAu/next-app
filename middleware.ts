import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    // Not an api route
    req.nextUrl.pathname.includes("/api/") ||
    // Not a file in /public
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  if (req.nextUrl.locale === "default") {
    const cookiesLocale = req.cookies.get("NEXT_LOCALE");
    const acceptLanguage = req?.headers?.get("accept-language")
      ? req?.headers
          ?.get("accept-language")
          ?.split(",")?.[0]
          .split("-")?.[0]
          .toLowerCase()
      : null;

    const locale = cookiesLocale || acceptLanguage || "en";

    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }
}
