const LAB_SQUAD = Object.freeze([
  { id: 'p12', name: 'Ramiro Casati', number: '1', foot: 'Derecha', positions: ['Portero'] },
  { id: 'p04', name: 'Eidan Asensio', number: '3', foot: 'Derecha', positions: ['Extremo', 'Delantero centro', 'Segundo delantero'] },
  { id: 'p01', name: 'Thiago Hernández', number: '4', foot: 'Derecha', positions: ['Central'] },
  { id: 'p09', name: 'Diego Andrés Anaya', number: '5', foot: 'Derecha', positions: ['Extremo'] },
  { id: 'p05', name: 'Nicolás Díaz-Saavedra', number: '6', foot: 'Derecha', positions: [] },
  { id: 'p08', name: 'Alejandro Pedrós', number: '7', foot: 'Izquierda', positions: ['Central', 'Extremo', 'Delantero centro', 'Segundo delantero'] },
  { id: 'p06', name: 'Alejandro Suárez', number: '8', foot: 'Izquierda', positions: ['Central', 'Pivote/Mediocentro defensivo'] },
  { id: 'p03', name: 'Ignacio Poladura', number: '9', foot: 'Derecha', positions: ['Extremo', 'Delantero centro', 'Segundo delantero'] },
  { id: 'p10', name: 'Rodrigo Rodríguez', number: '10', foot: 'Ambas', positions: ['Central', 'Extremo'] },
  { id: 'p11', name: 'Aitor Navarro', number: '11', foot: 'Derecha', positions: ['Extremo'] },
  { id: 'p02', name: 'Javier Navarro', number: '12', foot: 'Derecha', positions: ['Mediapunta', 'Extremo'] },
  { id: 'p07', name: 'Pelayo Marrero', number: '15', foot: 'Derecha', positions: ['Central', 'Carrilero', 'Pivote/Mediocentro defensivo', 'Mediapunta', 'Delantero centro', 'Segundo delantero'] },
  { id: '2d3a94f6-2fbf-4e2a-818b-ec206bfc3aac', name: 'Pablo Montesdeoca', number: '16', foot: 'Derecha', positions: ['Central', 'Pivote/Mediocentro defensivo', 'Mediapunta', 'Extremo', 'Segundo delantero'] },
  { id: 'd7e874fb-ce40-4c19-879e-2be849f34663', name: 'Marcel González', number: '18', foot: 'Derecha', positions: ['Extremo', 'Delantero centro'] },
  { id: 'p13', name: 'Pablo González', number: '20', foot: 'Derecha', positions: ['Central', 'Mediapunta', 'Extremo', 'Delantero centro', 'Segundo delantero'] },
]);

export function planSquadSeed(currentPlayers, createdAt = Date.now()) {
  return {
    players: currentPlayers.length ? [] : LAB_SQUAD.map((player, index) => ({
      ...player,
      notes: '',
      photo: '',
      outsideCount: 0,
      lastExcludedAt: null,
      totalMinutes: 0,
      seasonMinutes: {},
      minuteReasons: [],
      ratingHistory: [],
      createdAt: createdAt + index,
    })),
    settings: [{
      id: 'futbolcontrol-lab-real-squad-v2',
      recordType: 'migration',
      version: 2,
      createdAt,
    }],
  };
}
