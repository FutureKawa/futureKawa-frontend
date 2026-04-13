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
  icon: string;
  percent: string;
  trend: 'up' | 'down';
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

const countryStatsMap: Record<string, StatCard[]> = {
  br: [
    {
      title: 'Entrepôts actifs',
      value: '40,689',
      icon: '/images/entrepot.svg',
      percent: '8.5%',
      trend: 'up',
    },
    {
      title: 'Nombre total de lots',
      value: '10293',
      icon: '/images/totallot.svg',
      percent: '5.2%',
      trend: 'up',
    },
    {
      title: 'Stock total',
      value: '89,000',
      icon: '/images/totalstock.svg',
      percent: '2.1%',
      trend: 'down',
    },
    {
      title: 'Alertes critiques',
      value: '2040',
      icon: '/images/critic.svg',
      percent: '10.3%',
      trend: 'up',
    },
  ],
  ec: [
    {
      title: 'Entrepôts actifs',
      value: '12,450',
      icon: '/images/entrepot.svg',
      percent: '3.8%',
      trend: 'up',
    },
    {
      title: 'Nombre total de lots',
      value: '7,540',
      icon: '/images/totallot.svg',
      percent: '1.9%',
      trend: 'up',
    },
    {
      title: 'Stock total',
      value: '31,200',
      icon: '/images/totalstock.svg',
      percent: '0.5%',
      trend: 'down',
    },
    {
      title: 'Alertes critiques',
      value: '820',
      icon: '/images/critic.svg',
      percent: '6.2%',
      trend: 'up',
    },
  ],
  co: [
    {
      title: 'Entrepôts actifs',
      value: '18,760',
      icon: '/images/entrepot.svg',
      percent: '4.1%',
      trend: 'up',
    },
    {
      title: 'Nombre total de lots',
      value: '9,780',
      icon: '/images/totallot.svg',
      percent: '3.4%',
      trend: 'up',
    },
    {
      title: 'Stock total',
      value: '44,500',
      icon: '/images/totalstock.svg',
      percent: '1.8%',
      trend: 'down',
    },
    {
      title: 'Alertes critiques',
      value: '1,120',
      icon: '/images/critic.svg',
      percent: '8.0%',
      trend: 'up',
    },
  ],
};

export function getCountryStatsByCode(code: string | null): StatCard[] {
  return countryStatsMap[code ?? ''] ?? [];
}

export const entrepots: Entrepot[] = [
  {
    id: 1,
    name: 'Entrepôt Recife',
    city: 'Recife',
    stock: '8 050',
    stockUnit: 'kg',
    status: 'CONFORME',
    statusLabel: 'conforme',
    latitude: -8.0476,
    longitude: -34.8770,
    countryCode: 'br',
  },
  {
    id: 2,
    name: 'Entrepôt Belo Horizonte',
    city: 'Belo Horizonte',
    stock: '12 300',
    stockUnit: 'kg',
    status: 'CONFORME',
    statusLabel: 'conforme',
    latitude: -19.9245,
    longitude: -43.9352,
    countryCode: 'br',
  },
  {
    id: 3,
    name: 'Entrepôt Guayaquil',
    city: 'Guayaquil',
    stock: '6 420',
    stockUnit: 'kg',
    status: 'ACTIF',
    statusLabel: 'actif',
    latitude: -2.1700,
    longitude: -79.9224,
    countryCode: 'ec',
  },
  {
    id: 4,
    name: 'Entrepôt Quito',
    city: 'Quito',
    stock: '7 880',
    stockUnit: 'kg',
    status: 'CONFORME',
    statusLabel: 'conforme',
    latitude: -0.1807,
    longitude: -78.4678,
    countryCode: 'ec',
  },
  {
    id: 5,
    name: 'Entrepôt Bogota',
    city: 'Bogotá',
    stock: '10 120',
    stockUnit: 'kg',
    status: 'ACTIF',
    statusLabel: 'actif',
    latitude: 4.7110,
    longitude: -74.0721,
    countryCode: 'co',
  },
  {
    id: 6,
    name: 'Entrepôt Medellín',
    city: 'Medellín',
    stock: '5 700',
    stockUnit: 'kg',
    status: 'INACTIF',
    statusLabel: 'inactif',
    latitude: 6.2442,
    longitude: -75.5812,
    countryCode: 'co',
  },
];
