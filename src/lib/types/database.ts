export interface Category {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  icon_name: string;
  sort_order: number;
  created_at: string;
}

export interface Intention {
  id: string;
  category_id: string;
  text_ar: string;
  text_en: string;
  source_ar: string | null;
  source_en: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntentionWithCategory extends Intention {
  categories: Category;
}

export interface CategoryWithIntentions extends Category {
  intentions: Intention[];
}
