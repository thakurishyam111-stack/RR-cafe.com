"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { Clock3, Plus, Save, Search, Trash2, UtensilsCrossed, Users, Sparkles, PencilLine } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type MenuItem = {
  _id: string;
  title: string;
  price?: number;
  category?: string;
  description?: string;
};

type IngredientRow = {
  name: string;
  quantity: string;
  unit: string;
};

type RecipeFormData = {
  menuId: string;
  menuTitle: string;
  ingredients: IngredientRow[];
  preparationTime: string;
  servingSize: string;
  instructions: string;
};

type StoredRecipes = Record<string, RecipeFormData>;

const API_BASE_URL = "http://localhost:8080/api/recipes";

const createEmptyIngredient = (): IngredientRow => ({
  name: "",
  quantity: "",
  unit: "",
});

const createBlankRecipe = (menuId = "", menuTitle = "") => ({
  menuId,
  menuTitle,
  ingredients: [createEmptyIngredient()],
  preparationTime: "20",
  servingSize: "1",
  instructions: "",
});

export default function RecipePage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [recipes, setRecipes] = useState<StoredRecipes>({});
  const [formData, setFormData] = useState<RecipeFormData>(createBlankRecipe());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/menus");
        const data = await response.json();
        if (response.ok && data?.success) {
          const fetchedMenus = Array.isArray(data.menus) ? data.menus : [];
          setMenus(fetchedMenus);
          if (!selectedMenuId && fetchedMenus[0]?._id) {
            setSelectedMenuId(fetchedMenus[0]._id);
          }
        }
      } catch {
        setMessage({ type: "error", text: "Unable to load menus from the server." });
      }
    };

    const loadRecipes = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (response.ok && data?.success) {
          const fetchedRecipes = Array.isArray(data.recipes) ? data.recipes : [];
          const recipeMap: StoredRecipes = {};

          fetchedRecipes.forEach((recipe: any) => {
            if (recipe?.menuId) {
              recipeMap[recipe.menuId] = {
                menuId: recipe.menuId,
                menuTitle: recipe.menuTitle || "",
                ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
                preparationTime: recipe.preparationTime || "20",
                servingSize: recipe.servingSize || "1",
                instructions: recipe.instructions || "",
              };
            }
          });

          setRecipes(recipeMap);
        }
      } catch {
        setRecipes({});
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
    loadRecipes();
  }, [selectedMenuId]);

  useEffect(() => {
    if (!selectedMenuId) return;

    const currentMenu = menus.find((menu) => menu._id === selectedMenuId);
    const savedRecipe = recipes[selectedMenuId];

    if (savedRecipe) {
      setFormData({
        ...savedRecipe,
        menuId: selectedMenuId,
        menuTitle: currentMenu?.title || savedRecipe.menuTitle || "",
      });
    } else {
      setFormData(createBlankRecipe(selectedMenuId, currentMenu?.title || ""));
    }
  }, [selectedMenuId, menus, recipes]);

  const currentMenu = useMemo(() => menus.find((menu) => menu._id === selectedMenuId), [menus, selectedMenuId]);
  const recipesList = useMemo(() => Object.values(recipes), [recipes]);
  const filteredRecipes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return recipesList;

    return recipesList.filter((recipe) => {
      const titleMatch = recipe.menuTitle?.toLowerCase().includes(term);
      const ingredientMatch = recipe.ingredients?.some((ingredient) => ingredient.name?.toLowerCase().includes(term));
      return titleMatch || ingredientMatch;
    });
  }, [recipesList, searchTerm]);

  const selectedRecipe = recipes[selectedMenuId];

  const persistRecipes = (nextRecipes: StoredRecipes) => {
    setRecipes(nextRecipes);
  };

  const openComposer = (menuId = selectedMenuId) => {
    if (!menuId && menus[0]?._id) {
      setSelectedMenuId(menus[0]._id);
      return;
    }

    setSelectedMenuId(menuId);
    setIsComposerOpen(true);
    setMessage(null);
  };

  const handleSelectMenu = (menuId: string) => {
    setSelectedMenuId(menuId);
    setMessage(null);
  };

  const handleInputChange = (field: keyof RecipeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index: number, field: keyof IngredientRow, value: string) => {
    setFormData((prev) => {
      const updatedIngredients = [...prev.ingredients];
      updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const addIngredient = () => {
    setFormData((prev) => ({ ...prev, ingredients: [...prev.ingredients, createEmptyIngredient()] }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSaveRecipe = async () => {
    if (!selectedMenuId) {
      setMessage({ type: "error", text: "Please choose a menu first." });
      return;
    }

    const cleanedIngredients = formData.ingredients.filter(
      (ingredient) => ingredient.name.trim() || ingredient.quantity.trim() || ingredient.unit.trim()
    );

    if (!cleanedIngredients.some((ingredient) => ingredient.name.trim())) {
      setMessage({ type: "error", text: "Add at least one ingredient before saving." });
      return;
    }

    const payload = {
      menuId: selectedMenuId,
      menuTitle: currentMenu?.title || formData.menuTitle,
      ingredients: cleanedIngredients,
      preparationTime: formData.preparationTime.trim() || "20",
      servingSize: formData.servingSize.trim() || "1",
      instructions: formData.instructions.trim(),
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to save recipe.");
      }

      const nextRecipes = { ...recipes, [selectedMenuId]: { ...payload, menuId: selectedMenuId } };
      persistRecipes(nextRecipes);
      setIsComposerOpen(false);
      setMessage({ type: "success", text: `Recipe saved for ${payload.menuTitle}.` });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Unable to save recipe." });
    }
  };

  const handleDeleteRecipe = async () => {
    if (!selectedMenuId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedMenuId}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to delete recipe.");
      }

      const nextRecipes = { ...recipes };
      delete nextRecipes[selectedMenuId];
      persistRecipes(nextRecipes);
      setFormData(createBlankRecipe(selectedMenuId, currentMenu?.title || ""));
      setMessage({ type: "success", text: "Recipe deleted successfully." });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Unable to delete recipe." });
    }
  };

  const handleCardClick = (recipe: RecipeFormData) => {
    setSelectedMenuId(recipe.menuId);
    setIsComposerOpen(true);
    setFormData({ ...recipe, menuId: recipe.menuId, menuTitle: recipe.menuTitle });
  };

  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 p-3 text-slate-800 sm:p-4 md:ml-72 md:p-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.45)]">
          <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 via-white to-slate-50 px-4 py-5 sm:px-6 md:px-8 md:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                  <UtensilsCrossed className="h-4 w-4" />
                  Recipe Manager
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Build and manage recipe cards</h1>
                <p className="mt-1 text-sm text-slate-500">Create recipes from the menu list, organize ingredients neatly, and keep your kitchen operations simple.</p>
              </div>
              {message && (
                <div className={`rounded-2xl px-4 py-2 text-sm font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                  {message.text}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 p-4 sm:p-5 md:p-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-8">
            <aside className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 shadow-sm lg:sticky lg:top-6 lg:self-start">
              <button
                onClick={() => openComposer()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition hover:bg-amber-700"
              >
                <Plus className="h-4 w-4" />
                Add Recipe
              </button>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  Menu Selector
                </div>
                <select
                  value={selectedMenuId}
                  onChange={(event) => handleSelectMenu(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500"
                  disabled={loading}
                >
                  {menus.length === 0 && <option value="">No menus available</option>}
                  {menus.map((menu) => (
                    <option key={menu._id} value={menu._id}>
                      {menu.title}
                    </option>
                  ))}
                </select>
                <p className="mt-3 text-sm text-slate-500">Choose the menu item you want to attach this recipe to.</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">Current Selection</p>
                <p className="mt-2 text-base font-bold text-slate-900">{currentMenu?.title || "Choose a menu"}</p>
                <p className="mt-1 text-sm text-slate-500">{currentMenu?.description || "Recipe details will be stored for this menu item."}</p>
              </div>
            </aside>

            <section className="space-y-5">
              <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-gradient-to-r from-white to-slate-50 px-4 py-3 shadow-sm">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search recipes by title or ingredient"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              {isComposerOpen && (
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-amber-700">Recipe Builder</p>
                      <h2 className="text-xl font-semibold text-slate-900">{selectedRecipe ? "Edit recipe" : "Add a new recipe"}</h2>
                    </div>
                    <button
                      onClick={() => setIsComposerOpen(false)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Menu</label>
                        <select
                          value={selectedMenuId}
                          onChange={(event) => handleSelectMenu(event.target.value)}
                          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500"
                        >
                          {menus.map((menu) => (
                            <option key={menu._id} value={menu._id}>
                              {menu.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">Ingredients</h3>
                            <p className="text-sm text-slate-500">Write ingredients smoothly and clearly.</p>
                          </div>
                          <button
                            onClick={addIngredient}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                          >
                            <Plus className="h-4 w-4" />
                            Add
                          </button>
                        </div>

                        <div className="space-y-3">
                          {formData.ingredients.map((ingredient, index) => (
                            <div key={`${ingredient.name}-${index}`} className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1.35fr_0.7fr_0.7fr_auto]">
                              <input
                                value={ingredient.name}
                                onChange={(event) => handleIngredientChange(index, "name", event.target.value)}
                                placeholder="Ingredient name"
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
                              />
                              <input
                                value={ingredient.quantity}
                                onChange={(event) => handleIngredientChange(index, "quantity", event.target.value)}
                                placeholder="Qty"
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
                              />
                              <input
                                value={ingredient.unit}
                                onChange={(event) => handleIngredientChange(index, "unit", event.target.value)}
                                placeholder="Unit"
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
                              />
                              <button
                                onClick={() => removeIngredient(index)}
                                className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                                title="Remove ingredient"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="rounded-2xl border border-slate-200 bg-white p-3">
                          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Clock3 className="h-4 w-4 text-amber-600" />
                            Preparation Time
                          </div>
                          <input
                            value={formData.preparationTime}
                            onChange={(event) => handleInputChange("preparationTime", event.target.value)}
                            placeholder="20"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                          />
                        </label>

                        <label className="rounded-2xl border border-slate-200 bg-white p-3">
                          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Users className="h-4 w-4 text-amber-600" />
                            Serving Size
                          </div>
                          <input
                            value={formData.servingSize}
                            onChange={(event) => handleInputChange("servingSize", event.target.value)}
                            placeholder="1"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                          />
                        </label>
                      </div>

                      <label className="block rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="mb-2 text-sm font-semibold text-slate-700">Instructions</div>
                        <textarea
                          value={formData.instructions}
                          onChange={(event) => handleInputChange("instructions", event.target.value)}
                          rows={6}
                          placeholder="Describe the cooking steps here..."
                          className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-amber-500"
                        />
                      </label>

                      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                        <button
                          onClick={handleDeleteRecipe}
                          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Delete
                        </button>
                        <button
                          onClick={handleSaveRecipe}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                        >
                          <Save className="h-4 w-4" />
                          Save Recipe
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((recipe) => (
                    <button
                      key={recipe.menuId}
                      onClick={() => handleCardClick(recipe)}
                      className="group rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          <PencilLine className="h-3.5 w-3.5" />
                          Recipe
                        </div>
                        <span className="text-xs text-slate-400">{recipe.ingredients?.length || 0} items</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-slate-900">{recipe.menuTitle}</h3>
                      <p className="mt-2 text-sm text-slate-500">Prep {recipe.preparationTime || "20"} mins • Serves {recipe.servingSize || "1"}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(recipe.ingredients || []).slice(0, 3).map((ingredient, index) => (
                          <span key={`${recipe.menuId}-${ingredient.name}-${index}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                            {ingredient.name}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="md:col-span-2 xl:col-span-3 rounded-[24px] border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    No recipes match your search. Try another keyword or create a new recipe.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}