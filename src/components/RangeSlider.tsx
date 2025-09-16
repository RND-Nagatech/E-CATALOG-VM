import React from 'react';

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  unit?: string;
  step?: number;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  min,
  max,
  value,
  onChange,
  unit = '',
  step = 1
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1]);
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0]);
    onChange([value[0], newMax]);
  };

  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="relative">
        {/* ...existing code... */}
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div 
            className="absolute h-2 bg-blue-600 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          />
          
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            onChange={handleMinChange}
            step={step}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          />
          
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            onChange={handleMaxChange}
            step={step}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-gray-700">
            {unit === 'Rp' ? 'Rp' : ''}{value[0]}{unit !== 'Rp' ? unit : ''}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {unit === 'Rp' ? 'Rp' : ''}{value[1]}{unit !== 'Rp' ? unit : ''}
          </span>
        </div>
      </div>
    </div>
  );
};