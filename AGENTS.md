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

## 2.3.1 Orden obligatorio de visualización en ejercicios del nuevo formato

Tanto en **Vista rápida/reducida** como en **Vista completa/ampliada**, los ejercicios del nuevo formato deben mostrar los medios en este orden exacto:

1. **Preview**: `preview.png`, igual que las portadas del resto de la biblioteca.
2. **MP4 gráfico del ejercicio**: `ejercicio.mp4`, con las fichas/animación del ejercicio.
3. **Vídeo de muestra con humanos**: `video_muestra_humanos.mp4`.

Reglas:
- la preview nunca se sustituye por el primer fotograma del vídeo humano;
- el vídeo humano nunca ocupa el lugar del MP4 gráfico;
- el MP4 gráfico nunca sustituye a la preview de la tarjeta;
- los tres medios deben mantener ese mismo orden en vista reducida y vista completa;
- si falta temporalmente un asset, mostrar un placeholder neutro y no reutilizar otro medio como si fuera ese asset;
- antes de publicar, comprobar que `preview.png`, `ejercicio.mp4` y `video_muestra_humanos.mp4` existen realmente en Storage y responden correctamente.

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

## 2.10.1 Ejercicios creados por el entrenador — “Mis ejercicios”

Los ejercicios creados manualmente desde **+ Ejercicio** son contenido personal del entrenador y deben persistir.

Reglas obligatorias:
- al guardar un ejercicio nuevo, debe quedar marcado como ejercicio creado por el usuario y no confundirse con favoritos/caché del catálogo validado;
- después de guardar, debe aparecer en la pestaña **Mis ejercicios**;
- recargar, sincronizar o reiniciar la PWA no puede eliminarlo ni hacerlo desaparecer de la biblioteca;
- la limpieza de ejercicios legacy no puede borrar registros marcados como creados por el usuario;
- los ejercicios personales deben poder editarse y borrarse mediante su flujo normal;
- deben estar disponibles para añadirlos a sesiones;
- en el selector de ejercicios de **Sesiones**, el desplegable **Categoría** debe incluir la opción **Mis ejercicios**;
- la opción **Mis ejercicios** filtra solo ejercicios personales, sin mezclar los favoritos del catálogo validado;
- categoría, formato F7/F11, material y dificultad del ejercicio personal deben conservarse para los filtros de sesiones.

Comprobar siempre el flujo completo:
**+ Ejercicio → Guardar → Mis ejercicios → recargar → sigue visible → Sesiones → Categoría → Mis ejercicios → añadir a sesión**.

## 2.10.2 Integración aplicada en la app — 18/09/2026

Integración funcional fusionada en `main` mediante el PR #46, commit de merge:
`4d315a05fff9b5632ffd2f0fa332fb11335c7d23`.

Estado que debe conservarse:

- Los ejercicios personales creados desde **+ Ejercicio** persisten como registros propios del entrenador.
- Al guardarlos aparecen en **Mis ejercicios** y siguen visibles después de recargar/sincronizar.
- **Mis ejercicios** está disponible también dentro del desplegable **Categoría** del selector de ejercicios de **Sesiones**.
- Los ejercicios personales conservan categoría, formato F7/F11, material y dificultad para poder filtrarlos y añadirlos a una sesión.
- Crear y editar sesiones utiliza el mismo builder y debe conservar ID de sesión, fecha de creación, bloques, orden, minutos, notas y ejercicios seleccionados.
- Existe prueba de regresión específica para crear y editar una sesión que contiene un ejercicio personal.
- Para los ejercicios del nuevo formato, el orden visual obligatorio sigue siendo:
  1. preview;
  2. MP4 gráfico;
  3. vídeo humano.
