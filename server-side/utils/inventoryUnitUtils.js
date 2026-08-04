const BASE_UNIT_MAP = {
  kg: 'gm',
  gm: 'gm',
  ltr: 'ml',
  liter: 'ml',
  litre: 'ml',
  l: 'ml',
  ml: 'ml',
  pcs: 'pcs',
  piece: 'pcs',
  pieces: 'pcs',
};

const DISPLAY_UNIT_MAP = {
  gm: 'kg',
  ml: 'ltr',
};

const roundTo = (value, places = 2) => Number(value.toFixed(places));

export const convertToBaseUnit = (quantity, unit) => {
  const normalizedUnit = String(unit || '').trim().toLowerCase();
  const numericQuantity = Number(quantity || 0);

  if (normalizedUnit === 'kg') return roundTo(numericQuantity * 1000);
  if (normalizedUnit === 'grm') return roundTo(numericQuantity);
  if (['ltr', 'liter', 'litre', 'l'].includes(normalizedUnit)) return roundTo(numericQuantity * 1000);
  if (['gm', 'ml', 'pcs', 'piece', 'pieces'].includes(normalizedUnit)) return roundTo(numericQuantity);

  return roundTo(numericQuantity);
};

export const convertFromBaseUnit = (quantity, baseUnit, displayUnit) => {
  const numericQuantity = Number(quantity || 0);
  const normalizedBaseUnit = String(baseUnit || '').trim().toLowerCase();
  const normalizedDisplayUnit = String(displayUnit || '').trim().toLowerCase();

  if (normalizedBaseUnit === 'gm' && normalizedDisplayUnit === 'kg') return roundTo(numericQuantity / 1000);
  if (normalizedBaseUnit === 'ml' && normalizedDisplayUnit === 'ltr') return roundTo(numericQuantity / 1000);

  return roundTo(numericQuantity);
};

export const calculateRecipeConsumption = (ingredients = [], multiplier = 1) => {
  return (ingredients || []).map((ingredient) => {
    const quantity = Number(ingredient.quantity || 0) * Number(multiplier || 1);
    const normalizedUnit = String(ingredient.unit || '').trim().toLowerCase();
    const baseUnit = BASE_UNIT_MAP[normalizedUnit] || normalizedUnit || 'pcs';

    return {
      name: ingredient.name,
      baseQuantity: convertToBaseUnit(quantity, normalizedUnit),
      unit: baseUnit,
    };
  });
};

export const validateStockAvailability = (stockItem = {}, requiredQuantity = 0) => {
  const currentStock = Number(stockItem?.currentStock || 0);
  const neededQuantity = Number(requiredQuantity || 0);

  if (neededQuantity > currentStock) {
    return {
      isAvailable: false,
      reason: 'Insufficient stock',
      currentStock,
      requiredQuantity: neededQuantity,
    };
  }

  return {
    isAvailable: true,
    reason: 'Stock available',
    currentStock,
    requiredQuantity: neededQuantity,
  };
};
