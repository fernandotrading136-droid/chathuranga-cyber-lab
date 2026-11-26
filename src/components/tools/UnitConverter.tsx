import { useState, useMemo } from 'react';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';

type UnitCategory = 'data' | 'speed' | 'length' | 'weight' | 'temperature';

interface UnitOption {
  id: string;
  label: string;
  factorToBase?: number;
}

const CATEGORY_CONFIG: Record<
  UnitCategory,
  { label: string; units: UnitOption[] }
> = {
  data: {
    label: 'Data',
    units: [
      { id: 'bit', label: 'Bits (b)', factorToBase: 0.125 },
      { id: 'byte', label: 'Bytes (B)', factorToBase: 1 },
      { id: 'kb', label: 'Kilobytes (KB)', factorToBase: 1024 },
      { id: 'mb', label: 'Megabytes (MB)', factorToBase: 1024 ** 2 },
      { id: 'gb', label: 'Gigabytes (GB)', factorToBase: 1024 ** 3 },
      { id: 'tb', label: 'Terabytes (TB)', factorToBase: 1024 ** 4 },
    ],
  },
  speed: {
    label: 'Speed',
    units: [
      { id: 'mbps', label: 'Mbps (Megabits/s)', factorToBase: 1 },
      { id: 'mbs', label: 'MB/s (Megabytes/s)', factorToBase: 8 },
      { id: 'gbps', label: 'Gbps (Gigabits/s)', factorToBase: 1000 },
      { id: 'kmh', label: 'km/h', factorToBase: 1 },
      { id: 'mph', label: 'mph', factorToBase: 1.609344 },
    ],
  },
  length: {
    label: 'Length',
    units: [
      { id: 'mm', label: 'Millimeters (mm)', factorToBase: 0.001 },
      { id: 'cm', label: 'Centimeters (cm)', factorToBase: 0.01 },
      { id: 'm', label: 'Meters (m)', factorToBase: 1 },
      { id: 'km', label: 'Kilometers (km)', factorToBase: 1000 },
      { id: 'inch', label: 'Inches (in)', factorToBase: 0.0254 },
      { id: 'ft', label: 'Feet (ft)', factorToBase: 0.3048 },
      { id: 'mile', label: 'Miles (mi)', factorToBase: 1609.344 },
    ],
  },
  weight: {
    label: 'Weight',
    units: [
      { id: 'mg', label: 'Milligrams (mg)', factorToBase: 0.001 },
      { id: 'g', label: 'Grams (g)', factorToBase: 1 },
      { id: 'kg', label: 'Kilograms (kg)', factorToBase: 1000 },
      { id: 'oz', label: 'Ounces (oz)', factorToBase: 28.349523 },
      { id: 'lb', label: 'Pounds (lb)', factorToBase: 453.59237 },
    ],
  },
  temperature: {
    label: 'Temp',
    units: [
      { id: 'c', label: 'Celsius (°C)' },
      { id: 'f', label: 'Fahrenheit (°F)' },
      { id: 'k', label: 'Kelvin (K)' },
    ],
  },
};

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;
  let celsius = value;
  if (from === 'f') celsius = ((value - 32) * 5) / 9;
  if (from === 'k') celsius = value - 273.15;

  if (to === 'c') return celsius;
  if (to === 'f') return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('data');
  const [rawValue, setRawValue] = useState('1024');
  const [fromUnit, setFromUnit] = useState('mb');
  const [toUnit, setToUnit] = useState('gb');
  const [copied, setCopied] = useState(false);

  const units = CATEGORY_CONFIG[category].units;

  const handleCategoryChange = (nextCat: UnitCategory) => {
    setCategory(nextCat);
    const nextUnits = CATEGORY_CONFIG[nextCat].units;
    setFromUnit(nextUnits[0].id);
    setToUnit(nextUnits[1]?.id ?? nextUnits[0].id);
    setRawValue(nextCat === 'temperature' ? '25' : '1');
  };

  const convertedValue = useMemo(() => {
    const num = Number(rawValue);
    if (rawValue.trim() === '' || Number.isNaN(num)) return null;

    if (category === 'temperature') {
      return convertTemperature(num, fromUnit, toUnit);
    }

    // Prevent mixing network speed and travel speed awkwardly if needed, or use separate groups:
    if (category === 'speed') {
      const netIds = new Set(['mbps', 'mbs', 'gbps']);
      const fromIsNet = netIds.has(fromUnit);
      const toIsNet = netIds.has(toUnit);
      if (fromIsNet !== toIsNet) return null;
    }

    const fromObj = units.find((u) => u.id === fromUnit);
    const toObj = units.find((u) => u.id === toUnit);
    if (!fromObj?.factorToBase || !toObj?.factorToBase) return null;

    const baseVal = num * fromObj.factorToBase;
    return baseVal / toObj.factorToBase;
  }, [rawValue, category, fromUnit, toUnit, units]);

  const formattedOutput = useMemo(() => {
    if (convertedValue === null) return '—';
    if (Math.abs(convertedValue) >= 1e9 || (Math.abs(convertedValue) > 0 && Math.abs(convertedValue) < 1e-6)) {
      return convertedValue.toExponential(4);
    }
    return Number(convertedValue.toFixed(6)).toString();
  }, [convertedValue]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = async () => {
    if (formattedOutput === '—') return;
    try {
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Ignore clipboard failures
    }
  };

  const availableToUnits =
    category === 'speed'
      ? units.filter((u) => {
          const netIds = new Set(['mbps', 'mbs', 'gbps']);
          return netIds.has(u.id) === netIds.has(fromUnit);
        })
      : units;

  const handleFromUnitChange = (nextFrom: string) => {
    setFromUnit(nextFrom);
    if (category === 'speed') {
      const netIds = new Set(['mbps', 'mbs', 'gbps']);
      if (netIds.has(nextFrom) !== netIds.has(toUnit)) {
        const compatible = units.find(
          (u) => netIds.has(u.id) === netIds.has(nextFrom) && u.id !== nextFrom
        );
        if (compatible) setToUnit(compatible.id);
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-[#143622] bg-[#07100b] p-4 sm:p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <ArrowLeftRight className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
        <h2 className="font-display text-lg font-bold text-[#e6f7ed]">
          Unit Converter
        </h2>
      </div>

      {/* Category Switcher */}
      <div
        role="group"
        aria-label="Unit categories"
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        {(Object.keys(CATEGORY_CONFIG) as UnitCategory[]).map((catKey) => {
          const active = category === catKey;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => handleCategoryChange(catKey)}
              className={`min-h-[42px] rounded-xl border px-3.5 py-2 font-mono-tech text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                active
                  ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#00ff66]'
                  : 'border-[#122b1c] bg-[#040906] text-[#8ab89c] hover:text-[#e6f7ed]'
              }`}
            >
              {CATEGORY_CONFIG[catKey].label}
            </button>
          );
        })}
      </div>

      {/* Input & Unit Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end">
        <div className="md:col-span-5 space-y-2">
          <label
            htmlFor="unit-input-val"
            className="block text-xs font-medium text-[#98c7ab]"
          >
            From Value
          </label>
          <input
            id="unit-input-val"
            type="number"
            inputMode="decimal"
            value={rawValue}
            onChange={(e) => setRawValue(e.target.value)}
            className="min-h-[48px] w-full rounded-xl border border-[#163823] bg-[#040906] px-3.5 py-2.5 font-mono-tech text-base font-semibold text-[#e6f7ed] tabular-nums focus:border-[#00ff66] focus:outline-none"
          />
          <select
            aria-label="Source unit"
            value={fromUnit}
            onChange={(e) => handleFromUnitChange(e.target.value)}
            className="min-h-[46px] w-full rounded-xl border border-[#163823] bg-[#040906] px-3 py-2 text-sm text-[#e6f7ed] focus:border-[#00ff66] focus:outline-none"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap units"
            className="min-h-[46px] min-w-[46px] flex items-center justify-center rounded-xl border border-[#19422a] bg-[#040906] text-[#00ff66] hover:bg-[#00ff66]/15 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        <div className="md:col-span-5 space-y-2">
          <span className="block text-xs font-medium text-[#98c7ab]">
            Converted Result
          </span>
          <div className="min-h-[48px] flex items-center justify-between rounded-xl border border-[#00ff66]/35 bg-[#030704] px-3.5 py-2.5">
            <span className="font-mono-tech text-base font-bold text-[#00ff66] tabular-nums truncate">
              {formattedOutput}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy converted result"
              className="ml-2 inline-flex items-center justify-center rounded-lg p-1.5 text-[#8ab89c] hover:text-[#00ff66] cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-[#00ff66]" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <select
            aria-label="Target unit"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="min-h-[46px] w-full rounded-xl border border-[#163823] bg-[#040906] px-3 py-2 text-sm text-[#e6f7ed] focus:border-[#00ff66] focus:outline-none"
          >
            {availableToUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