- El vídeo humano nunca se utiliza como falsa preview.
- Si el `preview.png` todavía no está publicado, la interfaz evita la URL rota y genera una portada estática a partir del **MP4 gráfico**, nunca del vídeo humano.
- En el selector de Sesiones se mantiene el mismo criterio de preview gráfica.
- No se han eliminado ejercicios, sesiones, vídeos ni datos existentes y no se ha modificado la lógica validada del editor/pizarra.
- La verificación automática `CampoBase verify` del cambio funcional pasó correctamente antes y después de fusionar.

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

## 8.1 Crear y editar sesiones

El entrenador debe poder crear y editar sesiones de entrenamiento desde la interfaz normal.

Reglas:
- **+ Nueva sesión** abre el constructor de sesión vacío;
- **Editar** desde la tarjeta de una sesión abre el mismo constructor con todos sus datos existentes;
- **Editar sesión** desde el detalle de una sesión debe hacer lo mismo;
- editar conserva el mismo ID y fecha de creación de la sesión;
- al guardar una edición se actualiza la sesión existente, no se crea un duplicado;
- nombre, fecha, hora, campo, duración objetivo, bloques, duración de cada bloque, notas y material deben quedar editables;
- los ejercicios personales de **Mis ejercicios** se pueden añadir exactamente igual que los del catálogo;
- la clasificación de bloques debe reconocer las categorías actuales, incluida `Calentamiento/activación` como calentamiento y `Juego reducido` como juego final;
- al guardar, la interfaz debe confirmar si la sesión se ha creado o actualizado;
- no romper la asistencia vinculada ni crear registros huérfanos al editar fecha/datos de una sesión.

Antes de dar este flujo por terminado, probar:
**crear → guardar → abrir → editar → guardar → recargar → comprobar que existe una sola sesión con los cambios**.

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

---

# 16. REGLAS — SUBIR VÍDEOS Y DÓNDE

Esta sección pertenece únicamente al área de vídeos/almacenamiento. Cualquier agente al que Miguel asigne una tarea de vídeos debe leer las reglas generales de convivencia y esta sección. No debe editar, resumir, reordenar ni actualizar las reglas de ejercicios, interfaz, jugadores, sesiones, pagos u otras áreas salvo petición explícita de Miguel.

## 16.1 Requisito económico obligatorio: 0 € y sin sorpresas

Para el almacenamiento y entrega de vídeos de CampoBase, Miguel exige **coste máximo real de 0 €**.

- No usar servicios con facturación automática por exceso.
- No activar Pay As You Go, overage billing, auto-recharge o equivalentes.
- No añadir una tarjeta para habilitar consumo facturable.
- Si un servicio gratuito alcanza un límite, se prefiere limitación/suspensión antes que una factura.
- No cambiar de proveedor sin autorización explícita de Miguel.

## 16.2 Destino vigente: GitHub Releases

El destino vigente de los MP4 pesados de CampoBase es **GitHub Releases del repositorio `Miguelperezh/campobase`**.

Release de producción:
- tag: `campobase-videos-v1`;
- nombre: `CampoBase video assets v1`;
- estado: release estable, no prerelease;
- migración inicial completada el 18/09/2026;
- 323/323 MP4 migrados;
- 316.509.123 bytes verificados en origen y destino.

La aplicación de producción ya resuelve los MP4 migrados hacia este release mediante `resolveHostedVideoUrl()` en `js/ejercicio-videos.js`.

Validación realizada antes de activar producción:
- descarga completa;
- HTTP Range `206`;
- `Accept-Ranges: bytes`;
- reproducción;
- seek/avance/retroceso;
- Chromium;
- WebKit;
- smoke test contra la web de producción publicada en GitHub Pages;
- batería `CampoBase verify` en verde.

Cloudflare R2 y Tigris NO son destinos vigentes. No reactivar esos caminos salvo petición expresa de Miguel.

GitHub Releases no se tratará como un CDN con SLA. GitHub puede limitar alojamiento/actividad si considera el uso de ancho de banda significativamente excesivo. Si algún día el servicio deja de ser adecuado, no cambiar de proveedor por iniciativa propia: documentar el problema y esperar autorización de Miguel.

