import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required." },
        { status: 400 }
      );
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Could not download image." },
        { status: 500 }
      );
    }

    const contentType =
      response.headers.get("content-type") ||
      "image/jpeg";

    const arrayBuffer =
      await response.arrayBuffer();

    return new NextResponse(
      arrayBuffer,
      {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control":
            "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error(
      "Image proxy error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not process selected image.",
      },
      { status: 500 }
    );
  }
}