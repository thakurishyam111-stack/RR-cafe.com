import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRecipeConsumption } from '../utils/inventoryUnitUtils.js';

test('recipe consumption uses base units only', () => {
  const consumption = calculateRecipeConsumption([
    { name: 'Chicken', quantity: 0.25, unit: 'kg' },
    { name: 'Milk', quantity: 0.15, unit: 'ltr' },
    { name: 'Egg', quantity: 2, unit: 'pcs' },
  ], 1);

  assert.deepEqual(consumption, [
    { name: 'Chicken', baseQuantity: 250, unit: 'gm' },
    { name: 'Milk', baseQuantity: 150, unit: 'ml' },
    { name: 'Egg', baseQuantity: 2, unit: 'pcs' },
  ]);
});
