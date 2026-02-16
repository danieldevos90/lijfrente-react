export const SECTOR_ICON_MAP: Record<string, string> = {
  horeca: "/icons/SVG/food/cutlery.svg",
  retail: "/icons/SVG/e-commerce/shop.svg",
  transport: "/icons/SVG/e-commerce/truck.svg",
  bouw: "/icons/SVG/interface/home.svg",
  ecommerce: "/icons/SVG/e-commerce/shopping-cart.svg",
  zorg: "/icons/SVG/health/stethoscope.svg",
  consultants: "/icons/SVG/interface/bulb.svg",
  schoonmaak: "/icons/SVG/interface/magic-wand.svg",
  automotive: "/icons/SVG/e-commerce/truck.svg",
  productie: "/icons/SVG/e-commerce/factory.svg",
  zzp: "/icons/SVG/interface/user.svg",
  starters: "/icons/SVG/interface/rocket.svg",
  franchise: "/icons/SVG/interface/grid.svg",
  medisch: "/icons/SVG/health/stethoscope.svg",
  tandarts: "/icons/SVG/health/stethoscope.svg",
  groothandel: "/icons/SVG/e-commerce/shop.svg",
  schoonheid: "/icons/SVG/interface/magic-wand.svg",
  kasstroom: "/icons/SVG/finance/wallet.svg",
};

export function getSectorIcon(sectorSlug: string): string {
  return SECTOR_ICON_MAP[sectorSlug] || "/icons/SVG/finance/wallet.svg";
}

