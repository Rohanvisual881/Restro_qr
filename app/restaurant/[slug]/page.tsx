import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
  sort_order: number;
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  category_id: string | null;
  image_url: string | null;
};

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  is_open: boolean;
  tax_enabled: boolean;
  tax_percentage: number | null;
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RestaurantPage({
  params,
}: Props) {
  const { slug } = await params;

  const supabase = createClient();

  const {
    data: restaurant,
    error: restaurantError,
  } = await supabase
    .from("restaurants")
    .select(
      `
      id,
      name,
      slug,
      logo_url,
      phone,
      address,
      description,
      is_open,
      tax_enabled,
      tax_percentage
      `
    )
    .eq("slug", slug.toLowerCase())
    .maybeSingle();

  if (restaurantError || !restaurant) {
    notFound();
  }

  const { data: categories } =
    await supabase
      .from("categories")
      .select(
        "id, name, sort_order"
      )
      .eq(
        "restaurant_id",
        restaurant.id
      )
      .order(
        "sort_order",
        {
          ascending: true,
        }
      );

  const { data: items } =
    await supabase
      .from("menu_items")
      .select(
        `
        id,
        name,
        description,
        price,
        is_available,
        category_id,
        image_url
        `
      )
      .eq(
        "restaurant_id",
        restaurant.id
      )
      .eq(
        "is_available",
        true
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  const categoryList =
    (categories || []) as Category[];

  const menuItems =
    (items || []) as MenuItem[];

  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#1F1F1F]">

      {/* HEADER */}

      <header className="bg-white border-b border-[#E9E9E7]">

        <div className="mx-auto max-w-5xl px-4 py-5">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9F8E5] text-2xl">
                  🍽️
                </div>
              )}

              <div>

                <h1 className="text-xl font-bold sm:text-2xl">
                  {restaurant.name}
                </h1>

                {restaurant.address && (
                  <p className="mt-1 text-xs text-[#6B7280]">
                    {restaurant.address}
                  </p>
                )}

              </div>

            </div>

            <div>
              {restaurant.is_open ? (
                <span className="rounded-full bg-[#E9F8E5] px-3 py-1.5 text-xs font-bold text-[#0C831F]">
                  ● Open
                </span>
              ) : (
                <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                  ● Closed
                </span>
              )}
            </div>

          </div>

          {restaurant.description && (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6B7280]">
              {restaurant.description}
            </p>
          )}

        </div>

      </header>

      {/* MENU */}

      <div className="mx-auto max-w-5xl px-4 py-6">

        {categoryList.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <div className="text-5xl">
              🍽️
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Menu coming soon
            </h2>

            <p className="mt-2 text-sm text-[#6B7280]">
              This restaurant hasn't added its menu yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">

            {categoryList.map(
              (category) => {

                const categoryItems =
                  menuItems.filter(
                    (item) =>
                      item.category_id ===
                      category.id
                  );

                if (
                  categoryItems.length ===
                  0
                ) {
                  return null;
                }

                return (
                  <section
                    key={category.id}
                  >

                    <div className="mb-4">

                      <h2 className="text-xl font-bold">
                        {category.name}
                      </h2>

                      <div className="mt-2 h-1 w-10 rounded-full bg-[#0C831F]" />

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      {categoryItems.map(
                        (item) => (
                          <article
                            key={item.id}
                            className="overflow-hidden rounded-2xl border border-[#E9E9E7] bg-white"
                          >

                            {item.image_url && (
                              <div className="aspect-[16/10] overflow-hidden bg-[#F3F3F0]">

                                <img
                                  src={
                                    item.image_url
                                  }
                                  alt={
                                    item.name
                                  }
                                  className="h-full w-full object-cover"
                                />

                              </div>
                            )}

                            <div className="p-4">

                              <div className="flex items-start justify-between gap-4">

                                <h3 className="font-bold">
                                  {item.name}
                                </h3>

                                <p className="shrink-0 font-bold text-[#0C831F]">
                                  ₹
                                  {Number(
                                    item.price
                                  ).toFixed(
                                    0
                                  )}
                                </p>

                              </div>

                              {item.description && (
                                <p className="mt-2 text-sm leading-5 text-[#6B7280]">
                                  {
                                    item.description
                                  }
                                </p>
                              )}

                              <button
                                type="button"
                                disabled={
                                  !restaurant.is_open
                                }
                                className="mt-4 w-full rounded-xl bg-[#0C831F] px-4 py-3 text-sm font-bold text-white disabled:bg-[#D9D9D6] disabled:text-[#777]"
                              >
                                {restaurant.is_open
                                  ? "Add to Order"
                                  : "Restaurant Closed"}
                              </button>

                            </div>

                          </article>
                        )
                      )}

                    </div>

                  </section>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* FOOTER */}

      <footer className="border-t border-[#E9E9E7] bg-white py-6 text-center">

        <p className="text-xs text-[#9CA3AF]">
          Powered by{" "}
          <span className="font-bold text-[#0C831F]">
            KhaPiyo
          </span>
        </p>

      </footer>

    </main>
  );
}