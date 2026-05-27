// Mock de dados para distribuidoras
export const distribuidoras = [
  { id: 1, nome: 'RGE Sul - RS' },
  { id: 2, nome: 'CEEE Equatorial' },
  { id: 3, nome: 'CPFL Paulista' },
];

// Função auxiliar para calcular desvio percentual
function calcularDesvioPercentual(realizado: number, limite: number): number {
  return ((realizado - limite) / limite) * 100;
}

// Dados com MULTILINESTRING formando uma malha elétrica (ruas/bairros)
export const linhasEnergia = [
  // ==================== REGIÃO CENTRAL (Distribuidora 1) ====================
  {
    id: 1,
    distribuidoraId: 1,
    name: 'Av. Principal Norte',
    coordinates: [
      [-46.54800, -23.65580], [-46.54650, -23.65450], [-46.54500, -23.65320],
      [-46.54350, -23.65190], [-46.54200, -23.65060]
    ],
    dec_realizado: 7.2,
    dec_limite: 6.5,
    fec_realizado: 3.5,
    fec_limite: 3.2
  },
  {
    id: 2,
    distribuidoraId: 1,
    name: 'Av. Principal Sul',
    coordinates: [
      [-46.54800, -23.65580], [-46.54950, -23.65710], [-46.55100, -23.65840],
      [-46.55250, -23.65970], [-46.55400, -23.66100]
    ],
    dec_realizado: 6.8,
    dec_limite: 6.5,
    fec_realizado: 3.1,
    fec_limite: 3.2
  },
  {
    id: 3,
    distribuidoraId: 1,
    name: 'Rua das Palmeiras',
    coordinates: [
      [-46.54500, -23.65320], [-46.54400, -23.65400], [-46.54300, -23.65480],
      [-46.54200, -23.65560], [-46.54100, -23.65640]
    ],
    dec_realizado: 8.1,
    dec_limite: 6.5,
    fec_realizado: 3.9,
    fec_limite: 3.2
  },
  {
    id: 4,
    distribuidoraId: 1,
    name: 'Rua dos Jacarandás',
    coordinates: [
      [-46.54350, -23.65190], [-46.54250, -23.65250], [-46.54150, -23.65310],
      [-46.54050, -23.65370], [-46.53950, -23.65430]
    ],
    dec_realizado: 6.3,
    dec_limite: 6.5,
    fec_realizado: 3.0,
    fec_limite: 3.2
  },
  {
    id: 5,
    distribuidoraId: 1,
    name: 'Av. Marginal Leste',
    coordinates: [
      [-46.54200, -23.65060], [-46.54000, -23.65100], [-46.53800, -23.65140],
      [-46.53600, -23.65180], [-46.53400, -23.65220]
    ],
    dec_realizado: 9.5,
    dec_limite: 6.5,
    fec_realizado: 4.1,
    fec_limite: 3.2
  },
  {
    id: 6,
    distribuidoraId: 1,
    name: 'Rua do Comércio',
    coordinates: [
      [-46.54650, -23.65450], [-46.54580, -23.65530], [-46.54510, -23.65610],
      [-46.54440, -23.65690], [-46.54370, -23.65770]
    ],
    dec_realizado: 7.5,
    dec_limite: 6.5,
    fec_realizado: 3.6,
    fec_limite: 3.2
  },

  // ==================== REGIÃO NORDESTE (Distribuidora 2) ====================
  {
    id: 7,
    distribuidoraId: 2,
    name: 'Av. Industrial Norte',
    coordinates: [
      [-46.53800, -23.65140], [-46.53650, -23.65000], [-46.53500, -23.64860],
      [-46.53350, -23.64720], [-46.53200, -23.64580]
    ],
    dec_realizado: 7.8,
    dec_limite: 7.0,
    fec_realizado: 3.4,
    fec_limite: 3.5
  },
  {
    id: 8,
    distribuidoraId: 2,
    name: 'Rua das Indústrias',
    coordinates: [
      [-46.53500, -23.64860], [-46.53380, -23.64940], [-46.53260, -23.65020],
      [-46.53140, -23.65100], [-46.53020, -23.65180]
    ],
    dec_realizado: 8.5,
    dec_limite: 7.0,
    fec_realizado: 4.0,
    fec_limite: 3.5
  },
  {
    id: 9,
    distribuidoraId: 2,
    name: 'Av. Logística Sul',
    coordinates: [
      [-46.53800, -23.65140], [-46.53900, -23.65000], [-46.54000, -23.64860],
      [-46.54100, -23.64720], [-46.54200, -23.64580]
    ],
    dec_realizado: 6.5,
    dec_limite: 7.0,
    fec_realizado: 3.1,
    fec_limite: 3.5
  },
  {
    id: 10,
    distribuidoraId: 2,
    name: 'Rua da Tecnologia',
    coordinates: [
      [-46.53350, -23.64720], [-46.53200, -23.64780], [-46.53050, -23.64840],
      [-46.52900, -23.64900], [-46.52750, -23.64960]
    ],
    dec_realizado: 10.2,
    dec_limite: 7.0,
    fec_realizado: 4.8,
    fec_limite: 3.5
  },

  // ==================== REGIÃO SUDOESTE (Distribuidora 3) ====================
  {
    id: 11,
    distribuidoraId: 3,
    name: 'Av. Residencial Oeste',
    coordinates: [
      [-46.55100, -23.65840], [-46.55250, -23.65950], [-46.55400, -23.66060],
      [-46.55550, -23.66170], [-46.55700, -23.66280]
    ],
    dec_realizado: 6.9,
    dec_limite: 6.8,
    fec_realizado: 3.3,
    fec_limite: 3.4
  },
  {
    id: 12,
    distribuidoraId: 3,
    name: 'Rua das Flores',
    coordinates: [
      [-46.55400, -23.66060], [-46.55320, -23.66140], [-46.55240, -23.66220],
      [-46.55160, -23.66300], [-46.55080, -23.66380]
    ],
    dec_realizado: 7.4,
    dec_limite: 6.8,
    fec_realizado: 3.6,
    fec_limite: 3.4
  },
  {
    id: 13,
    distribuidoraId: 3,
    name: 'Av. Parque Central',
    coordinates: [
      [-46.55700, -23.66280], [-46.55800, -23.66150], [-46.55900, -23.66020],
      [-46.56000, -23.65890], [-46.56100, -23.65760]
    ],
    dec_realizado: 8.2,
    dec_limite: 6.8,
    fec_realizado: 3.9,
    fec_limite: 3.4
  },
  {
    id: 14,
    distribuidoraId: 3,
    name: 'Rua da Harmonia',
    coordinates: [
      [-46.55250, -23.65950], [-46.55300, -23.65830], [-46.55350, -23.65710],
      [-46.55400, -23.65590], [-46.55450, -23.65470]
    ],
    dec_realizado: 6.4,
    dec_limite: 6.8,
    fec_realizado: 3.1,
    fec_limite: 3.4
  },

  // ==================== RAMIFICAÇÕES SECUNDÁRIAS ====================
  {
    id: 15,
    distribuidoraId: 1,
    name: 'Travessa dos Ipês',
    coordinates: [
      [-46.54400, -23.65400], [-46.54350, -23.65490], [-46.54300, -23.65580],
      [-46.54250, -23.65670]
    ],
    dec_realizado: 6.9,
    dec_limite: 6.5,
    fec_realizado: 3.2,
    fec_limite: 3.2
  },
  {
    id: 16,
    distribuidoraId: 2,
    name: 'Beco do Porto',
    coordinates: [
      [-46.53020, -23.65180], [-46.52880, -23.65220], [-46.52740, -23.65260],
      [-46.52600, -23.65300]
    ],
    dec_realizado: 9.8,
    dec_limite: 7.0,
    fec_realizado: 4.3,
    fec_limite: 3.5
  },
  {
    id: 17,
    distribuidoraId: 3,
    name: 'Alameda dos Coqueiros',
    coordinates: [
      [-46.55240, -23.66220], [-46.55100, -23.66280], [-46.54960, -23.66340],
      [-46.54820, -23.66400]
    ],
    dec_realizado: 7.7,
    dec_limite: 6.8,
    fec_realizado: 3.7,
    fec_limite: 3.4
  },
  {
    id: 18,
    distribuidoraId: 1,
    name: 'Rua do Lago',
    coordinates: [
      [-46.54000, -23.65100], [-46.53850, -23.65050], [-46.53700, -23.65000],
      [-46.53550, -23.64950]
    ],
    dec_realizado: 8.9,
    dec_limite: 6.5,
    fec_realizado: 4.0,
    fec_limite: 3.2
  }
];

