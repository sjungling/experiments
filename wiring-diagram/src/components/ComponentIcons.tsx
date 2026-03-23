import type { ComponentType } from '../types';

interface IconProps {
  size?: number;
  on?: boolean;
  energized?: boolean;
  travelerState?: 0 | 1;
}

export function OutletIcon({ size = 40, energized }: IconProps) {
  const s = size;
  return (
    <g>
      <rect
        x={-s / 2}
        y={-s / 2}
        width={s}
        height={s}
        rx={4}
        fill={energized ? '#fff7ed' : '#f5f5f4'}
        stroke={energized ? '#f97316' : '#78716c'}
        strokeWidth={2}
      />
      {/* Two vertical slots */}
      <rect x={-8} y={-10} width={3} height={10} rx={1} fill="#78716c" />
      <rect x={5} y={-10} width={3} height={10} rx={1} fill="#78716c" />
      {/* Ground hole */}
      <circle cx={0} cy={8} r={3} fill="none" stroke="#78716c" strokeWidth={1.5} />
    </g>
  );
}

export function SwitchIcon({ size = 40, on }: IconProps) {
  const s = size;
  return (
    <g>
      <rect
        x={-s / 2}
        y={-s / 2}
        width={s}
        height={s}
        rx={4}
        fill={on ? '#ecfdf5' : '#f5f5f4'}
        stroke={on ? '#10b981' : '#78716c'}
        strokeWidth={2}
      />
      {/* Toggle */}
      <rect
        x={-5}
        y={on ? -14 : 2}
        width={10}
        height={12}
        rx={2}
        fill={on ? '#10b981' : '#a8a29e'}
      />
      <text x={0} y={on ? 16 : -8} textAnchor="middle" fontSize={7} fill="#78716c">
        {on ? 'ON' : 'OFF'}
      </text>
    </g>
  );
}

export function ThreeWaySwitchIcon({ size = 40, on, travelerState }: IconProps) {
  const s = size;
  return (
    <g>
      <rect
        x={-s / 2}
        y={-s / 2}
        width={s}
        height={s}
        rx={4}
        fill={on ? '#eff6ff' : '#f5f5f4'}
        stroke={on ? '#3b82f6' : '#78716c'}
        strokeWidth={2}
      />
      {/* 3-way toggle indicator */}
      <rect
        x={-5}
        y={travelerState === 0 ? -14 : 2}
        width={10}
        height={12}
        rx={2}
        fill={travelerState === 0 ? '#3b82f6' : '#6366f1'}
      />
      <text x={0} y={16} textAnchor="middle" fontSize={6} fill="#78716c">
        3-WAY
      </text>
      {/* Traveler indicators */}
      <circle cx={-12} cy={0} r={3} fill={travelerState === 0 ? '#3b82f6' : '#d1d5db'} />
      <circle cx={12} cy={0} r={3} fill={travelerState === 1 ? '#6366f1' : '#d1d5db'} />
    </g>
  );
}

export function LightIcon({ size = 40, energized }: IconProps) {
  const s = size;
  return (
    <g>
      {energized && (
        <circle cx={0} cy={-2} r={s / 2 + 4} fill="#fef08a" opacity={0.4} />
      )}
      <circle
        cx={0}
        cy={-2}
        r={s / 2 - 4}
        fill={energized ? '#fef08a' : '#f5f5f4'}
        stroke={energized ? '#eab308' : '#78716c'}
        strokeWidth={2}
      />
      {/* Filament lines */}
      <path
        d="M-4,-6 Q0,-12 4,-6 M-4,2 Q0,-4 4,2"
        fill="none"
        stroke={energized ? '#ca8a04' : '#a8a29e'}
        strokeWidth={1.5}
      />
      {/* Base */}
      <rect x={-6} y={s / 2 - 12} width={12} height={6} rx={1} fill="#a8a29e" />
    </g>
  );
}

export function JunctionBoxIcon({ size = 40 }: IconProps) {
  const s = size;
  return (
    <g>
      <rect
        x={-s / 2}
        y={-s / 2}
        width={s}
        height={s}
        rx={2}
        fill="#e7e5e4"
        stroke="#78716c"
        strokeWidth={2}
        strokeDasharray="4 2"
      />
      <text x={0} y={4} textAnchor="middle" fontSize={8} fill="#78716c" fontWeight="bold">
        JB
      </text>
    </g>
  );
}

export function PanelIcon({ size = 40 }: IconProps) {
  const s = size;
  return (
    <g>
      <rect
        x={-s / 2}
        y={-s / 2}
        width={s}
        height={s}
        rx={3}
        fill="#dbeafe"
        stroke="#2563eb"
        strokeWidth={2.5}
      />
      {/* Breaker rows */}
      <rect x={-12} y={-12} width={8} height={4} rx={1} fill="#2563eb" />
      <rect x={4} y={-12} width={8} height={4} rx={1} fill="#2563eb" />
      <rect x={-12} y={-4} width={8} height={4} rx={1} fill="#2563eb" />
      <rect x={4} y={-4} width={8} height={4} rx={1} fill="#2563eb" />
      <rect x={-12} y={4} width={8} height={4} rx={1} fill="#2563eb" />
      <rect x={4} y={4} width={8} height={4} rx={1} fill="#2563eb" />
      <text x={0} y={17} textAnchor="middle" fontSize={5} fill="#2563eb" fontWeight="bold">
        PANEL
      </text>
    </g>
  );
}

export function getComponentIcon(type: ComponentType): React.FC<IconProps> {
  switch (type) {
    case 'outlet':
      return OutletIcon;
    case 'switch':
      return SwitchIcon;
    case 'three-way-switch':
      return ThreeWaySwitchIcon;
    case 'light':
      return LightIcon;
    case 'junction-box':
      return JunctionBoxIcon;
    case 'panel':
      return PanelIcon;
  }
}

/** Toolbar-sized icon previews */
export function ComponentPreview({
  type,
  size = 24,
}: {
  type: ComponentType;
  size?: number;
}) {
  const Icon = getComponentIcon(type);
  return (
    <svg width={size + 8} height={size + 8} viewBox={`${-size / 2 - 4} ${-size / 2 - 4} ${size + 8} ${size + 8}`}>
      <Icon size={size} />
    </svg>
  );
}
