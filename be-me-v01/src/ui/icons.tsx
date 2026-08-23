/**
 * Line icons drawn on a 24x24 grid to match the reference UI's thin gold
 * iconography. No icon dependency and no emoji used as production icons.
 */
interface IconProps {
  className?: string;
}

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function Svg({ className = '', children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-[1.05em] w-[1.05em] ${className}`} {...S}>
      {children}
    </svg>
  );
}

export const SkinIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3c3.6 0 6.2 2.7 6.2 6.4 0 4.3-2.9 7.3-6.2 11.6C8.7 16.7 5.8 13.7 5.8 9.4 5.8 5.7 8.4 3 12 3Z" />
    <path d="M9.4 9.6a2.6 2.6 0 0 1 5.2 0" />
  </Svg>
);

export const HairIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 14c-.6-6 3-10 7-10s7.6 4 7 10" />
    <path d="M5 14c1.4-2.6 3.8-4 7-4s5.6 1.4 7 4" />
    <path d="M6.2 14v4.4M17.8 14v4.4" />
  </Svg>
);

export const EyesIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M2.6 12S6 6.8 12 6.8 21.4 12 21.4 12 18 17.2 12 17.2 2.6 12 2.6 12Z" />
    <circle cx={12} cy={12} r={2.9} />
  </Svg>
);

export const EyebrowsIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3.2 11.4C5 8.6 8.2 7.6 10.6 9.2" />
    <path d="M13.4 9.2c2.4-1.6 5.6-.6 7.4 2.2" />
    <path d="M4.6 15.6h5M14.4 15.6h5" opacity={0.45} />
  </Svg>
);

export const TopIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M8.6 3.4 5 5.2 3.4 9.4l2.8 1.2V20h11.6v-9.4l2.8-1.2L19 5.2l-3.6-1.8" />
    <path d="M8.6 3.4a3.4 3.4 0 0 0 6.8 0" />
  </Svg>
);

export const BottomIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M6.4 3.4h11.2l1 17.2h-5L12 10.6 10.4 20.6h-5Z" />
    <path d="M6.7 8.2h10.6" opacity={0.5} />
  </Svg>
);

export const ShoesIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3 16.4V8.8h3.6l2.2 2.6c2.6.8 5.4 1.6 8.2 2.2 2.2.5 3.4 1.2 4 2.8v1.6H3Z" />
    <path d="M3 17.6h18" />
    <path d="M8.6 11.6 7 13.4M11.6 12.6 10 14.4" opacity={0.5} />
  </Svg>
);

export const AccessoriesIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="m12 3 2.5 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.4 6.8 19.2l1.1-5.9L3.6 9.2l5.9-.8Z" />
  </Svg>
);

export const ResetIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M20.4 12a8.4 8.4 0 1 1-2.6-6.1" />
    <path d="M20.4 3.2v5.2h-5.2" />
  </Svg>
);

export const DiceIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x={3.4} y={3.4} width={17.2} height={17.2} rx={3} />
    <circle cx={8.4} cy={8.4} r={1.15} fill="currentColor" stroke="none" />
    <circle cx={15.6} cy={8.4} r={1.15} fill="currentColor" stroke="none" />
    <circle cx={12} cy={12} r={1.15} fill="currentColor" stroke="none" />
    <circle cx={8.4} cy={15.6} r={1.15} fill="currentColor" stroke="none" />
    <circle cx={15.6} cy={15.6} r={1.15} fill="currentColor" stroke="none" />
  </Svg>
);

export const SaveIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4.4 4.4h11.4l3.8 3.8v11.4H4.4Z" />
    <path d="M8 4.4v5h7v-5" />
    <rect x={8} y={13} width={8} height={6.6} />
  </Svg>
);

export const FolderIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3.4 6.4a1.6 1.6 0 0 1 1.6-1.6h4l2 2.4h7.4a1.6 1.6 0 0 1 1.6 1.6v9.2a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6Z" />
  </Svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 4.6v14.8M4.6 12h14.8" />
  </Svg>
);

export const TrashIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4.6 6.6h14.8M9.4 6.6V4.8h5.2v1.8M6.4 6.6l.9 12.6h9.4l.9-12.6" />
  </Svg>
);

export const LockIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x={5} y={10.4} width={14} height={9} rx={1.8} />
    <path d="M8.4 10.4V7.8a3.6 3.6 0 0 1 7.2 0v2.6" />
  </Svg>
);

export const BanIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx={12} cy={12} r={8.6} />
    <path d="m6 18 12-12" />
  </Svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="m5 12.6 4.6 4.6L19 7.4" strokeWidth={2} />
  </Svg>
);

export const AlertIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 4.2 21 19.4H3Z" />
    <path d="M12 10v4.2M12 16.8v.6" strokeWidth={1.8} />
  </Svg>
);

export const RotateIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4.2 12a7.8 7.8 0 0 1 13.3-5.5l2.3 2.2" />
    <path d="M19.8 12a7.8 7.8 0 0 1-13.3 5.5l-2.3-2.2" />
    <path d="M19.8 4.4v4.3h-4.3M4.2 19.6v-4.3h4.3" />
  </Svg>
);

export const ExtrasIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx={12} cy={12} r={4.2} />
    <path d="M12 2.6v3M12 18.2v3.2M2.6 12h3M18.4 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
  </Svg>
);

export const ChevronIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </Svg>
);

export const GemIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M6.2 3.4h11.6l3.4 5.2L12 20.6 2.8 8.6Z" />
    <path d="M2.8 8.6h18.4M9 3.4 7.2 8.6 12 20.6l4.8-12L15 3.4" />
  </Svg>
);

export const BookIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3.6 4.6h5.6A2.8 2.8 0 0 1 12 7.4v12a2.4 2.4 0 0 0-2.4-2.4H3.6Z" />
    <path d="M20.4 4.6h-5.6A2.8 2.8 0 0 0 12 7.4v12a2.4 2.4 0 0 1 2.4-2.4h6Z" />
  </Svg>
);

export const GearIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx={12} cy={12} r={3.2} />
    <path d="M19.2 13.4a7.6 7.6 0 0 0 0-2.8l2-1.6-2-3.4-2.4.9a7.5 7.5 0 0 0-2.4-1.4L14 2.4h-4l-.4 2.7a7.5 7.5 0 0 0-2.4 1.4L4.8 5.6l-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2.8l-2 1.6 2 3.4 2.4-.9a7.5 7.5 0 0 0 2.4 1.4l.4 2.7h4l.4-2.7a7.5 7.5 0 0 0 2.4-1.4l2.4.9 2-3.4Z" />
  </Svg>
);

export const GridIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x={3.4} y={3.4} width={7} height={7} rx={1.4} />
    <rect x={13.6} y={3.4} width={7} height={7} rx={1.4} />
    <rect x={3.4} y={13.6} width={7} height={7} rx={1.4} />
    <rect x={13.6} y={13.6} width={7} height={7} rx={1.4} />
  </Svg>
);

export const AvatarNavIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx={12} cy={8} r={4} />
    <path d="M4.6 20.4a7.4 7.4 0 0 1 14.8 0" />
  </Svg>
);

export const LoadoutIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x={3.4} y={6.4} width={17.2} height={13.2} rx={2} />
    <path d="M8.6 6.4V4.8a1.4 1.4 0 0 1 1.4-1.4h4a1.4 1.4 0 0 1 1.4 1.4v1.6M3.4 12h17.2" />
  </Svg>
);

export const WorldsIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx={12} cy={12} r={8.6} />
    <path d="M3.4 12h17.2M12 3.4c2.4 2.6 3.6 5.6 3.6 8.6s-1.2 6-3.6 8.6c-2.4-2.6-3.6-5.6-3.6-8.6s1.2-6 3.6-8.6Z" />
  </Svg>
);

export const AnimationsIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M2.6 12h3l2-6 3 13 3-9.5 2 2.5h5.8" />
  </Svg>
);

export const ArrowIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4.6 12h14.8M13.4 6l6 6-6 6" />
  </Svg>
);

export const CATEGORY_ICONS = {
  skin: SkinIcon,
  hair: HairIcon,
  eyes: EyesIcon,
  eyebrows: EyebrowsIcon,
  top: TopIcon,
  bottom: BottomIcon,
  shoes: ShoesIcon,
  accessories: AccessoriesIcon,
  extras: ExtrasIcon,
} as const;
