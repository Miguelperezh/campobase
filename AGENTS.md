# AGENTS.md — CampoBase

Este archivo contiene normas permanentes para cualquier agente que trabaje en este repositorio.

## Regla de convivencia entre agentes

`AGENTS.md` es un manual compartido y acumulativo. Cada chat/agente debe añadir únicamente las normas de su área sin borrar, sustituir, resumir, reordenar ni sobrescribir lo que hayan añadido otros agentes.

Antes de modificar este archivo:
- leer siempre la versión más reciente de `AGENTS.md` en `main`;
- editar solo la sección propia o añadir una nueva;
- conservar literalmente las secciones ajenas salvo autorización explícita del usuario;
- no reemplazar el archivo completo por una copia antigua procedente de otra rama;
- si una rama contiene instrucciones que todavía no están en `main`, no incorporarlas automáticamente salvo que formen parte de la tarea o el usuario lo pida.

## 0. Lectura obligatoria antes de modificar CampoBase

Antes de tocar código, datos, Supabase, ejercicios, sesiones, vídeos, diseño o navegación:

1. Leer `AGENTS.md`.
2. Leer la documentación específica del área que se vaya a tocar.
3. Para ejercicios, leer obligatoriamente `docs/ejercicios/ESPECIFICACION_EJERCICIOS.md`.
4. Revisar el código y los datos actuales antes de modificar nada.
5. Si una regla nueva contradice una antigua, prevalece la más reciente y explícita.

## 1. Reglas generales de seguridad

- CampoBase actual es la base validada.
- Añadir antes que rehacer.
- No borrar, sustituir, rediseñar ni reestructurar funciones ya validadas sin autorización explícita.
- No tocar `main` para cambios funcionales sin haber trabajado y probado antes en una rama.
- No eliminar datos existentes de usuarios, jugadores, partidos, sesiones, ejercicios, vídeos o Supabase.
- No cambiar IDs existentes silenciosamente.
- No romper compatibilidad con registros antiguos.
- No hacer obligatorios campos nuevos para datos antiguos.
- No modificar el diseño general de la app salvo petición explícita.
- No tocar el editor/pizarra ni sus funciones validadas salvo que la tarea lo exija expresamente.
- Antes de fusionar, ejecutar pruebas y revisar errores de consola/regresión.
- Si una modificación puede provocar pérdida de datos, duplicados o romper una función validada, detenerse antes de aplicarla.

---

# EJERCICIOS

Esta sección reúne el estado real y las normas permanentes de CampoBase para crear, convertir, importar e integrar ejercicios. Cualquier agente que vaya a tocar ejercicios debe leer esta sección completa y también `docs/ejercicios/ESPECIFICACION_EJERCICIOS.md`.

## Estado actual de lo realizado

En el trabajo del 18/09/2026 se preparó la conversión de los ejercicios procedentes del ZIP histórico de vídeos de CampoBase al nuevo formato.

Se hizo lo siguiente:
- **12 ejercicios actuales** preparados en el nuevo formato;
- **4 versiones anteriores** preparadas también, pero conservadas aparte y marcadas como no actuales;
- paquete global preparado con **16 carpetas**, manteniendo separados actuales y anteriores;
- cada ejercicio preparado contiene `preview.png`, `ejercicio.mp4`, `video_muestra_humanos.mp4`, `data.json`, `ficha.md`, `origen.json` y `qa.json`;
- cuando existía, se conservó también `fuente_animacion.gif` como trazabilidad del formato anterior;
- el formato gráfico principal pasó a ser **MP4**;
- se añadió el vídeo original con personas como **vídeo de muestra humano**;
- se aplicó la separación entre categoría principal y filtro `Fútbol 7 / Fútbol 11`;
- se aplicaron las reglas de terminología, incluida la prohibición visible de `chip`;
- se añadió QA individual por ejercicio.

Paquete preparado en aquella conversación:
- `CampoBase_NUEVO_FORMATO_ABSOLUTAMENTE_TODOS_16.zip`

**Importante:** que este trabajo esté documentado aquí no significa que esos 16 ejercicios estén ya integrados en producción. Antes de afirmar que están subidos o activos, comprobar repositorio, storage, Supabase y funcionamiento real de la app.

