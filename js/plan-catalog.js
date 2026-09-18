export const PLAN_PRICES = Object.freeze({
  monthly: { label: 'Plan Mensual', price: '9,99 € / mes', shortPrice: '9,99 €' },
  annual: { label: 'Plan Anual', price: '79 € / año', shortPrice: '79 €' },
});

export const APP_PLAN_FEATURE_GROUPS = Object.freeze([
  {
    icon: '👥',
    title: 'Equipo y jugadores',
    features: [
      'Inicio con resumen del día',
      'Plantilla completa',
      'Fichas de jugadores',
      'Estadísticas individuales',
      'Cuerpo técnico',
      'Asistencia a entrenamientos y partidos',
      'Cuenta de delegado con permisos configurables',
    ],
  },
  {
    icon: '⚽',
    title: 'Partidos',
    features: [
      'Convocatorias',
      'Reparto de minutos',
      'Preparación de partido',
      'Alineaciones, titulares y suplentes',
      'Partido en vivo',
      'Cronómetro y control de cambios',
      'Goles, tarjetas, lesiones e incidencias',
      'Puntuaciones de jugadores',
      'Calendario y resultados',
      'Liga y pretemporada',
    ],
  },
  {
    icon: '📋',
    title: 'Entrenamientos',
    features: [
      'Sesiones de entrenamiento',
      'Control de asistencia por sesión',
      'Biblioteca de ejercicios',
      'Filtros y búsqueda de ejercicios',
      'Vídeos y demostraciones cuando existan',
      'Planificación de sesiones por bloques',
      'Material necesario por sesión',
      'Pizarra táctica',
    ],
  },
  {
    icon: '☁️',
    title: 'Cuenta, nube y seguridad',
    features: [
      'Sincronización segura en la nube',
      'Acceso desde varios dispositivos',
      'Copia de seguridad y recuperación',
      'Personalización de equipo y club',
      'Escudo, colores y tema',
      'Acceso rápido por PIN del dispositivo cuando corresponda',
      'Códigos de regalo',
      'Códigos de descuento',
    ],
  },
]);

export const APP_PLAN_FEATURES = Object.freeze(
  APP_PLAN_FEATURE_GROUPS.flatMap((group) => group.features),
);

export function planFeaturesHTML() {
  return `<div class="cb-feature-groups">${APP_PLAN_FEATURE_GROUPS.map((group) => `
    <article class="cb-feature-group">
      <div class="cb-feature-group-head">
        <span class="cb-feature-icon" aria-hidden="true">${group.icon}</span>
        <h4>${group.title}</h4>
      </div>
      <ul class="cb-plan-features">
        ${group.features.map((feature) => `<li><span aria-hidden="true">✓</span><span>${feature}</span></li>`).join('')}
      </ul>
    </article>
  `).join('')}</div>`;
}
