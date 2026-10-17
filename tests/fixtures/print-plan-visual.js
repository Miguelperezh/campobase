// Datos sintéticos aislados: reproducen ventanas y recolocaciones de la referencia.
export const players=[1,5,6,7,8,9,11,12,13,14,15,16,18].map(number=>({id:'p'+number,number,name:({1:'Portero Uno',13:'Portero Trece',7:'Delantero Siete',9:'Delantero Nueve'})[number]||'Jugador '+number+' Apellido',positions:[number===1||number===13?'Portero':'Central, Medio y Extremo']}));
const positions=['Portero','Defensa izquierdo','Defensa derecho','Mediocentro','Banda izquierda','Banda derecha','Delantero'];
export const lineups=[[1,16,6,15,18,11,7],[13,8,5,12,11,14,9],[13,8,5,12,18,14,9],[1,16,6,15,11,18,7],[1,16,6,15,12,9,7],[13,8,5,12,14,9,7],[13,8,5,15,12,14,9]];
export const moments=[0,17,26,35,47,53,61].map((minute,index)=>({id:'m'+minute,minute,formation:'1-2-3-1',team:lineups[index].map((number,slot)=>({pos:positions[slot],playerId:'p'+number}))}));
export const match={id:'visual-plan',opponent:'Equipo visitante',format:'F7',date:'2026-10-17',time:'10:00',location:'Campo configurado',duration:70,round:'3'};
export const state={settings:{teamName:'Equipo de prueba · Alevín',clubCrest:'/icons/escudo.png',theme:{btnBg:'#a51d3d'},coachName:'Entrenador de prueba'},players,matches:[match],callups:[{matchId:match.id,format:'F7',availableIds:players.map(p=>p.id)}],preparaciones:[{matchId:match.id,formacion:'1-2-3-1',team:moments[0].team,moments}]};