Las **4 versiones anteriores** deben seguir separadas y **no deben aparecer como ejercicios actuales**.

## Normas vigentes de ejercicios

La especificación detallada vive en:

`docs/ejercicios/ESPECIFICACION_EJERCICIOS.md`

Las reglas siguientes son obligatorias y tienen prioridad sobre descripciones antiguas incompatibles.

## 2.1 Principio de fidelidad

Un ejercicio procedente de vídeo debe representar el ejercicio real de la fuente.

No inventar silenciosamente:
- recorridos;
- posiciones;
- variantes;
- material;
- rotaciones;
- roles;
- número de balones;
- gestos;
- tiempos observados;
- lógica de la acción.

Si existe una duda importante sobre el movimiento o la geometría, debe resolverse antes de dar el ejercicio por validado.

Si el usuario corrige un único punto de un ejercicio ya validado, cambiar solo ese punto y conservar el resto.

## 2.2 Nuevo formato de ejercicio

Para ejercicios nuevos procedentes de vídeo, el paquete normal es:

- `preview.png`
- `ejercicio.mp4`
- `video_muestra_humanos.mp4`
- `data.json`
- `ficha.md`
- `origen.json`
- `qa.json`

Puede conservarse además `fuente_animacion.gif` como fuente histórica o trazabilidad cuando exista, pero:

**el formato principal de reproducción es MP4, no GIF.**

### Significado

- `preview.png`: montaje inicial limpio.
- `ejercicio.mp4`: demostración gráfica principal del ejercicio.
- `video_muestra_humanos.mp4`: vídeo real con personas del que procede el ejercicio.
- `data.json`: fuente estructurada principal de datos.
- `ficha.md`: explicación ampliada.
- `origen.json`: procedencia y trazabilidad.
- `qa.json`: control de calidad.

No meter storyboards de validación en el paquete final salvo petición expresa.

## 2.3 Preview y MP4

### preview.png
Debe mostrar el montaje inicial de forma limpia y útil.

### ejercicio.mp4
Debe:
- corresponder exactamente al mismo ejercicio descrito en `data.json`;
- mostrar movimiento real de jugadores y balón;
- conservar la lógica y geometría validadas;
- no llevar paneles de interfaz;
- no llevar cabeceras decorativas;
- no llevar textos explicativos superpuestos;
- mostrar flechas solo mientras sucede la acción correspondiente;
- evitar flechas permanentes decorativas;
- usar MP4/H.264 compatible con web/app cuando proceda.

No convertir el MP4 nuevo a GIF como formato principal.

## 2.4 Vídeo humano obligatorio cuando exista fuente en vídeo

Los ejercicios creados a partir de vídeo deben conservar también el vídeo real de muestra con humanos.

En la app deben poder coexistir:
1. vídeo gráfico principal del ejercicio;
2. vídeo de muestra con humanos.

No eliminar ni sustituir vídeos existentes.

La integración debe ser backward-compatible: los ejercicios antiguos que solo tengan el campo de vídeo anterior deben seguir funcionando.

## 2.5 Categorías oficiales

Cada ejercicio tiene una categoría principal de este conjunto:

- Calentamiento/activación
- Tecnificación
- Técnico-táctico
- Táctica
- Posesión
- Juego reducido
- Finalización
- Transición
- Coordinación/motricidad
- Preparación física
- Preparación física integrada
- Porteros

No usar `Técnica` como categoría cuando corresponda `Tecnificación`.

## 2.6 Fútbol 7 / Fútbol 11

`Fútbol 7` y `Fútbol 11` son una dimensión/filtro independiente de la categoría principal.

No sustituyen categorías como Finalización, Táctica, Tecnificación, etc.

Regla vigente para los ejercicios importados desde vídeo:
- Fútbol 7: ejercicios con niños y los identificados mediante señales izquierda/derecha o códigos de color como naranja, verde, blanco, etc.
- Fútbol 11: el resto.

Si `data.json` ya contiene `formato_futbol`, respetar ese valor y no recalcularlo arbitrariamente.

## 2.7 “Qué se trabaja”

No copiar automáticamente el objetivo ni un campo antiguo.

Debe salir de la mecánica real del ejercicio.

