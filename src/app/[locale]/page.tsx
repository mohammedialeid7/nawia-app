import { createClient } from "@/lib/supabase/server";
import { HomeContent } from "@/components/home/home-content";
import type { CategoryWithIntentions } from "@/lib/types/database";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: categoriesWithIntentions } = await supabase
    .from("categories")
    .select("*, intentions(*)")
    .eq("intentions.is_published", true)
    .order("sort_order")
    .order("sort_order", { referencedTable: "intentions" });

  return (
    <HomeContent
      categories={(categoriesWithIntentions as CategoryWithIntentions[]) || []}
    />
  );
}
