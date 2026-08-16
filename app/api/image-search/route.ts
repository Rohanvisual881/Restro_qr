import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query?.trim()) {
      return NextResponse.json(
        { error: "Food name is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "PEXELS_API_KEY is missing." },
        { status: 500 }
      );
    }

    const searchQuery = encodeURIComponent(
      `${query.trim()} food dish restaurant`
    );

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=5`,
      {
        headers: {
          Authorization: apiKey,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Pexels:", error);

      return NextResponse.json(
        { error: "Pexels search failed." },
        { status: 500 }
      );
    }

    const data = await response.json();

    const images = (data.photos || []).map(
      (photo: any) => ({
        id: photo.id,
        imageUrl:
          photo.src?.large2x ||
          photo.src?.large ||
          photo.src?.original,
        thumbnailUrl:
          photo.src?.medium ||
          photo.src?.small,
        photographer:
          photo.photographer,
        photographerUrl:
          photo.photographer_url,
        sourceUrl:
          photo.url,
      })
    );

    return NextResponse.json({
      images,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Image search failed." },
      { status: 500 }
    );
  }
}