export interface GeoParams {
  year: number
  minx: number
  miny: number
  maxx: number
  maxy: number
}

export interface SsdmtGeoDto {
  conjuntoId: number
  geom: string
  decLimite: number | null
  fecLimite: number | null
  decRealizado: number | null
  fecRealizado: number | null
  desvioDec: number | null
  desvioFec: number | null
  score: number | null
}

export interface LinhaEnergia {
  id: number
  name: string
  coordinates: [number, number][]
  dec_realizado: number
  dec_limite: number
  fec_realizado: number
  fec_limite: number
  desvio_dec: number
  desvio_fec: number
  score: number
}

export interface GeoBounds {
  minx: number
  miny: number
  maxx: number
  maxy: number
}