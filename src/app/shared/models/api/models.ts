export interface AlerteDto {
  id: number;
  lotId: number;
  lotIdFonctionnel: string;
  codePays: string;
  typeAlerte: string;
  message: string;
  dateAlerte: string; // ISO string
  traitee: boolean;
}

export interface EntrepotDto {
  id: number;
  nom: string;
  adresse: string;
  codePays: string;
  responsable: string;
  emailResponsable: string;
  latitude: number;
  longitude: number;
  nombreLots: number;
}

export interface EntrepotONEResponse {
  id: number;
  nom: string;
  adresse: string;
  responsable: string;
  emailResponsable: string;
  latitude: number;
  longitude: number;
  nombreLots: number;
  stockTotal: number;
  lastTemperature: number;
  lastHumidity: number;
}

export interface LotDto {
  id: number;
  lotId: string;
  codePays: string;
  entrepotId: number;
  nomEntrepot: string;
  dateStockage: string; // ISO string
  statut: string;
  poids: number;
  typeCafe: string;
}

export interface MesureDto {
  id: number;
  lotId: number;
  temperature: number;
  humidite: number;
  timestamp: string; // ISO string
}

export interface AlerteResponse {
  alertes: AlerteDto[];
  total: number;
  codePays: string;
}

export interface ConfigurationResponse {
  codePays: string;
  pays: string;
  totalEntrepots: number;
  alertes: number;
  tempIdeal: number;
  humiditeIdeal: number;
  tempMin: number;
  tempMax: number;
  humiditeMin: number;
  humiditeMax: number;
  dureeConservation: number;
}

export interface EntrepotResponse {
  entrepots: EntrepotDto[];
  total: number;
  codePays: string;
}

export interface LotResponse {
  lots: LotDto[];
  total: number;
  codePays: string;
}

export interface MesureResponse {
  mesures: MesureDto[];
  total: number;
  lotId: number;
}
