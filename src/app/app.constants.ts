import { EntrepotInfo } from './shared/models/entrepots/EntrepotInfo';
import { Lot } from './shared/models/entrepots/Lot';
import { EntrepotStats } from './shared/models/entrepots/EntrepotStats';

export const MOCK_ENTREPOTS: Record<string, EntrepotInfo> = {
  'ent-001': {
    nom: 'Recifile',
    adresse: 'Av. das Nações, 1200, Recife, PE, Brésil',
    responsable: 'Carlos Silva',
    emailResponsable: 'carlos.silva@futurekawa.com',
    latitude: -8.0476,
    longitude: -34.877,
    nombreLots: 47,
  },
  'ent-002': {
    nom: 'Manaus Nord',
    adresse: 'Rua das Flores, 456, Manaus, AM, Brésil',
    responsable: 'Ana Oliveira',
    emailResponsable: 'ana.oliveira@futurekawa.com',
    latitude: -3.119,
    longitude: -60.021,
    nombreLots: 23,
  },
  'ent-003': {
    nom: 'Quito Central',
    adresse: 'Calle Amazonas, 500, Quito, Équateur',
    responsable: 'Luis Moreno',
    emailResponsable: 'luis.moreno@futurekawa.com',
    latitude: -0.1807,
    longitude: -78.4678,
    nombreLots: 31,
  },
  'ent-004': {
    nom: 'Bogotá Est',
    adresse: 'Carrera 7, 72-41, Bogotá, Colombie',
    responsable: 'Maria Gutierrez',
    emailResponsable: 'maria.gutierrez@futurekawa.com',
    latitude: 4.7109,
    longitude: -74.0721,
    nombreLots: 55,
  },
};

// TODO: remplacer par appel API réel — GET /api/pays/:paysId/entrepots/:entrepotId/lots
export const MOCK_LOTS: Lot[] = [
  { id: 'lot-001', typeCafe: 'PREMIUM', dateStokage: '2024-03-15T08:30:00Z', poids: 12, statut: 'CONFORME' },
  { id: 'lot-002', typeCafe: 'ARABICA', dateStokage: '2024-02-20T14:15:00Z', poids: 25, statut: 'ALERTE'   },
  { id: 'lot-003', typeCafe: 'ROBUSTA', dateStokage: '2023-06-10T09:00:00Z', poids: 18, statut: 'PERIME'   },
  { id: 'lot-004', typeCafe: 'PREMIUM', dateStokage: '2024-04-01T11:45:00Z', poids: 30, statut: 'CONFORME' },
  { id: 'lot-005', typeCafe: 'ARABICA', dateStokage: '2024-01-05T16:00:00Z', poids: 8,  statut: 'CONFORME' },
  { id: 'lot-006', typeCafe: 'EXCELSA', dateStokage: '2024-03-28T10:00:00Z', poids: 15, statut: 'ALERTE'   },
];

// TODO: remplacer par appel API réel — GET /api/pays/:paysId/entrepots/:entrepotId/stats
export const MOCK_STATS: EntrepotStats = {
  lotsActifs:     40689,
  totalLots:      10293,
  qualiteMoyenne: 89000,
  alertes:        2040,
};