Usar aproximadamente un máximo de 4 contenidos realmente útiles y distintos.

Evitar duplicados semánticos o etiquetas genéricas que no aporten información.

## 2.8 Terminología

La palabra visible **“chip”** está prohibida en el contenido para entrenadores.

Según el contexto usar:
- picar el balón;
- balón picado;
- pase picado;
- remate picado.

No llamar “chips” a las etiquetas visuales de interfaz.

Usar español de España:
- portero;
- portería;
- cono;
- peto;
- escalera de coordinación;
- valla;
- conducción;
- regate;
- mediapunta cuando proceda.

## 2.9 Convenciones visuales nuevas

Por defecto:
- atacante: azul;
- defensor: rojo;
- portero: morado;
- entrenador: gris;
- cono: naranja salvo que la fuente necesite distinguir colores;
- balón: blanco/negro;
- campo: franjas `#8BC753` y `#84C04D`.

Usar fichas/símbolos simples para táctica, pases, finalización y desplazamientos.

Usar representación corporal más detallada solo cuando el gesto corporal sea realmente necesario para entender el ejercicio.

No numerar visiblemente los ejercicios como “Ejercicio 001”, salvo petición específica.

## 2.10 Integración en la app

Los ejercicios nuevos deben integrarse en la estructura existente de CampoBase, no en una biblioteca paralela.

Deben funcionar, cuando corresponda, en:
- biblioteca/listado;
- búsqueda;
- categorías;
- filtros;
- “Qué se trabaja”;
- vista del ejercicio;
- selección para sesiones;
- sesiones guardadas;
- reproducción del vídeo gráfico;
- reproducción del vídeo humano.

Antes de insertar:
- comprobar duplicado por ID;
- comprobar duplicado por nombre;
- comprobar si ya existe como otra versión.

Si ya existe, no sobrescribir automáticamente.

Las versiones anteriores deben conservarse como respaldo y no aparecer como ejercicios actuales.

## 2.11 Supabase

Supabase es fuente de verdad cuando la app use esos datos.

Al integrar ejercicios:
- añadir sin borrar;
- conservar tablas, columnas e IDs existentes;
- evitar migraciones invasivas;
- mantener compatibilidad con registros antiguos;
- no convertir campos nuevos en obligatorios para datos existentes;
- conservar URLs/rutas ya usadas por la app;
- no eliminar vídeos existentes.

## 2.12 Editor/pizarra: no romper

No modificar sin petición explícita las funciones validadas de:
- mover;
- seleccionar;
- tamaño;
- orientación libre;
- espejo horizontal;
- reflejo vertical;
- giro -90°/+90°;
- duplicar;
- borrar;
- fases;
- deshacer/rehacer;
- guardar/persistencia;
- inversión específica del fondo de red de porterías, cuando exista.

## 2.13 QA obligatorio

Antes de considerar terminado un ejercicio o una importación, comprobar en este orden:

**fuente → preview → primer frame del MP4 → MP4 completo → data.json/ficha**

Todo debe representar el mismo ejercicio.

Además revisar:
- categoría correcta;
- F7/F11 correcto;
- “Qué se trabaja” correcto;
- materiales;
- recorridos;
- balones;
- rotaciones;
- vídeo humano;
- duplicados;
- búsqueda/filtros;
- selección en sesiones;
- persistencia;
- errores nuevos de consola;
- regresión de ejercicios antiguos.

No dar por terminado solo porque compile.

## 2.14 Regla de versiones validadas

Contenido marcado como validado no se modifica silenciosamente.

Si se crea una revisión:
- conservar la versión anterior;
- distinguir claramente la nueva;
- no convertir una versión antigua en activa por accidente.

---

## 3. Documentación

Documentación específica actual:
- Ejercicios: `docs/ejercicios/ESPECIFICACION_EJERCICIOS.md`
- Ejemplos y fuentes: `docs/ejercicios/`

Si se añaden documentos de sesiones, vídeos, Supabase, arquitectura o diseño, deben enlazarse también desde este archivo.

---

# 4. Estado de trabajo actual y reglas de continuidad — 18/09/2026

Esta sección documenta decisiones ya tomadas en conversaciones recientes para que el siguiente agente continúe desde el estado real del proyecto y no vuelva a implementar comportamientos descartados.

