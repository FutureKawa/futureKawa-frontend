export interface Lot {
  id: string;
  typeCafe: string;
  dateStokage: string;
  poids: number;
  statut: 'CONFORME' | 'ALERTE' | 'PERIME';
}
