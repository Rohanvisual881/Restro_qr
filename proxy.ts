import {
  NextRequest,
  NextResponse,
} from "next/server";

const ROOT_DOMAIN =
  "khapiyo.in";

export function proxy(
  request: NextRequest
) {
  const hostname =
    request.headers.get("host") || "";

  const hostnameWithoutPort =
    hostname.split(":")[0].toLowerCase();

  /*
   * Local development
   *
   * Example:
   * royalbites.localhost:3000
   */

  if (
    hostnameWithoutPort.endsWith(
      ".localhost"
    )
  ) {
    const subdomain =
      hostnameWithoutPort.replace(
        ".localhost",
        ""
      );

    if (
      subdomain &&
      subdomain !== "www"
    ) {
      const url =
        request.nextUrl.clone();

      url.pathname =
        `/restaurant/${subdomain}`;

      return NextResponse.rewrite(
        url
      );
    }

    return NextResponse.next();
  }

  /*
   * Production
   *
   * Example:
   * royalbites.khapiyo.in
   */

  if (
    hostnameWithoutPort.endsWith(
      `.${ROOT_DOMAIN}`
    )
  ) {
    const subdomain =
      hostnameWithoutPort.slice(
        0,
        -(`.${ROOT_DOMAIN}`).length
      );

    if (
      subdomain &&
      subdomain !== "www"
    ) {
      const url =
        request.nextUrl.clone();

      url.pathname =
        `/restaurant/${subdomain}`;

      return NextResponse.rewrite(
        url
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};