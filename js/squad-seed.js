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

export const OFFICIAL_SQUAD_DATA = [
  { name: 'Ramiro Casati', number: '1', positions: ['Portero'], fatherPhone: '673845587', motherPhone: '', fatherName: 'Alejandro', motherName: '' },
  { name: 'Alejandro Pedrós', number: '', positions: ['Delantero'], fatherPhone: '637068277', motherPhone: '620980193', fatherName: 'Juan', motherName: 'Cristina' },
  { name: 'Eidan Asensio', number: '', positions: ['Defensa'], fatherPhone: '643970968', motherPhone: '', fatherName: 'Cristian', motherName: '' },
  { name: 'Nicolás Díaz-Saavedra', number: '', positions: ['Centrocampista'], fatherPhone: '667655371', motherPhone: '', fatherName: 'Adrián', motherName: '' },
  { name: 'Pablo González', number: '', positions: ['Defensa'], fatherPhone: '', motherPhone: '675742687', fatherName: '', motherName: 'Davinia' },
  { name: 'Thiago Hernández', number: '', positions: ['Defensa'], fatherPhone: '', motherPhone: '', fatherName: '', motherName: '' },
  { name: 'Javier Navarro', number: '', positions: ['Defensa'], fatherPhone: '', motherPhone: '', fatherName: '', motherName: '' },
  { name: 'Ignacio Poladura', number: '', positions: ['Delantero'], fatherPhone: '', motherPhone: '', fatherName: '', motherName: '' },
  { name: 'Alejandro Suárez', number: '', positions: ['Centrocampista'], fatherPhone: '', motherPhone: '', fatherName: '', motherName: '' },
  { name: 'Pelayo Marrero', number: '', positions: ['Defensa'], fatherPhone: '', motherPhone: '', fatherName: '', motherName: '' },
  { name: 'Diego Andrés Anaya', number: '', positions: ['Centrocampista'], fatherPhone: '', motherPhone: '', fatherName: '', motherName: '' },
  { name: 'Rodrigo Rodríguez', number: '', positions: ['Centrocampista'], fatherPhone: '', motherPhone: '', fatherName: '', motherName: '' },
  { name: 'Aitor Navarro', number: '', positions: ['Delantero'], fatherPhone: '', motherPhone: '', fatherName: '', motherName: '' },
  { name: 'Miguel', number: '', positions: ['Entrenador'], fatherPhone: '', motherPhone: '', fatherName: '', motherName: '' },
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