// Adiciona os campos calculados para cada linha
linhasEnergia.forEach(linha => {
  const desvio_dec = calcularDesvioPercentual(linha.dec_realizado, linha.dec_limite);
  const desvio_fec = calcularDesvioPercentual(linha.fec_realizado, linha.fec_limite);
  
  Object.assign(linha, {
    dec: linha.dec_realizado,
    desvio_dec,
    desvio_fec
  });
});

// Para compatibilidade com código antigo
export const pontos = linhasEnergia.map(linha => ({
  id: linha.id,
  lat: linha.coordinates[Math.floor(linha.coordinates.length / 2)][1],
  lng: linha.coordinates[Math.floor(linha.coordinates.length / 2)][0],
  distribuidoraId: linha.distribuidoraId,
  dec_realizado: linha.dec_realizado,
  dec_limite: linha.dec_limite,
  desvio_dec: linha.desvio_dec,
  fec_realizado: linha.fec_realizado,
  fec_limite: linha.fec_limite,
  desvio_fec: linha.desvio_fec
}));

// Funções de cálculo TAM/SAM
export function calcularTAM(area: any) {
  return Math.floor(Math.random() * 1000) + 100;
}

export function calcularSAM(area: any) {
  return Math.floor(Math.random() * 500) + 50;
}

