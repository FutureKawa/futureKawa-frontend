export interface Entrepot {
  id: number;
  name: string;
  city: string;
  stock: string;
  stockUnit: string;
  status: string;
  statusLabel: string;
  latitude: number;
  longitude: number;
  countryCode: string;
}

export interface Country {
  code: string;
  name: string;
  emoji: string;
  defaultCenter: [number, number];
}

export interface StatCard {
  title: string;
  value: string;
  imagePath: string;
  text: string;
  color: string;
}

export const countries: Country[] = [
  {
    code: 'br',
    name: 'Brésil',
    emoji: '🇧🇷',
    defaultCenter: [-14.2350, -51.9253],
  },
  {
    code: 'ec',
    name: 'Equateur',
    emoji: '🇪🇨',
    defaultCenter: [-1.8312, -78.1834],
  },
  {
    code: 'co',
    name: 'Colombie',
    emoji: '🇨🇴',
    defaultCenter: [4.5709, -74.2973],
  },
];

export function getCountryByCode(code: string | null): Country | null {
  return countries.find(country => country.code === code) ?? null;
}