## 16.3 Qué se guarda en cada sitio

- **GitHub/código:** definición oficial del ejercicio y código de CampoBase.
- **GitHub Releases:** archivos MP4 pesados.
- **Supabase:** datos sincronizados de CampoBase y metadata que la aplicación necesite compartir.
- **Sesiones:** referencias mediante `exerciseId`; nunca incrustar MP4 ni blobs.

Los MP4 originales que aún permanezcan en Supabase Storage son únicamente rollback de seguridad de la migración histórica. No deben considerarse el destino para nuevos vídeos y no deben borrarse sin autorización expresa de Miguel.

Una tarea de vídeos no autoriza a mover jugadores, partidos, sesiones, estadísticas, Auth, pagos, interfaz ni otros datos.

## 16.4 Acceso para IA y agentes

La identidad del agente no importa. Importa la función asignada y el permiso concedido.

Un agente autorizado para vídeos puede gestionar los assets mediante GitHub API/CLI con los permisos concedidos al repositorio.

- No pedir a Miguel que suba manualmente vídeos si el agente dispone de acceso autorizado.
- Nunca guardar tokens/secretos en Git, frontend, documentación o logs.
- Usar permisos mínimos.
- No borrar un vídeo existente salvo petición expresa y con rollback/validación.
- Si el entorno concreto del agente no dispone de una acción capaz de subir binarios a Releases, debe usar un entorno autorizado que sí disponga de GitHub API/CLI; no debe volver a Supabase ni cambiar de proveedor por su cuenta.

## 16.5 Nombres, rutas y asociación

Los assets de GitHub Releases son archivos planos, no carpetas.

Regla de nombre para un objeto cuya ruta lógica sea, por ejemplo:
`library-v2-preview/pdf150-022/ejercicio.mp4`

Asset en Releases:
`library-v2-preview__pdf150-022__ejercicio.mp4`

Regla:
- convertir cada `/` de la ruta lógica en `__`;
- no cambiar `exerciseId`;
- usar nombres de asset estables y únicos;
- mantener una correspondencia determinista entre `exerciseId`, tipo de vídeo y asset;
- no sobrescribir silenciosamente otro ejercicio;
- mantener separadas las funciones de `ejercicio.mp4` y vídeo humano/de muestra;
- no fabricar una URL de Release para una ruta que nunca haya sido subida realmente.

Durante la migración se detectaron referencias `CAMPOBASE-VIDEO-.../ejercicio.mp4` que no existían físicamente en Storage. El resolver está diseñado para NO convertir esas referencias en assets inexistentes. Ningún agente debe “arreglarlas” inventando un archivo o cambiando el ejercicio sin una tarea específica de Miguel.

## 16.6 Migración y rollback

La migración Supabase Storage → GitHub Releases está completada en producción.

Para cualquier migración futura, el orden obligatorio sigue siendo:
1. copiar;
2. verificar descarga completa y tamaño;
3. verificar HTTP Range/206 para seek;
4. comprobar reproducción;
5. probar en rama aislada;
6. probar Chromium/WebKit y móvil/escritorio cuando corresponda;
7. cambiar producción solo después de validar;
8. mantener la fuente anterior como rollback hasta autorización expresa para borrarla.

No hacer una migración destructiva directa.

## 16.7 Nuevos vídeos futuros

Cuando Miguel pida a una IA/agente crear o integrar un ejercicio con vídeo:

1. determinar el `exerciseId` correcto según las reglas de ejercicios;
2. preparar la ruta lógica estable del vídeo;
3. convertir la ruta lógica al nombre plano del asset sustituyendo `/` por `__`;
4. subir el MP4 al release `campobase-videos-v1`;
5. comprobar que el asset existe y que su tamaño es correcto;
6. comprobar reproducción y seek;
7. actualizar únicamente la referencia necesaria del ejercicio/metadata;
8. comprobar que CampoBase carga el vídeo correcto;
9. ejecutar las pruebas relacionadas antes de fusionar.

