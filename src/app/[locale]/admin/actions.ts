"use server";

import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const ADMIN_COOKIE = "nawia-admin-token";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function signToken(password: string): string {
  return createHmac("sha256", password).update("nawia-admin").digest("hex");
}

export async function loginAction(password: string) {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { success: false, error: "wrong_password" };
  }

  const token = signToken(password);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    path: "/",
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  return token === signToken(process.env.ADMIN_PASSWORD);
}

// --- Category CRUD ---

export async function createCategory(formData: FormData) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").insert({
    slug: formData.get("slug") as string,
    name_ar: formData.get("name_ar") as string,
    name_en: formData.get("name_en") as string,
    icon_name: formData.get("icon_name") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({
      slug: formData.get("slug") as string,
      name_ar: formData.get("name_ar") as string,
      name_en: formData.get("name_en") as string,
      icon_name: formData.get("icon_name") as string,
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

// --- Intention CRUD ---

export async function createIntention(formData: FormData) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("intentions").insert({
    category_id: formData.get("category_id") as string,
    text_ar: formData.get("text_ar") as string,
    text_en: formData.get("text_en") as string,
    source_ar: (formData.get("source_ar") as string) || null,
    source_en: (formData.get("source_en") as string) || null,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_published: formData.get("is_published") === "true",
  });

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function updateIntention(id: string, formData: FormData) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("intentions")
    .update({
      category_id: formData.get("category_id") as string,
      text_ar: formData.get("text_ar") as string,
      text_en: formData.get("text_en") as string,
      source_ar: (formData.get("source_ar") as string) || null,
      source_en: (formData.get("source_en") as string) || null,
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
      is_published: formData.get("is_published") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function deleteIntention(id: string) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("intentions").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

// --- Fetch all (for admin) ---

export async function fetchCategories() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data || [];
}

export async function fetchIntentions() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("intentions")
    .select("*, categories(*)")
    .order("sort_order");
  return data || [];
}
