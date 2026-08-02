import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRecipeStockAvailability } from '../utils/stockRecipeLogic.js';

test('allows approval when recipe ingredients are available in stock', () => {
  const recipeIngredients = [
    { name: 'Sugar', quantity: '2', unit: 'grm' },
    { name: 'Water', quantity: '100', unit: 'ml' },
  ];

  const stockItems = [
    { name: 'Sugar', currentStock: 10, unit: 'grm' },
    { name: 'Water', currentStock: 250, unit: 'ml' },
  ];

  const result = evaluateRecipeStockAvailability(recipeIngredients, stockItems, 1);

  assert.equal(result.canFulfill, true);
  assert.deepEqual(result.missingIngredients, []);
  assert.equal(result.requiredQuantities[0].requiredQuantity, 2);
});

test('rejects approval when an ingredient is below the needed quantity', () => {
  const recipeIngredients = [
    { name: 'Sugar', quantity: '2', unit: 'grm' },
  ];

  const stockItems = [
    { name: 'Sugar', currentStock: 1, unit: 'grm' },
  ];

  const result = evaluateRecipeStockAvailability(recipeIngredients, stockItems, 1);

  assert.equal(result.canFulfill, false);
  assert.deepEqual(result.missingIngredients, [
    { name: 'Sugar', needed: 2, available: 1, unit: 'grm' },
  ]);
});
