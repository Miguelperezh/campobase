// ==========================================================================
// SUITE DE COMUNICACIONES WHATSAPP — CAMPOBASE
// Generadores de mensajes para partidos, entrenos y planificación semanal.
// Funciones puras y desacopladas para pruebas unitarias e integración en UI.
// ==========================================================================

export function cleanPlayerNumber(num) {
  if (num === null || num === undefined) return '';
  return String(num).replace(/[#\s]/g, '').trim();
}

/**
 * Normaliza y añade prefijo internacional a teléfonos de España (9 dígitos que empiezan por 6 o 7).
 */
export function formatWhatsAppPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 9 && (digits.startsWith('6') || digits.startsWith('7'))) {
    return `34${digits}`;
  }
  return digits;
}

export function getGreetingByHour(dateOrHour = new Date()) {
  let hour = 12;
  if (typeof dateOrHour === 'number') {
    hour = dateOrHour;
  } else if (dateOrHour instanceof Date) {
    hour = dateOrHour.getHours();
  }
  if (hour >= 6 && hour < 14) return 'Buenos días';
  if (hour >= 14 && hour < 21) return 'Buenas tardes';
  return 'Buenas noches';
}

export function getAutoMapsUrl(fieldName, locality = 'Las Palmas') {
  const query = `${(fieldName || '').trim()} ${locality}`.trim();
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

export function formatLongDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = String(dateStr).slice(0, 10).split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${dayNames[d.getDay()]}, ${day} de ${monthNames[month - 1]} de ${year}`;
  } catch {
    return dateStr;
  }
}

export function buildWhatsAppMatchConvocatoria({
  teamName = 'C.F. Unión Viera Alevín D',
  match = {},
  callup = null,
  players = [],
  kit = '1.ª Oficial (Roja y Negra)',
  competition = 'Liga',
  callTime = '08:15',
  gameTime = '09:00',
  fieldName = 'Campo Alfonso Silva (La Ballena)',
  mapsUrl = '',
  includeBibs = false,
  bibsConfig = 'Verdes y Amarillos',
  customNote = '',
  targetPlayerId = null,
  recipientType = 'group', // 'group' | 'parent'
  parentType = 'both', // 'both' | 'father' | 'mother'
  callupStatus = 'auto', // 'auto' | 'called' | 'excluded'
  now = new Date(),
} = {}) {
  const greeting = getGreetingByHour(now);
  const opponent = match.opponent || 'Rival';
  const rawDate = match.date || callup?.date || '';
  const dateFormatted = formatLongDate(rawDate) || 'Próximo partido';
  const resolvedMapsUrl = mapsUrl || getAutoMapsUrl(fieldName);

  // Determinar convocados y excluidos
  const availableSet = new Set(callup?.availableIds || []);
  const excludedSet = new Set(callup?.excludedIds || []);
  if (callup?.exclusions && Array.isArray(callup.exclusions)) {
    callup.exclusions.forEach(e => {
      const pid = typeof e === 'object' && e ? (e.playerId || e.id) : e;
      if (pid) excludedSet.add(pid);
    });
  }
  
  // Si no hay callup específico, todos los jugadores recibidos se asumen convocados
  const calledPlayers = callup
    ? players.filter(p => availableSet.has(p.id))
    : players;

  // CASO 1: Mensaje individual a progenitores
  if (recipientType === 'parent' && targetPlayerId) {
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    if (targetPlayer) {
      // Determinar si está convocado o no
      let isExcluded = false;
      if (callupStatus === 'excluded') {
        isExcluded = true;
      } else if (callupStatus === 'called') {
        isExcluded = false;
      } else if (callup) {
        if (excludedSet.has(targetPlayer.id)) {
          isExcluded = true;
        } else if (availableSet.has(targetPlayer.id)) {
          isExcluded = false;
        } else if (availableSet.size > 0) {
          // Si hay convocados oficiales y el jugador no está entre ellos, NO está convocado
          isExcluded = true;
        }
      }

      const father = (targetPlayer.fatherName || '').trim();
      const mother = (targetPlayer.motherName || '').trim();
      let salutation = '';
      if (parentType === 'mother') {
        salutation = mother ? `${greeting} ${mother}:` : `${greeting} (madre de ${targetPlayer.name}):`;
      } else if (parentType === 'father') {
        salutation = father ? `${greeting} ${father}:` : `${greeting} (padre de ${targetPlayer.name}):`;
      } else {
        // 'both': Padre y Madre
        if (father && mother) {
          salutation = `${greeting} ${father} y ${mother}:`;
        } else if (father) {
          salutation = `${greeting} ${father}:`;
        } else if (mother) {
          salutation = `${greeting} ${mother}:`;
        } else {
          salutation = `${greeting} a la familia de ${targetPlayer.name}:`;
        }
      }

      const numStr = cleanPlayerNumber(targetPlayer.number);
      const dorsalText = numStr ? `(Dorsal ${numStr})` : '';
      const introExcluded = (parentType === 'mother' || parentType === 'father')
        ? `Te comunicamos que ${targetPlayer.name} ${dorsalText} NO está CONVOCADO para el partido ${competition} (vs ${opponent}) del ${dateFormatted}.`
        : `Os comunicamos que ${targetPlayer.name} ${dorsalText} NO está CONVOCADO para el partido ${competition} (vs ${opponent}) del ${dateFormatted}.`;

      // SI ESTÁ MARCADO COMO NO CONVOCADO:
      if (isExcluded) {
        return `${salutation}

${introExcluded}

¡Mucho ánimo y a seguir trabajando duro en los entrenamientos!

¡Muchas gracias a todos/as!`.trim();
      }

      const introCalled = (parentType === 'mother' || parentType === 'father')
        ? `Te compartimos la información de la convocatoria para ${targetPlayer.name} ${dorsalText}:`
        : `Os compartimos la información de la convocatoria para ${targetPlayer.name} ${dorsalText}:`;

      // SI SÍ ESTÁ CONVOCADO:
      return `${salutation}

${introCalled}

🏆 *Competición:* ${competition} (vs ${opponent})
📅 *Fecha:* ${dateFormatted}
⏰ *Hora de citación:* ${callTime} h
⏱️ *Inicio de partido:* ${gameTime} h
🏟️ *Campo:* ${fieldName}
📍 *Ubicación en Google Maps:* ${resolvedMapsUrl}
👕 *Equipación:* ${kit}
🛡️ *Obligatorio:* Botella de agua individual y espinilleras${includeBibs ? `\n🎽 *Petos:* Se llevarán petos (${bibsConfig})` : ''}
${customNote ? `\n⚠️ *Nota:* ${customNote}` : ''}
• Rogamos puntualidad en la hora de citación para realizar un calentamiento óptimo.
• Ante cualquier molestia o imprevisto, avisad con antelación.

¡Muchas gracias a todos/as!`.trim();
    }
  }

  // CASO 2: Mensaje al Grupo General de Familias
  const playerListLines = calledPlayers.length
    ? calledPlayers.map((p, idx) => `${idx + 1}. ${cleanPlayerNumber(p.number)} ${p.name}`.trim()).join('\n')
    : 'Todos los jugadores de la plantilla convocados.';

  let materialBlock = `• 👕 *Equipación:* ${kit}\n• 🛡️ *Obligatorio:* Botella de agua individual y espinilleras`;
  if (includeBibs) {
    materialBlock += `\n• 🎽 *Petos:* Se llevarán petos de juego (${bibsConfig})`;
  }

  return `⚽ *CONVOCATORIA — ${teamName.toUpperCase()}* ⚽

${greeting} a todos/as,

Os compartimos la convocatoria para el próximo encuentro:

🏆 *Competición:* ${competition} (vs ${opponent})
📅 *Fecha:* ${dateFormatted}
⏰ *Hora de citación:* ${callTime} h
⏱️ *Inicio de partido:* ${gameTime} h
🏟️ *Campo:* ${fieldName}
📍 *Ubicación en Google Maps:* ${resolvedMapsUrl}

📋 *JUGADORES CONVOCADOS (${calledPlayers.length}):*
${playerListLines}

🎒 *Material y equipación:*
${materialBlock}
${customNote ? `\n⚠️ *Nota importante:* ${customNote}` : ''}
• Rogamos puntualidad en la hora de citación para realizar un buen calentamiento.
• Ante cualquier contratiempo o molestia física, por favor avisad con antelación.

¡Muchas gracias a todos/as!`.trim();
}

export function buildWhatsAppTrainingDay({
  teamName = 'C.F. Unión Viera Alevín D',
  session = {},
  fieldName = 'Campo Alfonso Silva (La Ballena)',
  mapsUrl = '',
  kitTraining = 'Equipación oficial de entrenamiento (camiseta técnica y pantalón corto)',
  targetPlayer = null,
  parentType = 'father',
  customNote = '',
  now = new Date(),
} = {}) {
  const greeting = getGreetingByHour(now);
  const rawDate = session.date || '';
  const dateFormatted = formatLongDate(rawDate) || 'Hoy';
  const timeStr = session.time || '16:30';
  const duration = session.duration || 60;
  const resolvedMapsUrl = mapsUrl || getAutoMapsUrl(fieldName);

  let salutation = `${greeting} a todos/as,`;
  if (targetPlayer) {
    const father = (targetPlayer.fatherName || '').trim();
    const mother = (targetPlayer.motherName || '').trim();
    if (parentType === 'mother') {
      salutation = mother ? `${greeting} ${mother}:` : `${greeting} (madre de ${targetPlayer.name}):`;
    } else if (parentType === 'father') {
      salutation = father ? `${greeting} ${father}:` : `${greeting} (padre de ${targetPlayer.name}):`;
    } else {
      // 'both'
      if (father && mother) {
        salutation = `${greeting} ${father} y ${mother}:`;
      } else if (father) {
        salutation = `${greeting} ${father}:`;
      } else if (mother) {
        salutation = `${greeting} ${mother}:`;
      } else {
        salutation = `${greeting} a la familia de ${targetPlayer.name}:`;
      }
    }
  }

  const intro = (targetPlayer && (parentType === 'mother' || parentType === 'father'))
    ? 'Te recordamos los detalles de la sesión de entrenamiento:'
    : 'Os recordamos los detalles de la sesión de entrenamiento:';

  return `⚽ *SESIÓN DE ENTRENAMIENTO — ${teamName.toUpperCase()}* ⚽

${salutation}

${intro}

📅 *Fecha:* ${dateFormatted}
⏰ *Hora:* ${timeStr} h (duración: ${duration} min)
🏟️ *Campo:* ${fieldName}
📍 *Ubicación:* ${resolvedMapsUrl}

🎒 *Material necesario:*
• 👕 *Equipación:* ${kitTraining}
• 💧 *Botella de agua individual* con su nombre
• ⚽ *Balón de fútbol T4* con la presión adecuada
${customNote ? `\n⚠️ *Nota:* ${customNote}` : ''}
Rogamos puntualidad para comenzar la sesión a la hora prevista.

¡Muchas gracias a todos/as!`.trim();
}

export function buildWhatsAppTrainingWeek({
  teamName = 'C.F. Unión Viera Alevín D',
  sessions = [],
  match = null,
  tacticalGoal = '',
  includeTacticalGoal = true,
  weekRangeLabel = 'esta semana',
  now = new Date(),
} = {}) {
  const greeting = getGreetingByHour(now);
  let goalBlock = '';
  if (includeTacticalGoal && tacticalGoal) {
    goalBlock = `🎯 *Objetivo formativo de la semana:*\n"${tacticalGoal.trim()}"\n\n`;
  }

  // Ordenar de más próximos a más lejanos (arriba los más próximos)
  const sortedSessions = [...sessions].sort((a, b) => {
    const cmp = String(a.date || '').localeCompare(String(b.date || ''));
    if (cmp !== 0) return cmp;
    return String(a.time || '').localeCompare(String(b.time || ''));
  });

  let scheduleLines = '';
  if (sortedSessions.length) {
    scheduleLines = sortedSessions.map(s => {
      const d = formatLongDate(s.date) || s.date;
      const f = s.field || s.venue || 'Campo habitual';
      const t = s.time || '16:30';
      const dur = s.duration ? ` (${s.duration} min)` : '';
      return `• *${d}:* ${t} h · ${f}${dur}`;
    }).join('\n');
  } else {
    scheduleLines = '• Lunes y Martes 16:30 h · Alfonso Silva\n• Jueves 16:30 h · Campo del Pilar';
  }

  let matchLine = '';
  if (match) {
    const md = formatLongDate(match.date) || match.date;
    const mt = match.time || '09:00';
    const mf = match.field || (match.venue === 'away' ? 'Campo rival' : 'Alfonso Silva');
    matchLine = `\n• *DOMINGO:* ${mt} h · PARTIDO vs ${match.opponent || 'Rival'} (${mf})`;
  }

  return `📅 *PLANIFICACIÓN SEMANAL (${weekRangeLabel.toUpperCase()}) — ${teamName.toUpperCase()}* ⚽

${greeting} a todos/as,

Os compartimos la planificación de entrenamientos para organizar la semana:

${goalBlock}${scheduleLines}${matchLine}

🎒 *Recordatorio para todos los entrenamientos:*
Llevar camiseta oficial de entreno, botella de agua individual y balón reglamentario T4.

¡Muchas gracias a todos/as!`.trim();
}
