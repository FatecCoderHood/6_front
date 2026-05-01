// Mock de dados para distribuidoras
export const distribuidoras = [
  { id: 1, nome: 'Distribuidora A' },
  { id: 2, nome: 'Distribuidora B' },
  { id: 3, nome: 'Distribuidora C' },
];

// Dados com MULTILINESTRING (coordenadas de linhas)
export const linhasEnergia = [
  {
    id: 1,
    distribuidoraId: 1,
    coordinates: [
      [-46.54248, -23.6528],
      [-46.54012, -23.6545],
      [-46.53876, -23.6562],
      [-46.53789, -23.6580],
    ],
    dec: 12,
    dec_realizado: 10.5,
    dec_limite: 8,
    desvio_dec: 2.5,
    fec: 3,
    fec_realizado: 2.8,
    fec_limite: 2,
    desvio_fec: 0.8
  },
  {
    id: 2,
    distribuidoraId: 2,
    coordinates: [
      [-46.54012, -23.6545],
      [-46.53800, -23.6565],
      [-46.53650, -23.6580],
      [-46.53500, -23.6600],
    ],
    dec: 8,
    dec_realizado: 7.2,
    dec_limite: 6,
    desvio_dec: 1.2,
    fec: 2,
    fec_realizado: 1.9,
    fec_limite: 1.5,
    desvio_fec: 0.4
  },
  {
    id: 3,
    distribuidoraId: 3,
    coordinates: [
      [-46.53876, -23.6562],
      [-46.53650, -23.6580],
      [-46.53400, -23.6605],
      [-46.53200, -23.6620],
    ],
    dec: 15,
    dec_realizado: 13.8,
    dec_limite: 10,
    desvio_dec: 3.8,
    fec: 4,
    fec_realizado: 3.5,
    fec_limite: 3,
    desvio_fec: 0.5
  },
  {
    id: 4,
    distribuidoraId: 1,
    coordinates: [
      [-46.53789, -23.6580],
      [-46.53500, -23.6600],
      [-46.53320, -23.6615],
      [-46.53150, -23.6630],
    ],
    dec: 10,
    dec_realizado: 11.2,
    dec_limite: 8,
    desvio_dec: -1.2,
    fec: 2,
    fec_realizado: 2.3,
    fec_limite: 2,
    desvio_fec: -0.3
  },
  {
    id: 5,
    distribuidoraId: 2,
    coordinates: [
      [-46.53500, -23.6600],
      [-46.53320, -23.6615],
      [-46.53100, -23.6635],
      [-46.52950, -23.6650],
    ],
    dec: 7,
    dec_realizado: 6.5,
    dec_limite: 6,
    desvio_dec: 0.5,
    fec: 1,
    fec_realizado: 1.2,
    fec_limite: 1,
    desvio_fec: -0.2
  }
];

// Para compatibilidade com código antigo (pontos médios das linhas)
export const pontos = linhasEnergia.map(linha => ({
  id: linha.id,
  lat: linha.coordinates[Math.floor(linha.coordinates.length / 2)][1],
  lng: linha.coordinates[Math.floor(linha.coordinates.length / 2)][0],
  distribuidoraId: linha.distribuidoraId,
  dec: linha.dec,
  fec: linha.fec,
  dec_realizado: linha.dec_realizado,
  dec_limite: linha.dec_limite,
  desvio_dec: linha.desvio_dec,
  fec_realizado: linha.fec_realizado,
  fec_limite: linha.fec_limite,
  desvio_fec: linha.desvio_fec
}));

// Funções de cálculo TAM/SAM
export function calcularTAM(area: any) {
  return Math.floor(Math.random() * 1000) + 100
}

export function calcularSAM(area: any) {
  return Math.floor(Math.random() * 500) + 50
}

export const users = [
  { id: 1, name: 'Alice Silva', email: 'alice@empresa.com' },
  { id: 2, name: 'Bruno Costa', email: 'bruno@empresa.com' },
  { id: 3, name: 'Carla Souza', email: 'carla@empresa.com' },
]

export const logs = [
  { id: 1, ts: '2026-04-27 10:12:34', user: 'alice', action: 'login', details: 'Login bem-sucedido' },
  { id: 2, ts: '2026-04-27 11:05:00', user: 'bruno', action: 'gerar_relatorio', details: 'Gerou relatório PDF' },
  { id: 3, ts: '2026-04-27 12:30:11', user: 'carla', action: 'desenhar_area', details: 'Calculou TAM/SAM' },
]