URL pública de un asset:
`https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/<NOMBRE_ASSET>`

- No mandar a Miguel a realizar manualmente la subida si el agente dispone de acceso GitHub autorizado.
- No guardar nuevos MP4 en Supabase Storage como solución alternativa salvo petición explícita.
- No incrustar vídeos binarios en la base de datos.
- No meter MP4 pesados como archivos normales del repositorio cuando su destino corresponde a Releases.

## 16.8 Cambios prohibidos desde una tarea de vídeos

Una tarea de vídeos NO autoriza a:
- modificar reglas de ejercicios;
- modificar interfaz/UX;
- cambiar categorías;
- cambiar jugadores;
- cambiar sesiones;
- cambiar estadísticas;
- cambiar pagos o autenticación;
- refactorizar otras áreas;
- actualizar otras secciones de AGENTS.md.

Solo se toca otra área cuando Miguel lo pida expresamente.

## 16.9 Validación mínima

Antes de declarar terminado cualquier cambio de vídeo:
- URL remota válida;
- asset realmente existente;
- tamaño correcto;
- reproducción completa;
- seek/avance/retroceso correcto;
- asociación correcta ejercicio-vídeo;
- prueba de navegador relevante;
- pruebas del proyecto correspondientes;
- cero vídeos faltantes o rotos.

---

# 16. UI de Planes y Delegado — legibilidad obligatoria

Estas reglas nacen de una regresión visual real detectada en validación.

## 16.1 Planes

La pantalla/modal de Planes debe poder leerse sin solapes.

No permitir:
- tarjetas con columnas tan estrechas que las palabras se monten unas sobre otras;
- grids anidados de dos columnas dentro de tarjetas demasiado pequeñas;
- diálogos estrechos para listas largas de funciones;
- textos cortados lateralmente.

Reglas:
- el diálogo de Planes debe usar un ancho amplio en escritorio;
- las categorías de funciones pueden mostrarse 2x2 solo si cada tarjeta mantiene ancho suficiente;
- al reducir el ancho, las categorías deben pasar a una sola columna;
- el texto debe poder envolver sin invadir otra columna;
- validar visualmente también con una ventana del navegador reducida o con barra lateral abierta;
- el bloque de acceso debe ser legible y no comprimirse.

## 16.2 Cuenta de delegado

La sección **Cuenta de delegado** debe ser uno de los bloques principales de Ajustes.

Debe:
- ocupar todo el ancho de la rejilla;
- mostrar claramente nombre/correo de la cuenta asociada;
- mostrar siempre el bloque de permisos;
- mostrar todas las vistas configurables;
- usar tarjetas/checks suficientemente grandes;
- no limitarse a un párrafo informativo;
- seguir siendo comprensible incluso antes de iniciar sesión, mostrando la estructura en modo deshabilitado;
- al iniciar sesión como Administrador/Entrenador, convertir esa misma estructura en editable.

La lista de permisos no puede quedar escondida detrás de una acción secundaria ni depender de que el usuario adivine dónde configurarla.

## 16.3 Validación visual

Antes de dar por terminada una modificación visual:
1. comprobar que no hay solapes;
2. comprobar escritorio y ancho reducido;
3. comprobar que títulos, botones, checks y textos se leen completos;
4. comprobar específicamente Planes y Cuenta de delegado si se han tocado;
5. no afirmar que una interfaz está validada solo porque pase tests de código.

---

# 17. Planes — diseño profesional, texto completo y sin referencias comerciales a “nube”

Esta norma corrige una regresión visual detectada en validación.

## 17.1 El texto nunca puede partirse de forma artificial