// Usuários existentes (aprovados)
export const users = [
  { id: 1, name: 'Alice Silva', email: 'alice@empresa.com', phone: '(11) 91234-5678', role: 'admin', status: 'approved', createdAt: '2024-01-15T10:00:00Z' },
  { id: 2, name: 'Bruno Costa', email: 'bruno@empresa.com', phone: '(11) 92345-6789', role: 'manager', status: 'approved', createdAt: '2024-02-20T14:30:00Z' },
  { id: 3, name: 'Carla Souza', email: 'carla@empresa.com', phone: '(11) 93456-7890', role: 'user', status: 'approved', createdAt: '2024-03-10T09:15:00Z' },
  { id: 4, name: 'Daniel Oliveira', email: 'daniel@empresa.com', phone: '(11) 94567-8901', role: 'user', status: 'approved', createdAt: '2024-04-05T11:45:00Z' },
  { id: 5, name: 'Fernanda Lima', email: 'fernanda@empresa.com', phone: '(11) 95678-9012', role: 'manager', status: 'approved', createdAt: '2024-05-12T16:20:00Z' },
];

// USUÁRIOS PENDENTES PARA APROVAÇÃO (MOCKS)
export const pendingUsers = [
  { 
    id: 101, 
    name: 'Roberto Mendes', 
    email: 'roberto.mendes@novaempresa.com', 
    phone: '(11) 98888-7777',
    role: 'user',
    status: 'pending',
    createdAt: '2026-05-20T08:30:00Z',
    requestReason: 'Solicitação de acesso ao sistema'
  },
  { 
    id: 102, 
    name: 'Mariana Santos', 
    email: 'mariana.santos@consultoria.com', 
    phone: '(11) 97777-6666',
    role: 'user',
    status: 'pending',
    createdAt: '2026-05-20T10:15:00Z',
    requestReason: 'Trabalha como analista de energia'
  },
  { 
    id: 103, 
    name: 'Carlos Eduardo Rocha', 
    email: 'carlos.rocha@distribuidora.com', 
    phone: '(11) 96666-5555',
    role: 'manager',
    status: 'pending',
    createdAt: '2026-05-19T14:45:00Z',
    requestReason: 'Gestor da área de operações'
  },
  { 
    id: 104, 
    name: 'Patrícia Alves', 
    email: 'patricia.alves@energia.com', 
    phone: '(11) 95555-4444',
    role: 'user',
    status: 'pending',
    createdAt: '2026-05-19T09:20:00Z',
    requestReason: 'Necessita acesso para relatórios'
  },
  { 
    id: 105, 
    name: 'Fernando Lima Junior', 
    email: 'fernando.junior@tecnologia.com', 
    phone: '(11) 94444-3333',
    role: 'admin',
    status: 'pending',
    createdAt: '2026-05-18T16:00:00Z',
    requestReason: 'Administrador de sistemas'
  },
  { 
    id: 106, 
    name: 'Juliana Costa', 
    email: 'juliana.costa@monitoramento.com', 
    phone: '(11) 93333-2222',
    role: 'user',
    status: 'pending',
    createdAt: '2026-05-18T11:30:00Z',
    requestReason: 'Monitoramento de indicadores'
  },
  { 
    id: 107, 
    name: 'Ricardo Martins', 
    email: 'ricardo.martins@consultoriaenergia.com', 
    phone: '(11) 92222-1111',
    role: 'manager',
    status: 'pending',
    createdAt: '2026-05-17T13:50:00Z',
    requestReason: 'Coordenador de projetos'
  },
  { 
    id: 108, 
    name: 'Amanda Souza', 
    email: 'amanda.souza@analytics.com', 
    phone: '(11) 91111-0000',
    role: 'user',
    status: 'pending',
    createdAt: '2026-05-17T08:45:00Z',
    requestReason: 'Análise de dados energéticos'
  },
];

// Função para obter todos os usuários (aprovados + pendentes)
export const getAllUsers = () => {
  return [...users, ...pendingUsers];
};

// Função para aprovar um usuário pendente
export const approveUser = (userId: number) => {
  const userIndex = pendingUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    const approvedUser = { ...pendingUsers[userIndex], status: 'approved' };
    pendingUsers.splice(userIndex, 1);
    users.push(approvedUser);
    return true;
  }
  return false;
};

// Função para rejeitar/recusar um usuário pendente
export const rejectUser = (userId: number) => {
  const userIndex = pendingUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    pendingUsers.splice(userIndex, 1);
    return true;
  }
  return false;
};

export const logs = [
  { id: 1, ts: '2026-04-27 10:12:34', user: 'alice', action: 'login', details: 'Login bem-sucedido' },
  { id: 2, ts: '2026-04-27 11:05:00', user: 'bruno', action: 'gerar_relatorio', details: 'Gerou relatório PDF' },
  { id: 3, ts: '2026-04-27 12:30:11', user: 'carla', action: 'desenhar_area', details: 'Calculou TAM/SAM' },
  { id: 4, ts: '2026-05-20 09:00:00', user: 'roberto.mendes', action: 'solicitar_acesso', details: 'Solicitou acesso ao sistema' },
  { id: 5, ts: '2026-05-20 11:30:00', user: 'mariana.santos', action: 'solicitar_acesso', details: 'Solicitou acesso ao sistema' },
];