## 4.1 Flujo de trabajo obligatorio

- Los cambios funcionales se desarrollan primero en una rama aislada.
- No fusionar cambios funcionales a `main` hasta que el usuario los haya probado y diga expresamente que están validados.
- La rama aislada actual para la Fase 4 es:
  - `fase-4-billing-aislada`
- Antes de fusionar:
  1. comparar la rama con `main`;
  2. revisar exactamente qué archivos cambian;
  3. ejecutar la batería completa de pruebas;
  4. comprobar Supabase si la función depende de base de datos/RLS;
  5. no fusionar si existe una regresión conocida.
- No usar una maqueta como sustituto de la app real. Las validaciones deben hacerse sobre una URL funcional de la aplicación.
- Mantener siempre una URL que el usuario pueda abrir para comprobar el estado de la app.
- No inventar datos, IDs, claves, productos, precios, correos, usuarios ni configuraciones externas.
- Si una integración externa todavía no dispone de credenciales o configuración real, dejarla preparada pero no simular que está operativa.

## 4.2 Principio de preservación

Cualquier agente que continúe el proyecto debe asumir que las funciones ya validadas son patrimonio estable de CampoBase.

No se debe:
- rehacer una función solo porque otra implementación parezca más limpia;
- sustituir datos existentes por valores de ejemplo;
- volver a introducir datos precargados de jugadores;
- eliminar protecciones de datos para simplificar sincronización;
- convertir un proceso validado en otro distinto sin autorización explícita.

Cuando una tarea afecta a varias áreas, modificar solo lo necesario y conservar el resto.

---

# 5. Cuentas, roles, equipo y suscripciones

## 5.1 Roles vigentes

Los roles funcionales que deben mantenerse son:

- `admin`: administrador/titular del equipo;
- `coach`: entrenador titular normal;
- `delegate`: delegado asociado al equipo;
- `owner`: rol legado que se conserva por compatibilidad y se trata como administrador.

En interfaz, la cuenta principal del usuario debe mostrarse como **Administrador**, aunque internamente pueda seguir existiendo `owner` por compatibilidad.

No mezclar estos roles SaaS con el antiguo rol local por PIN de partido.

## 5.2 Un equipo por cuenta principal

Cada cuenta principal de entrenador/administrador posee un único equipo.

Reglas:
- no permitir crear varios equipos desde la misma cuenta principal;
- no permitir que una cuenta de delegado cree equipos;
- el delegado comparte exactamente el mismo equipo y los mismos datos deportivos;
- no crear una plantilla separada para el delegado;
- no duplicar jugadores, partidos, sesiones o configuraciones por crear un delegado.

La relación de equipo debe resolverse en servidor/Supabase, no únicamente con lógica visual.

## 5.3 Cuenta de delegado

Cada equipo puede tener como máximo **una cuenta de delegado** asociada.

El delegado:
- usa su propio correo y contraseña;
- queda asociado al equipo del entrenador titular;
- no crea un equipo nuevo;
- no puede pertenecer simultáneamente a otro equipo desde esta relación;
- hereda el acceso de suscripción del equipo;
- no gestiona pagos, promociones ni la suscripción;
- no entra en Ajustes;
- no puede cambiar permisos;
- no puede crear más cuentas/equipos desde la interfaz de delegado.

El entrenador/administrador configura desde Ajustes qué vistas puede usar el delegado.

La vista base obligatoria es:
- `delegado`

Vistas adicionales configurables:
- `hoy`
- `plantilla`
- `cuerpo-tecnico`
- `asistencia`
- `convocatorias`
- `preparacion`
- `partido`
- `calendario`
- `sesiones`
- `ejercicios`
- `tacticas`

`ajustes` no debe ser concedible al delegado.

La restricción debe existir también en servidor/RLS o funciones seguras cuando afecte a datos, no solo ocultando botones.

## 5.4 Suscripciones / Fase 4

La Fase 4 se está desarrollando en `fase-4-billing-aislada`.