En Planes y en cualquier pantalla comercial:
- no usar `overflow-wrap:anywhere` para textos normales;
- no usar reglas que puedan partir palabras por la mitad;
- mantener `word-break: normal`;
- mantener `hyphens: none` salvo petición expresa;
- las tarjetas deben crecer o pasar a una sola columna antes de comprimir el texto;
- en el modal de acceso/registro, las listas de funciones deben ser de una columna si el espacio es limitado;
- la legibilidad tiene prioridad sobre meter más columnas.

Ejemplos que no deben volver a aparecer:
- `Estadístic / as`;
- `configurab / les`;
- `entrenami / entos`;
- cualquier palabra dividida porque la tarjeta sea demasiado estrecha.

## 17.2 Presentación profesional

La pantalla de Planes debe usar:
- jerarquía clara;
- tarjetas amplias;
- títulos cortos;
- listas limpias;
- pasos de acceso en formato vertical legible;
- numeración o iconografía sobria;
- suficiente espacio en blanco.

No usar una cuadrícula de muchas cajas estrechas si perjudica la lectura.

## 17.3 No vender la infraestructura

No mostrar “nube”, “sincronización en la nube” ni lenguaje de infraestructura como argumento comercial en la pantalla de Planes.

Sí pueden mostrarse beneficios concretos para el usuario, por ejemplo:
- acceso desde varios dispositivos;
- aplicación instalable;
- exportar e importar datos;
- personalización;
- PIN de dispositivo;
- códigos de regalo/descuento.

La infraestructura técnica puede seguir existiendo y documentarse en archivos técnicos, pero no debe aparecer como función comercial salvo petición expresa del usuario.

---

# 18. Fase 4 — diseño validado y flujo obligatorio de registro, prueba y pago

**Estado visual validado por el usuario el 18/09/2026.**

El diseño actual de Planes, la presentación de funciones, la regla comercial de acceso y la sección ampliada de Cuenta de delegado se consideran validados. No rehacer su estructura visual sin una petición posterior expresa.

## 18.1 Registro con plan y método de pago

Una cuenta principal nueva no debe obtener acceso solo por registrarse.

Flujo obligatorio:
1. el usuario puede ver Planes antes de registrarse;
2. al crear la cuenta debe elegir plan mensual o anual;
3. después de confirmar/identificar su cuenta debe completar Stripe Checkout y dejar un método de pago;
4. Stripe inicia una prueba gratuita de 14 días;
5. durante esos 14 días no se cobra;
6. mostrar siempre la fecha exacta en la que termina la prueba y comenzaría el primer cobro;
7. el usuario puede cancelar antes de esa fecha y no debe producirse el primer cobro;
8. cuando Stripe confirma la prueba, la cuenta pasa a estado `trial` y obtiene acceso;
9. si no completa Stripe y tampoco dispone de un código gratuito válido, no puede entrar a los datos del equipo.

No confundir:
- **cuenta creada** con **acceso concedido**;
- **plan elegido** con **pago/método de pago configurado**;
- **código de descuento** con **código gratuito**.

## 18.2 Fecha de finalización de la prueba

La fecha de prueba debe proceder del servidor/Supabase y mantenerse alineada con Stripe.

En interfaz debe mostrarse con un texto inequívoco, por ejemplo:

**Prueba gratis hasta el 2 de octubre de 2026. No se te cobrará antes de esa fecha. Puedes cancelar antes de que termine la prueba.**

No usar una fecha inventada ni depender solo del reloj del navegador cuando ya exista una fecha de servidor.

## 18.3 Cancelación

Debe existir una acción real de cancelación cuando ya existe una suscripción Stripe.

Durante la prueba:
- cancelar debe programar la baja al final de la prueba;
- el usuario conserva acceso hasta la fecha de fin;
- no debe producirse el primer cobro.

En una suscripción pagada:
- cancelar debe programar la baja al final del periodo ya pagado;
- el acceso se mantiene hasta la fecha vigente.

La cancelación debe ejecutarse en servidor/Edge Function. Nunca simularla únicamente en la interfaz.

