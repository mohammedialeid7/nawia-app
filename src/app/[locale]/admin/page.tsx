"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import {
  loginAction,
  logoutAction,
  verifyAdmin,
  fetchCategories,
  fetchIntentions,
  createCategory,
  updateCategory,
  deleteCategory,
  createIntention,
  updateIntention,
  deleteIntention,
} from "./actions";
import type { Category, IntentionWithCategory } from "@/lib/types/database";

export default function AdminPage() {
  const t = useTranslations("admin");
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [intentions, setIntentions] = useState<IntentionWithCategory[]>([]);

  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [intDialogOpen, setIntDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editingInt, setEditingInt] = useState<IntentionWithCategory | null>(
    null
  );

  const loadData = useCallback(async () => {
    const [cats, ints] = await Promise.all([
      fetchCategories(),
      fetchIntentions(),
    ]);
    setCategories(cats as Category[]);
    setIntentions(ints as IntentionWithCategory[]);
  }, []);

  useEffect(() => {
    verifyAdmin().then((ok) => {
      setIsAuth(ok);
      setChecking(false);
      if (ok) loadData();
    });
  }, [loadData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await loginAction(password);
    if (result.success) {
      setIsAuth(true);
      loadData();
    } else {
      setError(t("wrong_password"));
    }
  }

  async function handleLogout() {
    await logoutAction();
    setIsAuth(false);
    setPassword("");
  }

  async function handleSaveCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingCat) {
      await updateCategory(editingCat.id, formData);
    } else {
      await createCategory(formData);
    }
    setCatDialogOpen(false);
    setEditingCat(null);
    loadData();
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm(t("confirm_delete"))) return;
    await deleteCategory(id);
    loadData();
  }

  async function handleSaveIntention(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingInt) {
      await updateIntention(editingInt.id, formData);
    } else {
      await createIntention(formData);
    }
    setIntDialogOpen(false);
    setEditingInt(null);
    loadData();
  }

  async function handleDeleteIntention(id: string) {
    if (!confirm(t("confirm_delete"))) return;
    await deleteIntention(id);
    loadData();
  }

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300 border-t-brand-700" />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 rounded-xl border border-brand-200 bg-surface-base p-6 shadow-card"
        >
          <h1 className="text-xl font-bold text-brand-900 font-[family-name:var(--font-heading)]">
            {t("title")}
          </h1>
          <div>
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full bg-brand-800 hover:bg-brand-700">
            {t("login")}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-900 font-[family-name:var(--font-heading)]">
          {t("title")}
        </h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 me-1" />
          {t("logout")}
        </Button>
      </div>

      <Tabs defaultValue="categories">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">{t("categories")}</TabsTrigger>
          <TabsTrigger value="intentions">{t("intentions")}</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="mb-4 flex justify-end">
            <Dialog open={catDialogOpen} onOpenChange={(v) => { setCatDialogOpen(v); if (!v) setEditingCat(null); }}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-brand-800 hover:bg-brand-700">
                  <Plus className="h-4 w-4 me-1" />
                  {t("add_category")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCat ? t("edit") : t("add_category")}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <div>
                    <Label>{t("slug")}</Label>
                    <Input
                      name="slug"
                      defaultValue={editingCat?.slug || ""}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t("name_ar")}</Label>
                    <Input
                      name="name_ar"
                      defaultValue={editingCat?.name_ar || ""}
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <Label>{t("name_en")}</Label>
                    <Input
                      name="name_en"
                      defaultValue={editingCat?.name_en || ""}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t("icon")}</Label>
                    <Input
                      name="icon_name"
                      defaultValue={editingCat?.icon_name || "circle"}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t("sort_order")}</Label>
                    <Input
                      name="sort_order"
                      type="number"
                      defaultValue={editingCat?.sort_order || 0}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCatDialogOpen(false);
                        setEditingCat(null);
                      }}
                    >
                      {t("cancel")}
                    </Button>
                    <Button type="submit" className="bg-brand-800 hover:bg-brand-700">
                      {t("save")}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("slug")}</TableHead>
                <TableHead>{t("name_ar")}</TableHead>
                <TableHead>{t("name_en")}</TableHead>
                <TableHead>{t("icon")}</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-mono text-xs">{cat.slug}</TableCell>
                  <TableCell dir="rtl">{cat.name_ar}</TableCell>
                  <TableCell>{cat.name_en}</TableCell>
                  <TableCell className="text-xs">{cat.icon_name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingCat(cat);
                          setCatDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Intentions Tab */}
        <TabsContent value="intentions">
          <div className="mb-4 flex justify-end">
            <Dialog open={intDialogOpen} onOpenChange={(v) => { setIntDialogOpen(v); if (!v) setEditingInt(null); }}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-brand-800 hover:bg-brand-700">
                  <Plus className="h-4 w-4 me-1" />
                  {t("add_intention")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingInt ? t("edit") : t("add_intention")}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveIntention} className="space-y-4">
                  <div>
                    <Label>{t("category")}</Label>
                    <Select
                      name="category_id"
                      defaultValue={editingInt?.category_id || ""}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name_ar} / {cat.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("text_ar")}</Label>
                    <Textarea
                      name="text_ar"
                      defaultValue={editingInt?.text_ar || ""}
                      dir="rtl"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t("text_en")}</Label>
                    <Textarea
                      name="text_en"
                      defaultValue={editingInt?.text_en || ""}
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t("source_ar")}</Label>
                    <Input
                      name="source_ar"
                      defaultValue={editingInt?.source_ar || ""}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>{t("source_en")}</Label>
                    <Input
                      name="source_en"
                      defaultValue={editingInt?.source_en || ""}
                    />
                  </div>
                  <div>
                    <Label>{t("sort_order")}</Label>
                    <Input
                      name="sort_order"
                      type="number"
                      defaultValue={editingInt?.sort_order || 0}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      name="is_published"
                      defaultChecked={editingInt?.is_published ?? true}
                      value="true"
                    />
                    <Label>{t("published")}</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIntDialogOpen(false);
                        setEditingInt(null);
                      }}
                    >
                      {t("cancel")}
                    </Button>
                    <Button type="submit" className="bg-brand-800 hover:bg-brand-700">
                      {t("save")}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("text_ar")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("published")}</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intentions.map((int) => (
                <TableRow key={int.id}>
                  <TableCell dir="rtl" className="max-w-xs truncate">
                    {int.text_ar}
                  </TableCell>
                  <TableCell>{int.categories?.name_ar}</TableCell>
                  <TableCell>
                    {int.is_published ? "✓" : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingInt(int);
                          setIntDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteIntention(int.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