Reglas validadas de arquitectura:
- prueba Pro: 14 días, gestionada por servidor;
- plan mensual: 9,99 €/mes;
- plan anual: 79 €/año;
- códigos de regalo/descuento se validan en servidor;
- no usar `localStorage` como autoridad de suscripción;
- no crear pagos simulados;
- no inventar IDs de Stripe;
- Stripe Checkout y el webhook deben trabajar mediante Edge Functions;
- la cuenta administrador/owner principal tiene acceso Pro vitalicio;
- el delegado hereda la suscripción del titular;
- una suscripción caducada debe bloquear el acceso SaaS a los datos protegidos, no solo mostrar un modal.

El estado de pago real solo debe considerarse operativo cuando Stripe esté conectado y configurado con claves, precios y webhook reales.

---

# 6. Fichas de jugadores — protección obligatoria

Esta sección es crítica. Ya se han producido pérdidas/sobrescrituras de datos personales de jugadores y no deben repetirse.

## 6.1 Datos que nunca se inventan

No inventar ni completar automáticamente:
- nombre;
- dorsal;
- posiciones;
- pierna dominante;
- notas;
- nombre del padre;
- teléfono del padre;
- nombre de la madre;
- teléfono de la madre;
- foto;
- cualquier otro dato personal del jugador.

Si un dato no está respaldado por la ficha real, una copia anterior comprobada o una entrada explícita del usuario, debe quedarse vacío.

No reutilizar datos de otro jugador con nombre parecido.

## 6.2 Edición manual como única autoridad de la ficha

Los campos personales de una ficha de jugador solo deben cambiar cuando el usuario entra en **Editar jugador** y guarda expresamente esa ficha.

Una operación automática de:
- sincronización;
- estadísticas;
- partidos;
- asistencias;
- convocatorias;
- sesiones;
- migraciones;
- refresco;
- cambio de dispositivo;
- actualización de la PWA;

no debe cambiar esos campos personales.

La app dispone de una ruta específica de guardado manual de ficha (`putPlayerProfile` o equivalente). No sustituirla por escrituras genéricas que puedan sobrescribir campos personales.

## 6.3 Prohibido reintroducir plantillas precargadas

La antigua precarga automática de nombres/dorsales/contactos fue eliminada.

No reintroducir:
- `OFFICIAL_SQUAD_DATA` con jugadores reales;
- seeds que creen jugadores automáticamente;
- migraciones que rellenen nombres, dorsales, posiciones o padres;
- datos de muestra sobre una cuenta real.

Una cuenta nueva debe empezar con plantilla vacía salvo importación explícita y controlada por el usuario.

## 6.4 Protección de sincronización

Las escrituras parciales de una ficha no deben borrar campos existentes.

La protección existe en dos niveles y ambos deben mantenerse:
1. aplicación/IndexedDB;
2. Supabase.

Si una versión remota antigua llega sin algunos campos personales, no debe vaciar los campos locales válidos.

Si una edición manual envía explícitamente un nuevo valor, ese valor sí puede sustituir al anterior.

## 6.5 Historial de fichas

Supabase dispone de historial/auditoría de cambios de jugadores.

Antes de modificar o borrar una ficha se conserva la versión anterior para recuperación.

No eliminar esta protección sin una migración equivalente y validada.

## 6.6 Dorsales

- Dos jugadores activos del mismo equipo no pueden tener el mismo dorsal.
- Si se elimina un jugador, su dorsal vuelve a quedar disponible.
- No asignar dorsales automáticamente.
- No cambiar dorsales durante cálculos de estadísticas o sincronización.

## 6.7 Orden alfabético

Cuando el orden no tenga significado táctico, los jugadores deben mostrarse por nombre en orden alfabético.

Aplica a:
- Plantilla;
- Asistencia;
- selectores normales de jugadores;
- listados equivalentes;
- futuras altas.

No forzar orden alfabético en vistas donde el orden representa:
- posiciones;
- titulares/suplentes;
- sustituciones;
- orden táctico;
- orden de juego.

---

# 7. Estadísticas de jugadores — siempre derivadas de los datos reales

Las fichas de estadísticas deben reflejar el estado actual de partidos, convocatorias y asistencias.

Regla central:

**si se edita o se borra el dato de origen, la estadística derivada debe recalcularse inmediatamente.**

## 7.1 Partidos

Al editar o borrar un partido deben recalcularse los datos relacionados del jugador.

