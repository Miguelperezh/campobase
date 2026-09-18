export const PLAN_PRICES = Object.freeze({
  monthly: { label: 'Plan Mensual', price: '9,99 € / mes', shortPrice: '9,99 €' },
  annual: { label: 'Plan Anual', price: '79 € / año', shortPrice: '79 €' },
});

export const APP_PLAN_FEATURES = Object.freeze([
  'Inicio con resumen del día',
  'Plantilla y fichas completas de jugadores',
  'Estadísticas individuales actualizadas desde partidos y asistencias',
  'Cuerpo técnico',
  'Control de asistencia a entrenamientos y partidos',
  'Convocatorias y reparto de minutos',
  'Preparación de partido, alineaciones y suplentes',
  'Partido en vivo con cronómetro, cambios e incidencias',
  'Calendario, resultados y pretemporada',
  'Sesiones de entrenamiento',
  'Biblioteca de ejercicios',
  'Vídeos y demostraciones de ejercicios cuando existan',
  'Pizarra táctica',
  'Cuenta de delegado con permisos configurables',
  'Sincronización segura en la nube',
  'Acceso desde varios dispositivos',
  'Copia de seguridad y recuperación',
  'Personalización del equipo y del club',
  'Códigos de regalo y descuento',
]);

export function planFeaturesHTML() {
  return `<ul class="cb-plan-features">${APP_PLAN_FEATURES.map((feature) => `<li><span aria-hidden="true">✓</span><span>${feature}</span></li>`).join('')}</ul>`;
}
