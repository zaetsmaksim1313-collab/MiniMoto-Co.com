import { create } from 'zustand';

export interface ColorOption {
  name: string;
  hex: string;
  priceModifier?: number;
}

export const BIKE_COLORS: ColorOption[] = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#111111' },
  { name: 'Racing Red', hex: '#d90429' },
  { name: 'Light Blue', hex: '#4ea8de' },
  { name: 'Electric Blue', hex: '#0077b6' },
  { name: 'Pink', hex: '#ffb3c1' },
  { name: 'Hot Pink', hex: '#ff007f' },
  { name: 'Navy Blue', hex: '#1d3557' },
  { name: 'Purple', hex: '#7209b7' },
  { name: 'Orange', hex: '#f77f00' },
  { name: 'Dark Purple', hex: '#3c096c' },
  { name: 'Yellow', hex: '#fcbf49' },
  { name: 'Grey', hex: '#6c757d' },
  { name: 'Teal', hex: '#06d6a0' },
  { name: 'Silver', hex: '#e2e8f0' },
  { name: 'Olive Green', hex: '#606c38' },
];

export interface ConfiguratorState {
  // Selections
  frameColor: ColorOption;
  chiBattery: boolean;
  ebmxController: boolean;
  motorCover: boolean;
  fox40: boolean;
  shvftworkBars: boolean;
  
  // Actions
  setFrameColor: (color: ColorOption) => void;
  toggleChiBattery: () => void;
  toggleEbmxController: () => void;
  toggleMotorCover: () => void;
  toggleFox40: () => void;
  toggleShvftworkBars: () => void;
  resetSelections: () => void;
  
  // Pricing
  basePrice: number;
  getTotalPrice: () => number;
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  frameColor: BIKE_COLORS[0], // White
  chiBattery: false,
  ebmxController: false,
  motorCover: false,
  fox40: false,
  shvftworkBars: false,
  
  basePrice: 25.00,
  
  setFrameColor: (color) => set({ frameColor: color }),
  toggleChiBattery: () => set((state) => ({ chiBattery: !state.chiBattery })),
  toggleEbmxController: () => set((state) => ({ ebmxController: !state.ebmxController })),
  toggleMotorCover: () => set((state) => ({ motorCover: !state.motorCover })),
  toggleFox40: () => set((state) => ({ fox40: !state.fox40 })),
  toggleShvftworkBars: () => set((state) => ({ shvftworkBars: !state.shvftworkBars })),
  
  resetSelections: () => set({
    frameColor: BIKE_COLORS[0],
    chiBattery: false,
    ebmxController: false,
    motorCover: false,
    fox40: false,
    shvftworkBars: false,
  }),
  
  getTotalPrice: () => {
    const { basePrice, frameColor, chiBattery, ebmxController, motorCover, fox40, shvftworkBars } = get();
    let total = basePrice;
    
    if (frameColor.priceModifier) total += frameColor.priceModifier;
    if (chiBattery) total += 4.00;
    if (ebmxController) total += 5.00;
    if (motorCover) total += 2.00;
    if (fox40) total += 5.00;
    if (shvftworkBars) total += 3.00;
    
    return total;
  }
}));
