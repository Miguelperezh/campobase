const SQUAD_NAMES = [
  'Álex Martín',
  'Lucas Vega',
  'Hugo Santana',
  'Mateo Cruz',
  'Daniel León',
  'Sergio Gil',
  'Iker Ramos',
  'Bruno Pérez',
  'Leo Suárez',
  'Adrián Mora',
  'Marco Díaz',
  'Nico Torres',
  'Samuel Ruiz',
  'Pablo Reyes',
];

export function planSquadSeed(currentPlayers, createdAt = Date.now()) {
  return {
    players: currentPlayers.length ? [] : SQUAD_NAMES.map((name, index) => ({
      id: `lab-p${String(index + 1).padStart(2, '0')}`,
      name,
      number: index === 11 ? '1' : String(index + 2),
      positions: index === 11 ? ['Portero'] : [],
      foot: index % 4 === 0 ? 'Izquierda' : 'Derecha',
      notes: '',
      photo: '',
      outsideCount: 0,
      lastExcludedAt: null,
      totalMinutes: 0,
      seasonMinutes: {},
      minuteReasons: [],
      createdAt: createdAt + index,
    })),
    settings: [{
      id: 'futbolcontrol-lab-squad-seeded',
      recordType: 'migration',
      version: 1,
      createdAt,
    }],
  };
}
