"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import gsap from "gsap";

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

type SearchImage = {
  id: number;
  imageUrl: string;
  thumbnailUrl: string;
  photographer: string;
  photographerUrl: string;
  sourceUrl: string;
};

export default function MenuPage() {
  const router = useRouter();
  const supabase = createClient();

  const pageRef = useRef<HTMLDivElement>(null);
  const categoryListRef = useRef<HTMLDivElement>(null);
  const itemGridRef = useRef<HTMLDivElement>(null);

  const cameraInputRef =
    useRef<HTMLInputElement | null>(null);

  const uploadInputRef =
    useRef<HTMLInputElement | null>(null);

  const [restaurantId, setRestaurantId] =
    useState("");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [items, setItems] =
    useState<MenuItem[]>([]);

  const [categoryName, setCategoryName] =
    useState("");

  const [itemName, setItemName] =
    useState("");

  const [itemDescription, setItemDescription] =
    useState("");

  const [itemPrice, setItemPrice] =
    useState("");

  const [itemCategory, setItemCategory] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [savingCategory, setSavingCategory] =
    useState(false);

  const [savingItem, setSavingItem] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">("error");

  const [searchImages, setSearchImages] =
    useState<SearchImage[]>([]);

  const [imageSearchOpen, setImageSearchOpen] =
    useState(false);

  const [imageSearchLoading, setImageSearchLoading] =
    useState(false);

  const [imageSearchQuery, setImageSearchQuery] =
    useState("");

  const [selectedSearchImage, setSelectedSearchImage] =
    useState<SearchImage | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [formOpen, setFormOpen] =
    useState(false);

  /*
  ==========================================================
  LOAD MENU
  ==========================================================
  */

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const {
      data: restaurant,
      error: restaurantError,
    } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1)
      .maybeSingle();

    if (restaurantError) {
      showError(restaurantError.message);
      setLoading(false);
      return;
    }

    if (!restaurant) {
      router.push("/dashboard/setup");
      return;
    }

    setRestaurantId(restaurant.id);

    const {
      data: categoryData,
      error: categoryError,
    } = await supabase
      .from("categories")
      .select("id, name, sort_order")
      .eq("restaurant_id", restaurant.id)
      .order("sort_order", {
        ascending: true,
      });

    if (categoryError) {
      showError(categoryError.message);
      setLoading(false);
      return;
    }

    const {
      data: itemData,
      error: itemError,
    } = await supabase
      .from("menu_items")
      .select(
        "id, name, description, price, is_available, category_id, image_url"
      )
      .eq("restaurant_id", restaurant.id)
      .order("created_at", {
        ascending: false,
      });

    if (itemError) {
      showError(itemError.message);
      setLoading(false);
      return;
    }

    const nextCategories =
      categoryData || [];

    setCategories(nextCategories);
    setItems(itemData || []);

    if (
      nextCategories.length > 0 &&
      !itemCategory
    ) {
      setItemCategory(
        nextCategories[0].id
      );
    }

    setLoading(false);
  }

  /*
  ==========================================================
  PAGE ENTRANCE
  ==========================================================
  */

  useLayoutEffect(() => {
    if (loading || !pageRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".menu-reveal",
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.055,
          ease: "power2.out",
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [loading]);

  /*
  ==========================================================
  ITEM GRID ANIMATION
  ==========================================================
  */

  useEffect(() => {
    if (loading || !itemGridRef.current) {
      return;
    }

    const cards =
      Array.from(
        itemGridRef.current.querySelectorAll(
          "[data-menu-card]"
        )
      );

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 14,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.035,
        ease: "power2.out",
      }
    );
  }, [
    loading,
    activeCategory,
    searchQuery,
    items.length,
  ]);

  /*
  ==========================================================
  MESSAGES
  ==========================================================
  */

  function showError(text: string) {
    setMessage(text);
    setMessageType("error");
  }

  function showSuccess(text: string) {
    setMessage(text);
    setMessageType("success");

    window.setTimeout(() => {
      setMessage("");
    }, 3500);
  }

  /*
  ==========================================================
  IMAGE SELECT
  ==========================================================
  */

  function handleImageSelect(
    file: File | undefined
  ) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError(
        "Please select an image file."
      );
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      showError(
        "Image must be smaller than 10 MB."
      );
      return;
    }

    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setSelectedSearchImage(null);
    setMessage("");
  }

  function removeSelectedImage() {
    setImageFile(null);
    setImagePreview("");
    setSelectedSearchImage(null);

    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }

    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
  }

  /*
  ==========================================================
  PEXELS SEARCH
  ==========================================================
  */

  async function searchFoodImages() {
    const query =
      imageSearchQuery.trim() ||
      itemName.trim();

    if (!query) {
      showError(
        "Enter a food name first, for example Paneer Tikka."
      );
      return;
    }

    setImageSearchLoading(true);
    setSearchImages([]);
    setSelectedSearchImage(null);
    setMessage("");

    try {
      const response = await fetch(
        "/api/image-search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Image search failed."
        );
      }

      if (
        !data.images ||
        data.images.length === 0
      ) {
        showError(
          "No food images found. Try another search."
        );
        return;
      }

      setSearchImages(
        data.images
      );
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Image search failed."
      );
    } finally {
      setImageSearchLoading(false);
    }
  }

  /*
  ==========================================================
  SELECT PEXELS IMAGE
  ==========================================================
  */

  async function selectSearchImage(
    image: SearchImage
  ) {
    setSelectedSearchImage(image);
    setMessage("");
    setImageSearchLoading(true);

    try {
      const response = await fetch(
        "/api/image-proxy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl:
              image.imageUrl,
          }),
        }
      );

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          data?.error ||
            "Could not prepare selected image."
        );
      }

      const blob =
        await response.blob();

      const file = new File(
        [blob],
        `pexels-${image.id}.jpg`,
        {
          type:
            blob.type ||
            "image/jpeg",
        }
      );

      setImageFile(file);

      const previewUrl =
        URL.createObjectURL(file);

      setImagePreview(previewUrl);

      setMessage(
        "Image selected successfully."
      );

      setMessageType("success");
    } catch (error) {
      setSelectedSearchImage(null);

      showError(
        error instanceof Error
          ? error.message
          : "Could not use this image."
      );
    } finally {
      setImageSearchLoading(false);
    }
  }

  /*
  ==========================================================
  ADD CATEGORY
  ==========================================================
  */

  async function addCategory(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!categoryName.trim()) {
      return;
    }

    setSavingCategory(true);
    setMessage("");

    const { error } =
      await supabase
        .from("categories")
        .insert({
          restaurant_id:
            restaurantId,
          name:
            categoryName.trim(),
          sort_order:
            categories.length,
        });

    if (error) {
      showError(error.message);
      setSavingCategory(false);
      return;
    }

    setCategoryName("");
    setSavingCategory(false);

    showSuccess(
      "Category added successfully."
    );

    await loadMenu();
  }

  /*
  ==========================================================
  UPLOAD IMAGE
  ==========================================================
  */

  async function uploadMenuImage(
    file: File,
    menuItemId: string
  ) {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const filePath =
      `${restaurantId}/${menuItemId}-${Date.now()}.${extension}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("menu-images")
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
          contentType:
            file.type ||
            "image/jpeg",
        }
      );

    if (uploadError) {
      throw new Error(
        uploadError.message
      );
    }

    const {
      data: publicUrlData,
    } =
      supabase.storage
        .from("menu-images")
        .getPublicUrl(
          filePath
        );

    return publicUrlData.publicUrl;
  }

  /*
  ==========================================================
  ADD FOOD ITEM
  ==========================================================
  */

  async function addItem(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      !itemName.trim() ||
      !itemPrice ||
      !itemCategory
    ) {
      showError(
        "Please enter item name, price and category."
      );
      return;
    }

    setSavingItem(true);
    setMessage("");

    const {
      data: newItem,
      error: itemError,
    } =
      await supabase
        .from("menu_items")
        .insert({
          restaurant_id:
            restaurantId,
          category_id:
            itemCategory,
          name:
            itemName.trim(),
          description:
            itemDescription.trim() ||
            null,
          price:
            Number(itemPrice),
          is_available: true,
        })
        .select("id")
        .single();

    if (itemError) {
      showError(
        itemError.message
      );
      setSavingItem(false);
      return;
    }

    if (newItem) {
      try {
        let fileToUpload:
          | File
          | null =
          imageFile;

        if (
          !fileToUpload &&
          selectedSearchImage
        ) {
          const proxyResponse =
            await fetch(
              "/api/image-proxy",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify(
                  {
                    imageUrl:
                      selectedSearchImage.imageUrl,
                  }
                ),
              }
            );

          if (
            !proxyResponse.ok
          ) {
            throw new Error(
              "Could not download the selected food image."
            );
          }

          const blob =
            await proxyResponse.blob();

          fileToUpload =
            new File(
              [blob],
              `pexels-${selectedSearchImage.id}.jpg`,
              {
                type:
                  blob.type ||
                  "image/jpeg",
              }
            );
        }

        if (fileToUpload) {
          const imageUrl =
            await uploadMenuImage(
              fileToUpload,
              newItem.id
            );

          const {
            error:
              imageUpdateError,
          } =
            await supabase
              .from("menu_items")
              .update({
                image_url:
                  imageUrl,
              })
              .eq(
                "id",
                newItem.id
              );

          if (
            imageUpdateError
          ) {
            throw new Error(
              imageUpdateError.message
            );
          }
        }
      } catch (imageError) {
        showError(
          `Food item created, but image upload failed: ${
            imageError instanceof Error
              ? imageError.message
              : "Unknown error"
          }`
        );

        setItemName("");
        setItemDescription("");
        setItemPrice("");
        removeSelectedImage();
        setSearchImages([]);
        setImageSearchQuery("");
        setImageSearchOpen(false);
        setSavingItem(false);

        await loadMenu();
        return;
      }
    }

    setItemName("");
    setItemDescription("");
    setItemPrice("");
    removeSelectedImage();

    setSearchImages([]);
    setImageSearchQuery("");
    setImageSearchOpen(false);

    setSavingItem(false);
    setFormOpen(false);

    showSuccess(
      "Food item added successfully."
    );

    await loadMenu();
  }

  /*
  ==========================================================
  TOGGLE AVAILABILITY
  ==========================================================
  */

  async function toggleAvailability(
    item: MenuItem
  ) {
    const nextAvailable =
      !item.is_available;

    setItems(
      (currentItems) =>
        currentItems.map(
          (currentItem) =>
            currentItem.id ===
            item.id
              ? {
                  ...currentItem,
                  is_available:
                    nextAvailable,
                }
              : currentItem
        )
    );

    const { error } =
      await supabase
        .from("menu_items")
        .update({
          is_available:
            nextAvailable,
        })
        .eq("id", item.id);

    if (error) {
      setItems(
        (currentItems) =>
          currentItems.map(
            (currentItem) =>
              currentItem.id ===
              item.id
                ? {
                    ...currentItem,
                    is_available:
                      !nextAvailable,
                  }
                : currentItem
          )
      );

      showError(error.message);
      return;
    }

    showSuccess(
      nextAvailable
        ? `${item.name} is available.`
        : `${item.name} is unavailable.`
    );
  }

  /*
  ==========================================================
  HELPERS
  ==========================================================
  */

  function getCategoryName(
    categoryId: string | null
  ) {
    const category =
      categories.find(
        (item) =>
          item.id === categoryId
      );

    return (
      category?.name ||
      "Uncategorized"
    );
  }

  const filteredItems =
    items.filter((item) => {
      const matchesCategory =
        activeCategory ===
          "all" ||
        item.category_id ===
          activeCategory;

      const query =
        searchQuery
          .trim()
          .toLowerCase();

      const matchesSearch =
        !query ||
        item.name
          .toLowerCase()
          .includes(query) ||
        item.description
          ?.toLowerCase()
          .includes(query);

      return (
        matchesCategory &&
        matchesSearch
      );
    });

  const availableCount =
    items.filter(
      (item) =>
        item.is_available
    ).length;

  const unavailableCount =
    items.length -
    availableCount;

  /*
  ==========================================================
  LOADING
  ==========================================================
  */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <div className="w-full max-w-4xl px-5">
          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-[22px] bg-white" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="h-24 animate-pulse rounded-[18px] bg-white" />
              <div className="h-24 animate-pulse rounded-[18px] bg-white" />
              <div className="h-24 animate-pulse rounded-[18px] bg-white" />
            </div>
            <div className="h-56 animate-pulse rounded-[22px] bg-white" />
          </div>
        </div>
      </main>
    );
  }

  /*
  ==========================================================
  PAGE
  ==========================================================
  */

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-[#F7F7F5] text-[#1F1F1F]"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="menu-reveal overflow-hidden rounded-[22px] border border-[#E9E9E7] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]">

          <div className="bg-[#0C831F] px-5 py-5 text-white sm:px-7">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                  Restaurant Admin
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Menu Management
                </h1>

                <p className="mt-1 text-sm text-white/75">
                  Manage dishes, categories,
                  photos and availability.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard"
                  )
                }
                className="w-fit rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0C831F]"
              >
                ← Dashboard
              </button>

            </div>

          </div>

          <div className="flex flex-wrap gap-2 border-t border-[#EEEEEE] p-4">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold text-[#1F1F1F]"
            >
              📊 Dashboard
            </button>

            <button
              type="button"
              className="rounded-xl bg-[#0C831F] px-4 py-2.5 text-sm font-bold text-white"
            >
              🍽️ Menu
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/tables"
                )
              }
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold text-[#1F1F1F]"
            >
              🪑 Tables & QR
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/orders"
                )
              }
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold text-[#1F1F1F]"
            >
              📜 Order History
            </button>

          </div>

        </header>

        {/* ==================================================
            MESSAGE
        ================================================== */}

        {message && (
          <div
            className={`menu-reveal mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              messageType ===
              "success"
                ? "border-[#CDE8C5] bg-[#E9F8E5] text-[#0C831F]"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* ==================================================
            STATS
        ================================================== */}

        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="menu-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Total Items
            </p>
            <p className="mt-2 text-3xl font-bold">
              {items.length}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              On your menu
            </p>
          </div>

          <div className="menu-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Available
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0C831F]">
              {availableCount}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Customers can order
            </p>
          </div>

          <div className="menu-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Unavailable
            </p>
            <p className="mt-2 text-3xl font-bold text-[#B42318]">
              {unavailableCount}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Hidden from customers
            </p>
          </div>

          <div className="menu-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Categories
            </p>
            <p className="mt-2 text-3xl font-bold">
              {categories.length}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Menu sections
            </p>
          </div>

        </section>

        {/* ==================================================
            CATEGORY + ADD
        ================================================== */}

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">

          {/* CATEGORY */}

          <section className="menu-reveal rounded-[22px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#54B226]">
                  Organize
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Categories
                </h2>

                <p className="mt-1 text-sm text-[#6B7280]">
                  Create sections for your menu.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9F8E5]">
                📂
              </div>

            </div>

            <form
              onSubmit={addCategory}
              className="mt-5 flex gap-2"
            >

              <input
                type="text"
                value={categoryName}
                onChange={(e) =>
                  setCategoryName(
                    e.target.value
                  )
                }
                placeholder="e.g. Starters"
                className="min-w-0 flex-1 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:border-[#0C831F] focus:ring-2 focus:ring-[#0C831F]/10"
              />

              <button
                type="submit"
                disabled={
                  savingCategory
                }
                className="rounded-xl bg-[#0C831F] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {savingCategory
                  ? "..."
                  : "+ Add"}
              </button>

            </form>

            <div
              ref={categoryListRef}
              className="mt-5 max-h-64 space-y-2 overflow-y-auto"
            >

              {categories.length ===
              0 ? (
                <div className="rounded-xl border border-dashed border-[#D9D9D6] bg-[#F7F7F5] p-6 text-center text-sm text-[#6B7280]">
                  No categories yet.
                </div>
              ) : (
                categories.map(
                  (category) => (
                    <button
                      key={
                        category.id
                      }
                      type="button"
                      onClick={() =>
                        setActiveCategory(
                          category.id
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left ${
                        activeCategory ===
                        category.id
                          ? "border-[#BFE3B7] bg-[#E9F8E5]"
                          : "border-[#EEEEEE] bg-[#FAFAF9]"
                      }`}
                    >
                      <span
                        className={`font-semibold ${
                          activeCategory ===
                          category.id
                            ? "text-[#0C831F]"
                            : "text-[#1F1F1F]"
                        }`}
                      >
                        {category.name}
                      </span>

                      <span className="text-xs text-[#9CA3AF]">
                        {
                          items.filter(
                            (item) =>
                              item.category_id ===
                              category.id
                          ).length
                        }{" "}
                        items
                      </span>
                    </button>
                  )
                )
              )}

            </div>

          </section>

          {/* ADD FOOD */}

          <section className="menu-reveal rounded-[22px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#54B226]">
                  Add to menu
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Add Food Item
                </h2>

                <p className="mt-1 text-sm text-[#6B7280]">
                  Add dishes customers can order.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormOpen(
                    !formOpen
                  )
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9F8E5] text-lg"
              >
                {formOpen
                  ? "×"
                  : "＋"}
              </button>

            </div>

            {formOpen ? (
              categories.length ===
              0 ? (
                <div className="mt-5 rounded-2xl border border-[#F3D48A] bg-[#FFF7D6] p-4 text-sm font-semibold text-[#8A6500]">
                  Create a category first, then you can add food items.
                </div>
              ) : (
                <form
                  onSubmit={addItem}
                  className="mt-5 space-y-5"
                >

                  {/* IMAGE */}

                  <div>
                    <label className="text-sm font-bold text-[#1F1F1F]">
                      Food Image
                    </label>

                    <input
                      ref={
                        cameraInputRef
                      }
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) =>
                        handleImageSelect(
                          e.target
                            .files?.[0]
                        )
                      }
                    />

                    <input
                      ref={
                        uploadInputRef
                      }
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageSelect(
                          e.target
                            .files?.[0]
                        )
                      }
                    />

                    {!imagePreview ? (
                      <div className="mt-2 rounded-2xl border-2 border-dashed border-[#D9D9D6] bg-[#F7F7F5] p-5">

                        <div className="text-center">
                          <div className="text-4xl">
                            📷
                          </div>

                          <p className="mt-2 font-bold">
                            Add a food photo
                          </p>

                          <p className="mt-1 text-xs text-[#6B7280]">
                            Take a photo, upload one, or search food images.
                          </p>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2">

                          <button
                            type="button"
                            onClick={() =>
                              cameraInputRef.current?.click()
                            }
                            className="rounded-xl bg-[#0C831F] px-4 py-3 text-sm font-bold text-white"
                          >
                            📷 Take Photo
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              uploadInputRef.current?.click()
                            }
                            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-bold text-[#1F1F1F]"
                          >
                            📁 Upload Photo
                          </button>

                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setImageSearchOpen(
                              !imageSearchOpen
                            );

                            if (
                              !imageSearchQuery
                            ) {
                              setImageSearchQuery(
                                itemName
                              );
                            }
                          }}
                          className="mt-2 w-full rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700"
                        >
                          ✨ Search Food Images
                        </button>

                      </div>
                    ) : (
                      <div className="mt-2 overflow-hidden rounded-2xl border border-[#EEEEEE] bg-[#F7F7F5]">

                        <img
                          src={
                            imagePreview
                          }
                          alt="Food preview"
                          className="h-56 w-full object-cover"
                        />

                        <div className="flex flex-wrap gap-2 p-3">

                          <button
                            type="button"
                            onClick={() =>
                              cameraInputRef.current?.click()
                            }
                            className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold"
                          >
                            📷 Retake
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              uploadInputRef.current?.click()
                            }
                            className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold"
                          >
                            📁 Change
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setImageSearchOpen(
                                !imageSearchOpen
                              );

                              if (
                                !imageSearchQuery
                              ) {
                                setImageSearchQuery(
                                  itemName
                                );
                              }
                            }}
                            className="flex-1 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700"
                          >
                            ✨ Search
                          </button>

                          <button
                            type="button"
                            onClick={
                              removeSelectedImage
                            }
                            className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                          >
                            Remove
                          </button>

                        </div>

                      </div>
                    )}

                    {/* IMAGE SEARCH */}

                    {imageSearchOpen && (
                      <div className="mt-3 rounded-2xl border border-purple-100 bg-purple-50/50 p-4">

                        <div className="flex gap-2">

                          <input
                            type="text"
                            value={
                              imageSearchQuery
                            }
                            onChange={(e) =>
                              setImageSearchQuery(
                                e.target.value
                              )
                            }
                            onKeyDown={(e) => {
                              if (
                                e.key ===
                                "Enter"
                              ) {
                                e.preventDefault();
                                searchFoodImages();
                              }
                            }}
                            placeholder="e.g. Paneer Tikka"
                            className="min-w-0 flex-1 rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500"
                          />

                          <button
                            type="button"
                            onClick={
                              searchFoodImages
                            }
                            disabled={
                              imageSearchLoading
                            }
                            className="rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                          >
                            {imageSearchLoading
                              ? "..."
                              : "Search"}
                          </button>

                        </div>

                        {imageSearchLoading && (
                          <div className="py-8 text-center text-sm text-[#6B7280]">
                            🔎 Finding food images...
                          </div>
                        )}

                        {!imageSearchLoading &&
                          searchImages.length >
                            0 && (
                            <div className="mt-4">

                              <p className="mb-3 text-sm font-bold text-[#1F1F1F]">
                                Choose an image
                              </p>

                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                                {searchImages.map(
                                  (image) => (
                                    <button
                                      key={
                                        image.id
                                      }
                                      type="button"
                                      onClick={() =>
                                        selectSearchImage(
                                          image
                                        )
                                      }
                                      className={`group overflow-hidden rounded-xl border-2 bg-white text-left ${
                                        selectedSearchImage?.id ===
                                        image.id
                                          ? "border-purple-600 ring-2 ring-purple-200"
                                          : "border-[#E5E7EB]"
                                      }`}
                                    >

                                      <img
                                        src={
                                          image.thumbnailUrl ||
                                          image.imageUrl
                                        }
                                        alt={
                                          imageSearchQuery
                                        }
                                        className="h-28 w-full object-cover"
                                      />

                                      <div className="p-2">

                                        <p className="truncate text-xs font-semibold text-[#4B5563]">
                                          {
                                            image.photographer
                                          }
                                        </p>

                                        {selectedSearchImage?.id ===
                                          image.id && (
                                          <p className="mt-1 text-xs font-bold text-purple-600">
                                            ✓ Selected
                                          </p>
                                        )}

                                      </div>

                                    </button>
                                  )
                                )}

                              </div>

                              <p className="mt-3 text-center text-[11px] text-[#6B7280]">
                                Photos provided by Pexels
                              </p>

                            </div>
                          )}

                      </div>
                    )}

                  </div>

                  {/* DETAILS */}

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div className="sm:col-span-2">

                      <label className="text-sm font-bold">
                        Food Name
                      </label>

                      <input
                        type="text"
                        required
                        value={itemName}
                        onChange={(e) =>
                          setItemName(
                            e.target.value
                          )
                        }
                        placeholder="Paneer Tikka"
                        className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none focus:border-[#0C831F] focus:ring-2 focus:ring-[#0C831F]/10"
                      />

                    </div>

                    <div>

                      <label className="text-sm font-bold">
                        Description
                      </label>

                      <textarea
                        value={
                          itemDescription
                        }
                        onChange={(e) =>
                          setItemDescription(
                            e.target.value
                          )
                        }
                        rows={3}
                        placeholder="Short description..."
                        className="mt-2 w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:border-[#0C831F] focus:ring-2 focus:ring-[#0C831F]/10"
                      />

                    </div>

                    <div className="space-y-4">

                      <div>

                        <label className="text-sm font-bold">
                          Price
                        </label>

                        <div className="relative mt-2">

                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-[#6B7280]">
                            ₹
                          </span>

                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={
                              itemPrice
                            }
                            onChange={(e) =>
                              setItemPrice(
                                e.target.value
                              )
                            }
                            placeholder="220"
                            className="w-full rounded-xl border border-[#E5E7EB] bg-white py-3 pl-9 pr-4 outline-none focus:border-[#0C831F] focus:ring-2 focus:ring-[#0C831F]/10"
                          />

                        </div>

                      </div>

                      <div>

                        <label className="text-sm font-bold">
                          Category
                        </label>

                        <select
                          value={
                            itemCategory
                          }
                          onChange={(e) =>
                            setItemCategory(
                              e.target.value
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none focus:border-[#0C831F] focus:ring-2 focus:ring-[#0C831F]/10"
                        >
                          {categories.map(
                            (category) => (
                              <option
                                key={
                                  category.id
                                }
                                value={
                                  category.id
                                }
                              >
                                {
                                  category.name
                                }
                              </option>
                            )
                          )}
                        </select>

                      </div>

                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={
                      savingItem
                    }
                    className="w-full rounded-xl bg-[#0C831F] px-5 py-3.5 text-sm font-bold text-white shadow-sm disabled:opacity-50"
                  >
                    {savingItem
                      ? "Adding Food Item..."
                      : "＋ Add Food Item"}
                  </button>

                </form>
              )
            ) : (
              <button
                type="button"
                onClick={() =>
                  setFormOpen(true)
                }
                className="mt-5 flex w-full items-center justify-center rounded-2xl border border-dashed border-[#CFE5CA] bg-[#F4FBF2] px-5 py-8 text-sm font-bold text-[#0C831F]"
              >
                ＋ Open Add Food Form
              </button>
            )}

          </section>

        </div>

        {/* ==================================================
            MENU TOOLBAR
        ================================================== */}

        <section className="menu-reveal mt-5 rounded-[22px] border border-[#E9E9E7] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Your Menu
              </h2>

              <p className="mt-1 text-sm text-[#6B7280]">
                Showing{" "}
                {filteredItems.length}{" "}
                of{" "}
                {items.length} items
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="relative">

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                  🔎
                </span>

                <input
                  type="search"
                  value={
                    searchQuery
                  }
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  placeholder="Search food..."
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAF9] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#0C831F] sm:w-64"
                />

              </div>

              <button
                type="button"
                onClick={() =>
                  setFormOpen(true)
                }
                className="rounded-xl bg-[#0C831F] px-4 py-2.5 text-sm font-bold text-white"
              >
                ＋ Add Food
              </button>

            </div>

          </div>

          {/* CATEGORY FILTER */}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

            <button
              type="button"
              onClick={() =>
                setActiveCategory(
                  "all"
                )
              }
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
                activeCategory ===
                "all"
                  ? "bg-[#0C831F] text-white"
                  : "border border-[#E5E7EB] bg-white text-[#6B7280]"
              }`}
            >
              All ({items.length})
            </button>

            {categories.map(
              (category) => {
                const count =
                  items.filter(
                    (item) =>
                      item.category_id ===
                      category.id
                  ).length;

                return (
                  <button
                    key={
                      category.id
                    }
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        category.id
                      )
                    }
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
                      activeCategory ===
                      category.id
                        ? "bg-[#0C831F] text-white"
                        : "border border-[#E5E7EB] bg-white text-[#6B7280]"
                    }`}
                  >
                    {
                      category.name
                    }{" "}
                    ({count})
                  </button>
                );
              }
            )}

          </div>

        </section>

        {/* ==================================================
            MENU GRID
        ================================================== */}

        <section
          ref={itemGridRef}
          className="mt-5"
        >

          {filteredItems.length ===
          0 ? (
            <div className="menu-reveal rounded-[22px] border border-[#E9E9E7] bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                {items.length ===
                0
                  ? "🍽️"
                  : "🔎"}
              </div>

              <h3 className="mt-4 text-xl font-bold">
                {items.length ===
                0
                  ? "Your menu is empty"
                  : "No matching dishes"}
              </h3>

              <p className="mt-2 text-sm text-[#6B7280]">
                {items.length ===
                0
                  ? "Add your first food item above."
                  : "Try another search or category."}
              </p>

              {items.length ===
                0 && (
                <button
                  type="button"
                  onClick={() =>
                    setFormOpen(
                      true
                    )
                  }
                  className="mt-5 rounded-xl bg-[#0C831F] px-5 py-3 text-sm font-bold text-white"
                >
                  ＋ Add Food Item
                </button>
              )}

            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {filteredItems.map(
                (item) => (
                  <article
                    key={
                      item.id
                    }
                    data-menu-card
                    className="group overflow-hidden rounded-[20px] border border-[#E9E9E7] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F3F0]">

                      {item.image_url ? (
                        <img
                          src={
                            item.image_url
                          }
                          alt={
                            item.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl">
                          🍽️
                        </div>
                      )}

                      <div className="absolute left-3 top-3">

                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${
                            item.is_available
                              ? "bg-[#E9F8E5] text-[#0C831F]"
                              : "bg-white/95 text-[#B42318]"
                          }`}
                        >
                          {item.is_available
                            ? "● AVAILABLE"
                            : "● UNAVAILABLE"}
                        </span>

                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="p-4">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h3 className="truncate text-base font-bold text-[#1F1F1F]">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-xs font-semibold text-[#6B7280]">
                            {getCategoryName(
                              item.category_id
                            )}
                          </p>

                        </div>

                        <p className="shrink-0 text-lg font-bold text-[#1F1F1F]">
                          ₹
                          {Number(
                            item.price
                          ).toFixed(
                            0
                          )}
                        </p>

                      </div>

                      {item.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-5 text-[#6B7280]">
                          {
                            item.description
                          }
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            toggleAvailability(
                              item
                            )
                          }
                          className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold ${
                            item.is_available
                              ? "border border-[#F0C4C4] bg-white text-[#B42318]"
                              : "bg-[#0C831F] text-white"
                          }`}
                        >
                          {item.is_available
                            ? "Mark Unavailable"
                            : "Make Available"}
                        </button>

                      </div>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}