## 18.4 Regla de acceso reforzada

Para cuentas principales nuevas, el estado previo a configurar Stripe debe ser un estado sin acceso (por ejemplo `pending_payment`).

Solo conceden acceso:
- `trial` confirmado;
- `gift_free` válido;
- `active` pagado.

El delegado sigue heredando el acceso del titular y nunca configura un pago propio.

---

# 19. Prueba gratuita — contador visible y cancelación en Ajustes

Esta norma completa el flujo validado de la Fase 4.

## 19.1 Dónde se muestra el contador

Mientras una cuenta principal esté en estado `trial` activo:
- mostrar un contador compacto en **Hoy**;
- mostrar el detalle completo en **Ajustes → Mi cuenta y suscripción**;
- indicar siempre la fecha exacta de fin de prueba;
- no usar un contador de segundos ni una animación invasiva.

Formato recomendado:
- **Quedan X días**
- **Termina el [fecha exacta]**
- **No se te cobrará antes de esa fecha**

El contador se deriva de `suscripciones.expira_en`, no de una fecha inventada en cliente.

## 19.2 Dónde se cancela

La acción **Cancelar renovación** no pertenece a la pantalla comercial de Planes.

Debe estar en:

**Ajustes → Mi cuenta y suscripción**

Durante la prueba, el texto debe ser todavía más claro:

**Cancelar antes del primer cobro**

Al cancelar durante la prueba:
- mantener acceso hasta la fecha de fin;
- marcar `cancel_at_period_end`;
- no realizar el primer cobro;
- mostrar la confirmación y la fecha hasta la que mantiene acceso.

Después de pagar:
- la misma zona de Ajustes permite cancelar la renovación;
- mantiene acceso hasta el final del periodo pagado.

## 19.3 Planes es comercial; Ajustes es gestión

Separación obligatoria:
- **Planes**: precios, funciones, elección mensual/anual, códigos y contratación;
- **Ajustes → Mi cuenta y suscripción**: estado real, fecha de prueba/periodo, contador, renovación y cancelación.

No mezclar ambas responsabilidades en una misma pantalla salvo que sea necesario por el paywall previo al acceso.

---

# 20. Simulación visual de prueba — solo para validación

Existe un modo de simulación visual para poder revisar la experiencia de prueba gratuita antes de conectar Stripe real.

Activación:
- abrir la app de validación con `?simulacion=prueba`.

La simulación debe:
- mostrar una prueba activa ficticia;
- mostrar el contador en **Hoy**;
- mostrar fecha de finalización;
- mostrar **Cancelar antes del primer cobro** en **Ajustes → Mi cuenta y suscripción**;
- permitir simular la cancelación y mostrar el estado posterior;
- indicar claramente que es una simulación;
- no modificar Supabase;
- no modificar Stripe;
- no cancelar ni cambiar la suscripción real;
- no conceder acceso real si la cuenta no lo tiene;
- no usarse como sustituto de una prueba real de Stripe.

La simulación sirve únicamente para validar diseño, textos y flujo de interacción.

---

# 21. Colores y tipografía — siempre vinculados a Ajustes

Esta regla aplica a toda la interfaz, incluida Fase 4, simulaciones, Planes, Ajustes y futuros módulos.

## 21.1 Botones

Los botones principales no pueden llevar un color fijo de marca dentro del CSS.

Deben usar el color de acento configurado en:

**Ajustes → Preferencias visuales y tema**

Variables de referencia:
- `--cb-brand`;
- `--brand`;
- `--cb-accent`.

El texto de un botón principal debe usar el contraste calculado para ese color:
- `--cb-accent-text`.

No volver a imponer un rojo fijo como `--cb-red-600` para botones principales si el usuario ha elegido otro color de acento.

Los botones secundarios deben conservar una apariencia secundaria, pero derivada del color configurado y del fondo actual, manteniendo contraste y legibilidad.

