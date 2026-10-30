// src/service/PrevisaoMock.ts

export interface Previsao {
  cod_unidade: number
  indicador: string
  sig_agente: string
  mae: number
  data: string
  previsao: number
}

// Gerar dados para 12 meses a partir de uma data base
const generateMockData = (cod_unidade: number, sig_agente: string, indicador: string): Previsao[] => {
  const dados: Previsao[] = []
  const startDate = new Date(2026, 2, 1) // Março de 2026
  const months = 12
  
  // Valores base para DEC e FEC
  const baseMAE = indicador === 'DEC' ? 2.5 : 0.155
  const basePrevisao = indicador === 'DEC' ? 2.3 : 0.145
  
  // Tendências diferentes para cada indicador
  const trend = indicador === 'DEC' ? 'crescente' : 'decrescente'
  
  for (let i = 0; i < months; i++) {
    const date = new Date(startDate)
    date.setMonth(startDate.getMonth() + i)
    
    // Variação mensal
    let variationMAE = 0
    let variationPrevisao = 0
    
    if (trend === 'crescente') {
      variationMAE = (Math.random() * 0.3) + (i * 0.05)
      variationPrevisao = (Math.random() * 0.25) + (i * 0.04)
    } else {
      variationMAE = (Math.random() * 0.2) - (i * 0.03)
      variationPrevisao = (Math.random() * 0.15) - (i * 0.02)
    }
    
    dados.push({
      cod_unidade,
      indicador,
      sig_agente,
      mae: Number((baseMAE + variationMAE + (Math.random() * 0.1)).toFixed(6)),
      data: date.toISOString(),
      previsao: Number((basePrevisao + variationPrevisao + (Math.random() * 0.08)).toFixed(6))
    })
  }
  
  return dados
}

// Dados mockados para diferentes agentes
const mockPrevisoes: Previsao[] = [
  // ETO - FEC
  ...generateMockData(13654, 'ETO', 'FEC'),
  // ETO - DEC
  ...generateMockData(13654, 'ETO', 'DEC'),
  // CPFL - FEC
  ...generateMockData(13655, 'CPFL', 'FEC'),
  // CPFL - DEC
  ...generateMockData(13655, 'CPFL', 'DEC'),
  // ENEL - FEC
  ...generateMockData(13656, 'ENEL', 'FEC'),
  // ENEL - DEC
  ...generateMockData(13656, 'ENEL', 'DEC'),
]

// Lista de agentes disponíveis
export const agentesDisponiveis = [
  { sigla: 'ETO', nome: 'Energética de Transmissão do Oeste' },
  { sigla: 'CPFL', nome: 'CPFL Energia' },
  { sigla: 'ENEL', nome: 'Enel Distribuição' },
  { sigla: 'CEMIG', nome: 'CEMIG' },
  { sigla: 'COPEL', nome: 'Copel' }
]

export const PrevisaoMock = {
  getAll: (): Previsao[] => {
    return mockPrevisoes
  },
  
  getByFilters: (cod_unidade: number, indicador: string, sig_agente?: string): Previsao[] => {
    let filtered = mockPrevisoes.filter(p => 
      p.cod_unidade === cod_unidade && 
      p.indicador === indicador
    )
    
    if (sig_agente) {
      filtered = filtered.filter(p => p.sig_agente === sig_agente)
    }
    
    // Ordenar por data
    return filtered.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
  },
  
  getAgentesByCodUnidade: (cod_unidade: number): string[] => {
    const agentes = new Set(
      mockPrevisoes
        .filter(p => p.cod_unidade === cod_unidade)
        .map(p => p.sig_agente)
    )
    return Array.from(agentes)
  }
}

export default PrevisaoMock