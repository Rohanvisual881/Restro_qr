import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server configuration is missing.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    // Get logged-in user's access token
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const supabase = getSupabaseAdmin();

    // Verify logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Your login session is invalid." },
        { status: 401 }
      );
    }

    /*
      ADMIN ACCESS

      Your current account already owns a restaurant
      such as Royal Spice.

      Therefore we use owner_id instead of ADMIN_EMAIL.
    */

    const { data: existingRestaurant, error: ownerError } =
      await supabase
        .from("restaurants")
        .select("id, name, owner_id")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();

    if (ownerError) {
      console.error("Owner check error:", ownerError);

      return NextResponse.json(
        { error: ownerError.message },
        { status: 500 }
      );
    }

    if (!existingRestaurant) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to create restaurants.",
        },
        { status: 403 }
      );
    }

    // Read form data
    const body = await request.json();

    const restaurantName = String(
      body.restaurantName || ""
    ).trim();

    const ownerName = String(
      body.ownerName || ""
    ).trim();

    const ownerEmail = String(
      body.ownerEmail || ""
    )
      .trim()
      .toLowerCase();

    const phone = String(
      body.phone || ""
    ).trim();

    const address = String(
      body.address || ""
    ).trim();

    const password = String(
      body.password || ""
    );

    // Validation
    if (!restaurantName) {
      return NextResponse.json(
        { error: "Restaurant name is required." },
        { status: 400 }
      );
    }

    if (!ownerName) {
      return NextResponse.json(
        { error: "Owner name is required." },
        { status: 400 }
      );
    }

    if (!ownerEmail) {
      return NextResponse.json(
        { error: "Owner email is required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    // Create restaurant slug
    const slug = makeSlug(restaurantName);

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid restaurant name.",
        },
        { status: 400 }
      );
    }

    // Check duplicate restaurant/domain
    const { data: duplicate, error: duplicateError } =
      await supabase
        .from("restaurants")
        .select("id, name, slug")
        .eq("slug", slug)
        .maybeSingle();

    if (duplicateError) {
      console.error(
        "Duplicate check error:",
        duplicateError
      );

      return NextResponse.json(
        { error: duplicateError.message },
        { status: 500 }
      );
    }

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            `${slug}.khapiyo.in is already taken.`,
        },
        { status: 409 }
      );
    }

    // Create restaurant owner's Supabase account
    const { data: authData, error: createUserError } =
      await supabase.auth.admin.createUser({
        email: ownerEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: ownerName,
          restaurant_name: restaurantName,
        },
      });

    if (createUserError || !authData.user) {
      console.error(
        "Create user error:",
        createUserError
      );

      return NextResponse.json(
        {
          error:
            createUserError?.message ||
            "Could not create restaurant owner account.",
        },
        { status: 500 }
      );
    }

    const newOwnerId = authData.user.id;

    // Create restaurant
    const { data: restaurant, error: restaurantError } =
      await supabase
        .from("restaurants")
        .insert({
          name: restaurantName,
          slug: slug,
          owner_id: newOwnerId,

          phone: phone || null,
          address: address || null,

          logo_url: null,
          description: null,

          cash_enabled: true,
          upi_enabled: true,
          card_enabled: true,

          upi_id: null,
          upi_qr_url: null,

          opening_time: "10:00",
          closing_time: "23:00",

          is_open: true,

          tax_enabled: false,
          tax_percentage: 0,
        })
        .select()
        .single();

    // If restaurant creation fails,
    // remove the user we just created.
    if (restaurantError) {
      console.error(
        "Create restaurant error:",
        restaurantError
      );

      await supabase.auth.admin.deleteUser(
        newOwnerId
      );

      return NextResponse.json(
        {
          error: restaurantError.message,
        },
        { status: 500 }
      );
    }

    // Success
    return NextResponse.json(
      {
        success: true,

        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
          domain: `${restaurant.slug}.khapiyo.in`,
        },

        owner: {
          id: newOwnerId,
          name: ownerName,
          email: ownerEmail,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE RESTAURANT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}