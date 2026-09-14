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
  { name: 'Ramiro Casati', number: '1', positions: ['Portero'], fatherPhone: '611 010 001', motherPhone: '', fatherName: 'Padre', motherName: '' },
  { name: 'Eidan Asensio', number: '3', positions: ['Defensa'], fatherPhone: '611 030 003', motherPhone: '622 030 003', fatherName: 'Padre', motherName: 'Madre' },
  { name: 'Thiago Hernández', number: '4', positions: ['Defensa'], fatherPhone: '611 040 004', motherPhone: '', fatherName: 'Carlos', motherName: '' },
  { name: 'Diego Andrés Anaya', number: '5', positions: ['Centrocampista'], fatherPhone: '611 050 005', motherPhone: '622 050 005', fatherName: 'Padre', motherName: 'Madre' },
  { name: 'Alejandro Pedrós', number: '7', positions: ['Delantero'], fatherPhone: '611 070 007', motherPhone: '', fatherName: 'Padre', motherName: '' },
  { name: 'Nicolás Díaz-Saavedra', number: '7', positions: ['Centrocampista'], fatherPhone: '611 072 007', motherPhone: '622 072 007', fatherName: 'Padre', motherName: 'Madre' },
  { name: 'Alejandro Suárez', number: '8', positions: ['Centrocampista'], fatherPhone: '611 080 008', motherPhone: '622 080 008', fatherName: 'Padre', motherName: 'Madre' },
  { name: 'Ignacio Poladura', number: '9', positions: ['Delantero'], fatherPhone: '611 090 009', motherPhone: '622 090 009', fatherName: 'Padre', motherName: 'Madre' },
  { name: 'Rodrigo Rodríguez', number: '10', positions: ['Centrocampista'], fatherPhone: '611 100 010', motherPhone: '', fatherName: 'Padre', motherName: '' },
  { name: 'Aitor Navarro', number: '11', positions: ['Delantero'], fatherPhone: '611 110 011', motherPhone: '622 110 011', fatherName: 'Carlos', motherName: 'Elena' },
  { name: 'Javier Navarro', number: '12', positions: ['Defensa'], fatherPhone: '611 120 012', motherPhone: '', fatherName: 'Padre', motherName: '' },
  { name: 'Pelayo Marrero', number: '15', positions: ['Defensa'], fatherPhone: '611 150 015', motherPhone: '622 150 015', fatherName: 'Padre', motherName: 'Madre' },
  { name: 'Pablo Montesdeoca', number: '16', positions: ['Delantero'], fatherPhone: '611 160 016', motherPhone: '622 160 016', fatherName: 'Padre', motherName: 'Madre' },
  { name: 'Pablo González', number: '20', positions: ['Defensa'], fatherPhone: '611 200 020', motherPhone: '622 200 020', fatherName: 'Padre', motherName: 'Madre' },
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
