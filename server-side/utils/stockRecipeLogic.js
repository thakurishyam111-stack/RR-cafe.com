export const evaluateRecipeStockAvailability = (recipeIngredients = [], stockItems = [], orderQuantity = 1) => {
  const requiredQuantities = [];
  const missingIngredients = [];

  for (const ingredient of recipeIngredients) {
    const requiredQty = Number(ingredient.quantity || 0) * Number(orderQuantity || 1);
    const matchingStock = stockItems.find((stockItem) => {
      const normalizedIngredientName = String(ingredient.name || '').trim().toLowerCase();
      const normalizedStockName = String(stockItem?.name || '').trim().toLowerCase();
      return normalizedIngredientName === normalizedStockName;
    });

    const availableQty = Number(matchingStock?.currentStock || 0);
    requiredQuantities.push({
      name: ingredient.name,
      unit: ingredient.unit || matchingStock?.unit || '',
      requiredQuantity: requiredQty,
      availableQuantity: availableQty,
    });

    if (!matchingStock || availableQty < requiredQty) {
      missingIngredients.push({
        name: ingredient.name,
        needed: requiredQty,
        available: availableQty,
        unit: ingredient.unit || matchingStock?.unit || '',
      });
    }
  }

  return {
    canFulfill: missingIngredients.length === 0,
    requiredQuantities,
    missingIngredients,
  };
};
