// components/Filters.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Facets } from '../lib/types';

type Props = {
  initialFacets?: Facets | null;
  currentQuery: Record<string, string | string[]>;
  onChange: (params: Record<string, string | string[] | undefined>) => void;
};

export default function Filters({ initialFacets, currentQuery, onChange }: Props) {
  // local selection state (mirrors URL). We'll initialize from currentQuery.
  const [selectedColors, setSelectedColors] = useState<string[]>(
    Array.isArray(currentQuery.color) ? currentQuery.color.map(String) : currentQuery.color ? [String(currentQuery.color)] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    Array.isArray(currentQuery.size) ? currentQuery.size.map(String) : currentQuery.size ? [String(currentQuery.size)] : []
  );
  const [priceMin, setPriceMin] = useState<string>(String(currentQuery.priceMin ?? ''));
  const [priceMax, setPriceMax] = useState<string>(String(currentQuery.priceMax ?? ''));

  useEffect(() => {
    // when user toggles, push minimal params via onChange
    const handler = setTimeout(() => {
      const params: Record<string, string | string[] | undefined> = {
        ...currentQuery,
        color: selectedColors.length ? selectedColors : undefined,
        size: selectedSizes.length ? selectedSizes : undefined,
        priceMin: priceMin || undefined,
        priceMax: priceMax || undefined,
        page: undefined, // reset page when filters change
      };
      onChange(params);
    }, 250); // debounce user interactions
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColors, selectedSizes, priceMin, priceMax]);

  const toggle = (val: string, arr: string[], setArr: (s: string[]) => void) => {
    if (arr.includes(val)) setArr(arr.filter((x) => x !== val));
    else setArr([...arr, val]);
  };

  return (
    <div className="sticky top-20">
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-3">Filters</h4>

        {/* Colors */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Color</div>
          <div className="flex flex-wrap gap-2">
            {(initialFacets?.colors ?? ['Red', 'Blue', 'Green', 'Black']).map((c) => (
              <button
                key={c}
                onClick={() => toggle(c, selectedColors, setSelectedColors)}
                className={`px-2 py-1 border rounded text-sm ${selectedColors.includes(c) ? 'bg-black text-white' : ''}`}
                aria-pressed={selectedColors.includes(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Size</div>
          <div className="flex flex-wrap gap-2">
            {(initialFacets?.sizes ?? ['S', 'M', 'L', 'XL']).map((s) => (
              <button
                key={s}
                onClick={() => toggle(s, selectedSizes, setSelectedSizes)}
                className={`px-2 py-1 border rounded text-sm ${selectedSizes.includes(s) ? 'bg-black text-white' : ''}`}
                aria-pressed={selectedSizes.includes(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Price</div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-1/2 px-2 py-1 border rounded"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-1/2 px-2 py-1 border rounded"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              onChange({
                // reset all filter params
              })
            }
            className="px-3 py-2 border rounded text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
