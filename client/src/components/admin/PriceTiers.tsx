// src/components/PriceTiers.tsx

import React from 'react';
import { PriceTier } from '../../types/PriceTier';

interface PriceTiersProps {
  priceTiers: PriceTier[];
  onAddTier: () => void;
  onRemoveTier: (index: number) => void;
  onTierChange: (index: number, field: keyof PriceTier, value: any) => void;
}

const PriceTiers: React.FC<PriceTiersProps> = ({ priceTiers, onAddTier, onRemoveTier, onTierChange }) => {
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-lg mb-2">Price Tiers</h3>
      {priceTiers.map((tier, index) => (
        <div key={index} className="mb-2 border p-3 rounded bg-gray-100">
          <div className="mb-2">
            <label className="block text-sm font-medium">Tier Name</label>
            <input
              type="text"
              value={tier.tierName}
              onChange={(e) => onTierChange(index, 'tierName', e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={tier.price}
              onChange={(e) => onTierChange(index, 'price', e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Price Change Date</label>
            <input
              type="date"
              value={new Date(tier.priceChangeDate).toISOString().slice(0, 10)}
              onChange={(e) => onTierChange(index, 'priceChangeDate', e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            onClick={() => onRemoveTier(index)}
            className="text-red-600 text-sm mt-1"
          >
            Remove Tier
          </button>
        </div>
      ))}
      <button
        onClick={onAddTier}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Tier
      </button>
    </div>
  );
};

export default PriceTiers;