Incluye:
- resultado;
- goles;
- minutos;
- amarillas;
- rojas;
- lesiones;
- incidencias;
- puntuaciones;
- convocatoria;
- asistencia del partido;
- pretemporada vs liga;
- cualquier otro total derivado.

Si un partido cambia de competición/tipo, las estadísticas deben moverse al bloque correcto.

Si un partido se elimina, sus aportaciones deben dejar de existir en las estadísticas.

## 7.2 Entrenamientos y asistencia

Si se edita una asistencia:
- actualizar presentes;
- actualizar llegadas tarde;
- actualizar ausencias.

Si se borra una asistencia:
- eliminar su efecto de las fichas.

Si se borra una sesión de entrenamiento:
- borrar también la asistencia vinculada a esa sesión;
- eliminar todo efecto estadístico de ese día;
- no dejar registros huérfanos.

No conservar ausencias de una sesión que ya no existe.

## 7.3 Convocatorias

Si se edita o elimina una convocatoria:
- recalcular convocatorias;
- recalcular rotaciones o contadores derivados;
- no dejar estadísticas asociadas a una convocatoria inexistente.

## 7.4 No guardar totales derivados como sustituto del origen

Siempre que sea posible, goles, tarjetas, minutos, asistencias y contadores deben derivarse de los eventos/registros de origen.

No convertir un total calculado en la única fuente de verdad si existe el evento original.

---

# 8. Sesiones de entrenamiento — estado y asistencia

Guardar o editar la asistencia de una sesión **no finaliza la sesión**.

El entrenador puede pasar asistencia:
- el mismo día;
- días antes;
- anticipando jugadores que sabe que faltarán;
- anotando retrasos previstos o ausencias conocidas.

La sesión debe seguir visible y editable hasta que el entrenador pulse expresamente **Realizado**.

Reglas:
- asistencia guardada ≠ sesión finalizada;
- una sesión solo pasa a finalizada/archivada mediante la acción explícita **Realizado**;
- borrar la sesión elimina también su asistencia y sus efectos estadísticos;
- editar la fecha de la sesión debe mantener correctamente vinculada su asistencia;
- no cerrar automáticamente una sesión por tener asistencia completa.

Los partidos mantienen su flujo independiente; no aplicarles automáticamente esta regla de sesiones.

---

# 9. Acceso local, SaaS y dispositivo

Mantener el **Acceso local con PIN** como alternativa validada.

Para cuentas SaaS:
- puede recordarse una cuenta en un dispositivo;
- después puede pedirse solo un PIN de dispositivo mientras la sesión segura siga siendo válida;
- la cuenta recordada es específica de ese dispositivo;
- no guardar contraseñas en texto plano;
- no bloquear toda la app si una sesión SaaS caduca: debe seguir siendo posible usar el flujo de acceso autorizado correspondiente;
- la verificación y recuperación de correo deben redirigir a la URL real de la app, nunca a `localhost`.

No escribir correos personales concretos del usuario como constantes públicas en el repositorio.

---

# 10. Supabase — reglas adicionales actuales

- RLS es obligatoria para separar cuentas/equipos.
- Un usuario no debe poder leer o escribir datos de otro equipo.
- El delegado puede acceder a los datos de su equipo mediante la relación de membresía, no mediante copia de datos.
- Las funciones administrativas deben validar el rol en servidor.
- El cliente nunca debe poder autopromocionarse a `admin`/`owner`.
- Las promociones, suscripciones, invitaciones y permisos deben validarse en servidor.
- No usar políticas permisivas `using (true)` para datos SaaS reales.
- No ejecutar migraciones destructivas sobre datos deportivos existentes.
- Antes de tocar tablas de jugadores, partidos, asistencias, convocatorias o configuración, comprobar recuentos y preservar los registros existentes.
- Cuando se pruebe una migración con datos reales, usar transacción/rollback siempre que sea posible.

---

# 11. Regla final para futuros agentes

Antes de modificar cualquier pieza relacionada con jugadores, estadísticas, sesiones, cuentas, delegados, pagos o Supabase:

1. leer esta sección completa;
2. revisar el comportamiento actual en código;
3. revisar los datos reales afectados;
4. implementar en rama aislada si es un cambio funcional;
5. probar la regresión exacta que motivó la regla;
6. no borrar ni reemplazar silenciosamente una protección existente.

