import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertToBaseUnit,
  convertFromBaseUnit,
  calculateRecipeConsumption,
  validateStockAvailability,
} from '../utils/inventoryUnitUtils.js';

test('converts purchased weight and liquid values to base units', () => {
  assert.equal(convertToBaseUnit(20.25, 'kg'), 20250);
  assert.equal(convertToBaseUnit(15.25, 'ltr'), 15250);
  assert.equal(convertToBaseUnit(100, 'pcs'), 100);
});

test('converts base values back to display units without mutating stored values', () => {
  assert.equal(convertFromBaseUnit(20250, 'gm', 'kg'), 20.25);
  assert.equal(convertFromBaseUnit(15250, 'ml', 'ltr'), 15.25);
  assert.equal(convertFromBaseUnit(100, 'pcs', 'pcs'), 100);
});

test('calculates recipe consumption using base units', () => {
  const consumption = calculateRecipeConsumption([
    { name: 'Chicken', quantity: 250, unit: 'gm' },
    { name: 'Milk', quantity: 150, unit: 'ml' },
    { name: 'Egg', quantity: 2, unit: 'pcs' },
  ], 1);

  assert.deepEqual(consumption, [
    { name: 'Chicken', baseQuantity: 250, unit: 'gm' },
    { name: 'Milk', baseQuantity: 150, unit: 'ml' },
    { name: 'Egg', baseQuantity: 2, unit: 'pcs' },
  ]);
});

test('rejects stock that would go negative', () => {
  const result = validateStockAvailability({ currentStock: 100 }, 150);

  assert.equal(result.isAvailable, false);
  assert.equal(result.reason, 'Insufficient stock');
});