## 21.2 Color de fuente

Textos, títulos, metadatos y componentes nuevos deben heredar el color de fuente configurado por el usuario.

Variables de referencia:
- `--ink`;
- `--cb-font-custom-color`;
- variables `--cb-slate-*` ya sincronizadas por el gestor de tema cuando proceda.

No introducir negro, blanco o gris como color principal de texto si eso impide que la preferencia de fuente de Ajustes se aplique.

Excepción:
- cuando un botón o elemento coloreado necesita contraste, usar el color de contraste calculado (`--cb-accent-text`) en vez del color normal de fuente.

## 21.3 Fase 4 y simulaciones

En:
- Mi cuenta y suscripción;
- Planes;
- contador de prueba;
- simulación de prueba;
- Cuenta de delegado;
- paywall;
- botones de contratación/cancelación;

los colores deben cambiar automáticamente al modificar el tema desde Ajustes.

No crear una paleta propia para Fase 4.

## 21.4 Comprobación

Antes de dar por validado un cambio visual:
1. cambiar el color de acento en Ajustes y comprobar los botones;
2. cambiar el color de fuente y comprobar títulos, párrafos y metadatos;
3. comprobar que el texto de los botones mantiene contraste;
4. comprobar que ningún componente nuevo conserva rojo/negro/blanco fijo salvo que sea semánticamente necesario.

---

# 22. Corrección de seguridad de validaciones — la simulación nunca entra en la app real

Esta norma corrige el enfoque anterior de la sección 20.

La simulación visual de Fase 4 **no debe activarse mediante parámetros dentro de la aplicación real** ni sustituir temporalmente el usuario, la suscripción o el contexto de datos.

Motivo:
- una simulación incrustada en la app puede interferir con autenticación, PIN, sesión y carga de datos;
- una URL de validación en otro origen puede no compartir almacenamiento local con la app real;
- una simulación nunca debe hacer parecer que la aplicación real está vacía o desbloqueada.

Regla vigente:
- la app real conserva siempre su autenticación normal;
- sin sesión válida debe mostrarse un acceso claro por cuenta y mantenerse disponible el acceso local con PIN;
- una cuenta recordada con sesión válida puede seguir usando su PIN de dispositivo;
- la simulación vive en una página independiente, actualmente `simulacion-fase4.html`;
- esa página no importa `app.js`, no conecta con Supabase, no usa datos reales y no modifica ninguna cuenta;
- cualquier botón de pago, cancelación, registro o delegado dentro de esa página es únicamente demostrativo.

La simulación independiente debe usarse para validar:
- registro;
- elección mensual/anual;
- paso visual por Stripe;
- activación de prueba;
- contador;
- cancelación antes del primer cobro;
- Planes;
- Cuenta de delegado y permisos.

Después de validar la interfaz en esa simulación, la funcionalidad real se prueba por separado con autenticación y Stripe reales.

---

# 21. Corrección de la simulación — nunca dentro del runtime real

La simulación visual de prueba **no debe activarse dentro de la app real mediante query params ni sustituir el contexto real de usuario/suscripción**.

Queda prohibido volver a:
- inyectar una suscripción ficticia en `billing-manager.js`;
- sustituir `currentContext` o el usuario real por un usuario simulado;
- usar `?simulacion=prueba` para alterar el runtime real;
- ocultar o saltarse el flujo normal de login/PIN por mostrar una simulación;
- hacer que una simulación pueda afectar carga de datos, sesión, IndexedDB, Supabase o Stripe.

La simulación debe vivir en una página separada:
- `billing-preview.html`

Objetivo:
- enseñar registro + elección de plan;
- enseñar contador de prueba;
- enseñar Ajustes → Mi cuenta y suscripción;
- enseñar cancelación antes del primer cobro;
- permitir validar textos y diseño sin tocar la app ni sus datos.

La app real y la simulación deben estar completamente separadas.