Si el usuario dice que algo ya estaba validado, asumir que debe preservarse salvo petición explícita de cambio.

---

# 12. Mantenimiento de AGENTS.md — norma de continuidad

Esta norma aplica a cualquier chat o agente que añada instrucciones permanentes al proyecto.

- `AGENTS.md` es un documento acumulativo compartido entre distintos trabajos.
- Cada agente debe añadir su parte bajo títulos claros y fechables cuando sea útil.
- No borrar contenido existente escrito por otros chats/agentes.
- No reescribir, resumir ni “limpiar” secciones ajenas solo por estilo.
- No mover secciones antiguas si no es estrictamente necesario.
- Si una norma nueva sustituye a otra antigua, añadir la nueva norma y explicar expresamente qué comportamiento queda superado, sin eliminar el histórico.
- Las reglas nuevas deben escribirse de forma operativa: qué hacer, qué no hacer y cómo comprobarlo.
- Las correcciones de errores importantes deben quedar documentadas para que otro agente no vuelva a introducir el mismo fallo.

---

# 13. Ajustes — Cuenta de delegado debe ser una sección principal y completa

La gestión del delegado no puede quedar reducida a un texto informativo pequeño.

En **Ajustes** debe existir una sección grande, claramente visible, titulada:

**Cuenta de delegado**

Debe explicar que:
- el delegado usa su propia cuenta;
- comparte el mismo equipo;
- no crea otro equipo;
- solo accede a las vistas autorizadas;
- la cuenta principal controla esos permisos.

La sección debe mostrar siempre de forma visual la lista de permisos/vistas disponibles.

Si todavía no existe delegado:
- mostrar campos de nombre y correo;
- mostrar todas las vistas configurables;
- marcar la vista base de delegado;
- permitir elegir las vistas antes de enviar la invitación.

Si ya existe delegado:
- mostrar identidad/correo del delegado;
- mostrar los permisos actuales;
- permitir ampliar o reducir los permisos;
- guardar los cambios desde la misma sección.

Si la página se visualiza sin una sesión administradora válida:
- no ocultar toda la sección;
- mostrar la estructura y los permisos en modo informativo/no editable;
- indicar que para cambiar esos permisos hay que entrar como Administrador/Entrenador.

`Ajustes` nunca es un permiso concedible al delegado.

La sección debe ocupar el ancho disponible y tener jerarquía visual suficiente para no confundirse con una nota secundaria.

---

# 14. Planes, registro y pago — orden correcto del flujo

Los planes no pueden depender únicamente de entrar primero dentro de la aplicación.

Regla de producto:
- una persona debe poder conocer precios y funciones **antes de registrarse**;
- la pantalla de acceso/registro debe incluir una entrada visible a **Planes**;
- durante el registro debe quedar claro qué planes existen y qué incluye CampoBase;
- después de identificar la cuenta, si no existe acceso válido, se debe mostrar la elección de plan antes de permitir entrar a los datos protegidos;
- un usuario con prueba activa puede continuar con su prueba, pero debe poder ver y contratar un plan sin entrar primero en Ajustes;
- una prueba o suscripción caducada no debe permitir saltarse el pago entrando por una pestaña interna;
- el delegado nunca contrata: hereda el plan del titular del equipo.

El pago real necesita una cuenta identificada para asociar correctamente la suscripción al equipo. Por tanto:
- los planes y precios se muestran públicamente antes del registro;
- Stripe Checkout se inicia después de que exista una cuenta autenticada;
- no pedir al usuario que “entre en la app y luego busque Planes” como único camino de contratación.

## 14.1 Funciones que deben mostrarse en Planes

La página/pantalla de Planes debe explicar que los planes de pago incluyen el conjunto funcional de CampoBase, no solo mostrar un precio.

