const SQUAD_NAMES = [
  'Thiago Hernández',
  'Javier Navarro',
  'Ignacio Poladura',
  'Eidan Asensio',
  'Nicolás Díaz-Saavedra',
  'Alejandro Suárez',
  'Pelayo Marrero',
  'Alejandro Pedrós',
  'Diego Andrés Anaya',
  'Rodrigo Rodríguez',
  'Aitor Navarro',
  'Ramiro Casati',
  'Miguel',
];

export function planSquadSeed(currentPlayers, createdAt = Date.now()) {
  return {
    players: currentPlayers.length ? [] : SQUAD_NAMES.map((name, index) => ({
      id: `p${String(index + 1).padStart(2, '0')}`,
      name,
      number: index === 11 ? '1' : '',
      positions: index === 11 ? ['Portero'] : [],
      foot: '',
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
      id: 'squad-26-27-seeded',
      recordType: 'migration',
      version: 1,
      createdAt,
    }],
  };
}
