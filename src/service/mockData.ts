// Mock de dados para distribuidoras, DEC, FEC, pontos e métricas
export const distribuidoras = [
  { id: 1, nome: 'Distribuidora A' },
  { id: 2, nome: 'Distribuidora B' },
  { id: 3, nome: 'Distribuidora C' },
];

export const pontos = [
  { id: 1, lat: -23.55, lng: -46.63, distribuidoraId: 1, dec: 12, fec: 3 },
  { id: 2, lat: -23.56, lng: -46.62, distribuidoraId: 2, dec: 8, fec: 2 },
  { id: 3, lat: -23.57, lng: -46.61, distribuidoraId: 3, dec: 15, fec: 4 },
  { id: 4, lat: -23.58, lng: -46.60, distribuidoraId: 1, dec: 10, fec: 2 },
  { id: 5, lat: -23.59, lng: -46.59, distribuidoraId: 2, dec: 7, fec: 1 },
];

// Mock de métricas
export function calcularTAM(area: any) {
  // Retorne um valor mockado
  return Math.floor(Math.random() * 1000) + 100
}
export function calcularSAM(area: any) {
  // Retorne um valor mockado
  return Math.floor(Math.random() * 500) + 50
}

// Mock de usuários
export const users = [
  { id: 1, name: 'Alice Silva', email: 'alice@empresa.com' },
  { id: 2, name: 'Bruno Costa', email: 'bruno@empresa.com' },
  { id: 3, name: 'Carla Souza', email: 'carla@empresa.com' },
]

// Mock de logs
export const logs = [
  { id: 1, ts: '2026-04-27 10:12:34', user: 'alice', action: 'login', details: 'Login bem-sucedido' },
  { id: 2, ts: '2026-04-27 11:05:00', user: 'bruno', action: 'gerar_relatorio', details: 'Gerou relatório PDF' },
  { id: 3, ts: '2026-04-27 12:30:11', user: 'carla', action: 'desenhar_area', details: 'Calculou TAM/SAM' },
]