Como mínimo debe reflejar de forma comprensible:
- Inicio / resumen del día;
- Plantilla y fichas de jugadores;
- estadísticas individuales;
- cuerpo técnico;
- control de asistencia;
- convocatorias;
- preparación de partido;
- alineaciones y reparto;
- partido en vivo;
- cronómetro, cambios e incidencias;
- calendario y resultados;
- sesiones de entrenamiento;
- biblioteca de ejercicios;
- vídeos/demostraciones de ejercicios cuando existan;
- pizarra táctica;
- cuenta de delegado con permisos configurables;
- sincronización en nube;
- acceso desde varios dispositivos;
- copia de seguridad y recuperación previstas por la app;
- personalización de equipo/club;
- soporte de códigos de regalo o descuento cuando aplique.

Mensual y anual pueden incluir las mismas funciones; la diferencia puede ser únicamente el periodo y el precio, salvo que el usuario decida otra cosa.

## 14.2 Precios vigentes mientras no exista una instrucción posterior

- Plan mensual: **9,99 €/mes**.
- Plan anual: **79 €/año**.
- Prueba Pro inicial: **14 días**, si el flujo de alta vigente la mantiene.
- Cuenta Administrador/owner del proyecto: **Pro vitalicio**.

---

# 15. Regla comercial de acceso — prueba, código gratuito o pago

Esta regla es obligatoria y prevalece sobre cualquier comportamiento anterior que concediera acceso únicamente por ser Administrador, owner, entrenador o por tener una cuenta creada.

Una cuenta solo puede entrar a los datos del equipo si cumple **al menos una** de estas condiciones:

1. tiene una **prueba gratuita activa**;
2. tiene un **código gratuito/regalo válido** todavía vigente;
3. tiene una **suscripción pagada activa** mensual o anual.

Si no cumple ninguna:
- no permitir entrar a los datos del equipo;
- no permitir saltarse el bloqueo mediante una pestaña interna;
- no conceder acceso por el rol `admin`, `owner` o `coach`;
- no conceder acceso por haber creado/verificado la cuenta;
- no considerar un descuento pendiente como acceso gratuito;
- no considerar un código caducado como acceso;
- no permitir que el PIN local antiguo de una cuenta SaaS sustituya esta comprobación.

La cuenta Administrador del proyecto puede seguir teniendo Pro vitalicio, pero debe estar representado en la suscripción como `gift_free`/regalo vitalicio; no debe depender de un bypass por rol.

La cuenta de delegado:
- no compra un plan propio;
- hereda el acceso comercial del titular del mismo equipo;
- si el titular pierde el acceso por caducidad, el delegado también queda bloqueado.

## 15.1 Texto de producto claro

No usar explicaciones ambiguas como:

“la prueba se mantiene mientras siga vigente en el alta”.

Explicar de forma directa:

- **Creas tu cuenta.**
- **Tienes 14 días gratis.**
- **Después necesitas un plan mensual/anual o un código gratuito válido.**
- **Sin prueba activa, código gratuito válido o suscripción pagada, no puedes entrar a los datos del equipo.**

## 15.2 Planes deben ser visuales y mostrar todas las funciones

La pantalla de Planes debe ser visual, no una lista técnica pequeña.

Debe agrupar las funciones en bloques claros, como mínimo:

### Equipo y jugadores
- Inicio / resumen del día;
- Plantilla;
- fichas de jugadores;
- estadísticas individuales;
- cuerpo técnico;
- asistencia;
- cuenta de delegado con permisos.

### Partidos
- convocatorias;
- reparto de minutos;
- preparación;
- alineaciones;
- partido en vivo;
- cronómetro;
- cambios;
- goles;
- tarjetas;
- lesiones;
- incidencias;
- puntuaciones;
- calendario;
- resultados;
- liga y pretemporada.

### Entrenamientos
- sesiones;
- asistencia por sesión;
- biblioteca de ejercicios;
- búsqueda y filtros;
- vídeos/demostraciones;
- planificación por bloques;
- materiales;
- pizarra táctica.

### Cuenta, nube y seguridad
- sincronización en nube;
- varios dispositivos;
- copias/recuperación;
- personalización de equipo/club;
- escudo, colores y tema;
- PIN de dispositivo cuando proceda;
- códigos de regalo;
- códigos de descuento.

Mensual y anual incluyen las mismas funciones mientras no haya una instrucción posterior que diga lo contrario.

La elección de Planes debe poder verse **antes del registro**, y después de identificarse la cuenta debe comprobarse el acceso antes de mostrar los datos del equipo.

