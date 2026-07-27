import type { FixDefinition, LevelDefinition } from '../types/game'

export const PROJECT = {
  title: 'Zuku Fixed the Birthday',
  repoName: 'zuku-fixed-the-birthday',
  storageKey: 'zuku-fixed-the-birthday:v1',
}

export const PEOPLE = {
  name: 'Nahuel',
  nickname: 'Zuku',
  creator: 'Jonococina',
  age: 26,
}

export const BOOT_SEQUENCE: string[] = [
  'ZUKU // SYSTEM BOOT',
  '',
  'Build status: FAILED',
  'Critical stages detected: 8',
  'Deployment status: BLOCKED',
  '',
  'Developer authorization required.',
]

export const AUTH_SEQUENCE: string[] = [
  'Developer detected: Zuku',
  'Name: Nahuel',
  'Role: Web Developer',
  'Authorization: Approved',
  'Mission: Restore the build',
]

export const NALA_MESSAGES: string[] = [
  'Nala approved this fix.',
  'Tail tests passed.',
  'Build quality: woof.',
  'Bug eliminado. Premio: salto de Nala.',
  'Nala dice que podés seguir.',
  'Good developer. Better human.',
  'Deploy aprobado por Nala.',
  'Todos los tests de cola pasaron.',
]

// Deterministic, balanced correct-answer positions — never "always last", never more
// than a single repeat of the same slot in a row. Computed once at module load (not
// per render), keyed by how many options a fix has, and consumed in call order so the
// distribution is stable across the whole game rather than random per fix.
const BALANCED_POSITIONS_BY_COUNT: Record<number, number[]> = {
  3: [2, 1, 3, 1, 3, 2],
  4: [1, 4, 2, 3, 2, 1, 4, 3, 1, 3, 4, 2],
}
const positionCounters: Record<number, number> = {}

function placeCorrectOption<T>(correct: T, incorrect: T[]): T[] {
  const total = incorrect.length + 1
  const sequence = BALANCED_POSITIONS_BY_COUNT[total]
  let targetIndex: number
  if (sequence) {
    const counter = positionCounters[total] ?? 0
    targetIndex = sequence[counter % sequence.length] - 1
    positionCounters[total] = counter + 1
  } else {
    // No predefined sequence for this option count (e.g. 5) — a single occurrence
    // can't be "unbalanced" on its own, so just avoid the first/last extremes.
    targetIndex = Math.floor((total - 1) / 2)
  }
  const ordered = [...incorrect]
  ordered.splice(targetIndex, 0, correct)
  return ordered
}

function fix(id: string, prompt: string, hint: string, resultLabel: string, options: Array<[string, string, boolean]>): FixDefinition {
  const correctTuple = options.find(([, , correct]) => correct)
  if (!correctTuple) throw new Error(`Fix "${id}" has no correct option defined`)
  const incorrectTuples = options.filter(([, , correct]) => !correct)
  const ordered = placeCorrectOption(correctTuple, incorrectTuples)
  return {
    id,
    prompt,
    hint,
    resultLabel,
    options: ordered.map(([optId, label, correct]) => ({ id: optId, label, correct })),
  }
}

export const LEVELS: LevelDefinition[] = [
  {
    id: 'event-handler',
    index: 1,
    code: 'LEVEL 01 // EVENT HANDLER',
    title: 'Event Handler',
    mission: 'El botón de arranque no responde. Reparar el sistema de eventos para reactivar el build.',
    fixCount: 3,
    completionTitle: 'Event system restored.',
    completionSubtitle: 'First stage online.',
    fixes: [
      fix(
        'listener',
        'El botón no dispara nada. Elegí el listener correcto.',
        'Necesitás escuchar el evento "click" y llamar a la función que arranca el build.',
        'Listener conectado.',
        [
          ['correct', 'button.addEventListener("click", startBuild);', true],
          ['remove', 'button.remove();', false],
          ['destroy', 'destroyProduction();', false],
          ['reload', 'window.location.reload();', false],
          ['hover', 'button.addEventListener("hover", panic);', false],
        ]
      ),
      fix(
        'prevent-default',
        'El formulario recarga la página apenas lo tocás. Falta frenar el comportamiento por defecto.',
        'Es el método estándar del objeto evento para evitar el submit por defecto.',
        'preventDefault aplicado.',
        [
          ['correct', 'event.preventDefault();', true],
          ['birthday', 'event.preventBirthday();', false],
          ['stop', 'event.stopBuild();', false],
          ['formreload', 'form.reload();', false],
        ]
      ),
      fix(
        'connect',
        'Falta conectar el evento final con la función de arranque.',
        'El handler del submit tiene que ejecutar startBuild.',
        'Evento conectado a startBuild().',
        [
          ['correct', 'onSubmit={startBuild}', true],
          ['panic', 'onSubmit={panic}', false],
          ['noop', 'onSubmit={() => {}}', false],
          ['destroy', 'onSubmit={destroyProduction}', false],
        ]
      ),
    ],
  },
  {
    id: 'css-recovery',
    index: 2,
    code: 'LEVEL 02 // CSS RECOVERY',
    title: 'CSS Recovery',
    mission: 'La tarjeta de bienvenida está completamente rota. Reparar los estilos para que vuelva a tener sentido.',
    fixCount: 4,
    completionTitle: 'UI restored.',
    completionSubtitle: 'Now it almost looks intentional.',
    fixes: [
      fix(
        'display',
        'El contenedor no alinea nada.',
        'display: flew no es una propiedad real de CSS.',
        'display: flex aplicado.',
        [
          ['correct', 'display: flex;', true],
          ['flew', 'display: flew;', false],
          ['flexbox', 'display: flexbox;', false],
          ['block', 'display: block;', false],
        ]
      ),
      fix(
        'align',
        'Los elementos quedan pegados a un costado en vez de centrados.',
        '"left" no es un valor válido para align-items.',
        'align-items: center aplicado.',
        [
          ['correct', 'align-items: center;', true],
          ['left', 'align-items: left;', false],
          ['right', 'align-items: right;', false],
          ['start', 'align-items: stretch;', false],
        ]
      ),
      fix(
        'width',
        'La tarjeta ocupa 9000px de ancho y rompe el layout.',
        'Necesitás un ancho responsivo, no un valor fijo enorme.',
        'width: min(420px, 100%) aplicado.',
        [
          ['correct', 'width: min(420px, 100%);', true],
          ['huge', 'width: 9000px;', false],
          ['viewport', 'width: 100vw;', false],
          ['fixed', 'width: 420px !important;', false],
        ]
      ),
      fix(
        'object-fit',
        'La imagen se deforma dentro de su contenedor.',
        '"destroy" no existe como valor de object-fit.',
        'object-fit: cover aplicado.',
        [
          ['correct', 'object-fit: cover;', true],
          ['destroy', 'object-fit: destroy;', false],
          ['fill', 'object-fit: fill;', false],
          ['none', 'object-fit: none;', false],
        ]
      ),
    ],
  },
  {
    id: 'first-match',
    index: 3,
    code: 'LEVEL 03 // FIRST MATCH',
    title: 'First Match',
    mission: 'Restaurar el recuerdo de cómo empezó todo: una cancha de handball.',
    fixCount: 4,
    completionTitle: 'Memoria restaurada.',
    completionSubtitle: 'Acá empezó todo.',
    fixes: [
      fix(
        'left-goal',
        'El arco izquierdo está fuera de la cancha.',
        'Tiene que estar centrado sobre la línea de fondo izquierda, mirando hacia adentro.',
        'Arco izquierdo reposicionado.',
        [
          ['correct', 'leftGoal.position = "left-baseline-center";', true],
          ['midfield', 'leftGoal.position = "midfield-center";', false],
          ['offcourt', 'leftGoal.position = "off-court";', false],
          ['top', 'leftGoal.position = "top-center";', false],
        ]
      ),
      fix(
        'right-goal',
        'El arco derecho y sus áreas están mal ubicados.',
        'Tiene que estar centrado sobre la línea de fondo derecha, con las áreas curvas delante.',
        'Arco derecho y áreas reposicionados.',
        [
          ['correct', 'rightGoal.position = "right-baseline-center";', true],
          ['midfield', 'rightGoal.position = "midfield-center";', false],
          ['offcourt', 'rightGoal.position = "off-court";', false],
          ['bottom', 'rightGoal.position = "bottom-center";', false],
        ]
      ),
      fix(
        'ball-opacity',
        'La pelota es invisible en la cancha.',
        'opacity: 0 significa invisible. Necesitás que se vea.',
        'Pelota visible.',
        [
          ['correct', 'ball.style.opacity = 1;', true],
          ['zero', 'ball.style.opacity = 0;', false],
          ['negative', 'ball.style.opacity = -1;', false],
          ['hidden', 'ball.style.display = "none";', false],
        ]
      ),
      fix(
        'start-match',
        'El evento que arranca el encuentro no está conectado.',
        'Falta enlazar el silbato con la función que inicia el partido.',
        'Partido iniciado.',
        [
          ['correct', 'whistle.addEventListener("click", startMatch);', true],
          ['pause', 'whistle.addEventListener("click", pauseMatch);', false],
          ['cancel', 'whistle.addEventListener("click", cancelMatch);', false],
          ['none', 'whistle.addEventListener("hover", startMatch);', false],
        ]
      ),
    ],
  },
  {
    id: 'rest-protocol',
    index: 4,
    code: 'LEVEL 04 // REST PROTOCOL',
    title: 'Rest Protocol',
    mission: 'Zuku lleva horas programando parado. Activar el protocolo de descanso.',
    fixCount: 5,
    completionTitle: 'Rest protocol enabled.',
    completionSubtitle: 'Even good developers need to sit down.',
    fixes: [
      fix(
        'notifications',
        'Las notificaciones no paran de llegar.',
        'Necesitás pausarlas, no dejarlas infinitas.',
        'Interruptions paused.',
        [
          ['correct', 'notifications = "paused";', true],
          ['infinite', 'notifications = "infinite";', false],
          ['loud', 'notifications = "loud";', false],
          ['null', 'notifications = null;', false],
        ]
      ),
      fix(
        'brightness',
        'El monitor encandila. El brillo está al máximo.',
        'Bajalo a un nivel cómodo para los ojos.',
        'Eye strain reduced.',
        [
          ['correct', 'monitorBrightness = 70;', true],
          ['max', 'monitorBrightness = 180;', false],
          ['over', 'monitorBrightness = 255;', false],
          ['zero', 'monitorBrightness = 0;', false],
        ]
      ),
      fix(
        'autosave',
        'El editor no está guardando nada solo.',
        'autoSave necesita pasar a true.',
        'Workspace safely committed.',
        [
          ['correct', 'autoSave = true;', true],
          ['false', 'autoSave = false;', false],
          ['later', 'autoSave = "later";', false],
          ['undefined', 'autoSave = undefined;', false],
        ]
      ),
      fix(
        'break-timer',
        'No existe ningún temporizador de descanso.',
        'breakTimer tiene que pasar a "enabled".',
        'Break sequence ready.',
        [
          ['correct', 'breakTimer = "enabled";', true],
          ['undefined', 'breakTimer = undefined;', false],
          ['disabled', 'breakTimer = "disabled";', false],
          ['zero', 'breakTimer = 0;', false],
        ]
      ),
      fix(
        'break-complete',
        'Cuando termina el descanso, el sistema sigue eligiendo seguir programando.',
        'onBreakComplete tiene que activar el modo descanso, no seguir codeando.',
        'Work session completed.',
        [
          ['correct', 'onBreakComplete = activateRestMode;', true],
          ['keepCoding', 'onBreakComplete = keepCoding;', false],
          ['ignore', 'onBreakComplete = ignoreBreak;', false],
          ['null', 'onBreakComplete = null;', false],
        ]
      ),
    ],
  },
  {
    id: 'travel-route',
    index: 5,
    code: 'LEVEL 05 // TRAVEL ROUTE',
    title: 'Travel Route',
    mission: 'Reparar la ruta de viaje desde Buenos Aires hasta Japón.',
    fixCount: 4,
    completionTitle: 'Travel build ready.',
    completionSubtitle: 'There are still many places left to deploy.',
    fixes: [
      fix(
        'destination',
        'El destino configurado está mal.',
        'El destino final del viaje es Tokio.',
        'Destino corregido.',
        [
          ['correct', 'trip.destination = "Tokyo";', true],
          ['none', 'trip.destination = "";', false],
          ['moon', 'trip.destination = "Moon";', false],
          ['office', 'trip.destination = "Office";', false],
        ]
      ),
      fix(
        'route-order',
        'Los puntos de la ruta están desordenados.',
        'El orden correcto es Buenos Aires → escala → Tokio.',
        'Ruta ordenada.',
        [
          ['correct', 'route = ["BUE", "stopover", "NRT"];', true],
          ['reverse', 'route = ["NRT", "stopover", "BUE"];', false],
          ['skip', 'route = ["BUE", "NRT", "stopover"];', false],
          ['dup', 'route = ["BUE", "BUE", "NRT"];', false],
        ]
      ),
      fix(
        'passport',
        'El pasaporte figura como no listo.',
        'passportReady necesita pasar a true.',
        'Pasaporte listo.',
        [
          ['correct', 'passportReady = true;', true],
          ['false', 'passportReady = false;', false],
          ['null', 'passportReady = null;', false],
          ['string', 'passportReady = "maybe";', false],
        ]
      ),
      fix(
        'launch',
        'El viaje nunca arranca porque falta conectar la función.',
        'Conectá el botón con launchTrip().',
        'Viaje iniciado.',
        [
          ['correct', 'departButton.onclick = launchTrip;', true],
          ['cancel', 'departButton.onclick = cancelTrip;', false],
          ['none', 'departButton.onclick = null;', false],
          ['wrong', 'departButton.onclick = packSuitcase;', false],
        ]
      ),
    ],
  },
  {
    id: 'production-merge',
    index: 6,
    code: 'LEVEL 06 // PRODUCTION MERGE',
    title: 'Production Merge',
    mission: 'Resolver un conflicto de Git y completar el deploy a producción.',
    fixCount: 4,
    completionTitle: 'Tests passed. Persistence check: 100%. Deployment confidence: high.',
    completionSubtitle: 'TRAIT UNLOCKED: Todo lo que se propone, lo cumple.',
    fixes: [
      fix(
        'merge-conflict',
        '<<<<<<< feature\nconst developer = "Nahuel";\n=======\nconst developer = "Zuku";\n>>>>>>> main\n\nHay un conflicto de merge. Elegí la mejor resolución.',
        'La mejor solución conserva ambos datos, no descarta ninguno.',
        'Conflicto resuelto.',
        [
          ['correct', 'const developer = { name: "Nahuel", alias: "Zuku" };', true],
          ['feature', 'const developer = "Nahuel";', false],
          ['main', 'const developer = "Zuku";', false],
          ['delete', '// const developer eliminado', false],
        ]
      ),
      fix(
        'commit-message',
        'Elegí el mensaje de commit para este fix.',
        'Un buen commit describe qué se restaura, en formato convencional.',
        'Commit creado.',
        [
          ['correct', 'feat: restore Zuku build', true],
          ['vague', 'fixed stuff', false],
          ['versionspam', 'final-final-real-v9', false],
          ['asdf', 'asdf please work', false],
        ]
      ),
      fix(
        'pipeline',
        'Falta correr el pipeline de tests antes de mergear.',
        'Los tests tienen que ejecutarse, no saltearse.',
        'Pipeline ejecutado.',
        [
          ['correct', 'pipeline.run(["build", "test", "deploy"]);', true],
          ['skip', 'pipeline.skip(["test"]);', false],
          ['ignore', 'pipeline.ignoreFailures = true;', false],
          ['delete', 'pipeline.steps = [];', false],
        ]
      ),
      fix(
        'deploy',
        'Confirmá el deploy final a producción.',
        'El deploy tiene que apuntar a producción, no a staging ni cancelarse.',
        'Deploy a producción confirmado.',
        [
          ['correct', 'deploy.target("production");', true],
          ['staging', 'deploy.target("staging");', false],
          ['rollback', 'deploy.rollback();', false],
          ['cancel', 'deploy.cancel();', false],
        ]
      ),
    ],
  },
  {
    id: 'project-r33',
    index: 7,
    code: 'LEVEL 07 // PROJECT R33',
    title: 'Project R33',
    mission: 'Abrir el regalo tecnológico y construir el auto pieza por pieza.',
    fixCount: 5,
    completionTitle: 'PROJECT R33 — Build completed.',
    completionSubtitle: 'Not street legal in this browser.',
    fixes: [
      fix(
        'model',
        'Falta configurar el modelo correcto.',
        'Es un Nissan Skyline GT-R... R33.',
        'Modelo configurado: R33.',
        [
          ['correct', 'model: "R33"', true],
          ['r32', 'model: "R32"', false],
          ['r34', 'model: "R34"', false],
          ['gts', 'model: "GTS-4"', false],
        ]
      ),
      fix(
        'wheels',
        'wheels: 3 — le falta una rueda.',
        'Un auto necesita exactamente 4 ruedas.',
        'wheels: 4 aplicado.',
        [
          ['correct', 'wheels: 4', true],
          ['three', 'wheels: 3', false],
          ['two', 'wheels: 2', false],
          ['six', 'wheels: 6', false],
        ]
      ),
      fix(
        'engine',
        'El motor todavía no está configurado.',
        'El R33 icónico lleva motor twin-turbo.',
        'engine: "twin-turbo" aplicado.',
        [
          ['correct', 'engine: "twin-turbo"', true],
          ['single', 'engine: "single-turbo"', false],
          ['none', 'engine: "no-engine"', false],
          ['hybrid', 'engine: "hybrid"', false],
        ]
      ),
      fix(
        'headlights',
        'headlights: false — el auto queda a oscuras.',
        'Encendé los faros.',
        'headlights: true aplicado.',
        [
          ['correct', 'headlights: true', true],
          ['false', 'headlights: false', false],
          ['undefined', 'headlights: undefined', false],
          ['string', 'headlights: "off"', false],
        ]
      ),
      fix(
        'spoiler',
        'spoilerMounted: false — falta el toque final.',
        'Montá el alerón para terminar la carrocería.',
        'spoilerMounted: true aplicado.',
        [
          ['correct', 'spoilerMounted: true', true],
          ['false', 'spoilerMounted: false', false],
          ['removed', 'spoilerMounted: "removed"', false],
          ['pending', 'spoilerMounted: "pending"', false],
        ]
      ),
    ],
  },
  {
    id: 'lemon-pie-protocol',
    index: 8,
    code: 'LEVEL 08 // LEMON PIE PROTOCOL',
    title: 'Lemon Pie Protocol',
    mission: 'Encender las 26 velitas y construir el botón para apagarlas.',
    fixCount: 26,
    completionTitle: 'Shutdown sequence complete.',
    completionSubtitle: 'Build fully deployed.',
    fixes: [],
  },
]

function orderedOptions(correct: [string, string], incorrect: Array<[string, string]>) {
  const correctTuple: [string, string, boolean] = [correct[0], correct[1], true]
  const incorrectTuples: Array<[string, string, boolean]> = incorrect.map(([id, label]) => [id, label, false])
  return placeCorrectOption(correctTuple, incorrectTuples).map(([id, label, correct]) => ({ id, label, correct }))
}

export const REST_PROTOCOL_CONTENT = {
  introLines: [
    'Developer session detected.',
    'Workload status: excessive.',
    'Rest protocol: unavailable.',
    'Five corrections required.',
  ],
  startButtonLabel: 'START DEBUGGING',
  sessionCompletedCaption: 'Work session completed',
}

export const LEMON_PIE_CONTENT = {
  candlesOnlineLabel: (count: number) => `Candles online: ${count} / 26`,
  allCandlesOnline: 'All candles online.\nShutdown control missing.',
  buttonParts: {
    text: orderedOptions(
      ['correct', 'BLOW CANDLES'],
      [
        ['delete', 'DELETE CANDLES'],
        ['ignore', 'IGNORE'],
        ['log', "console.log('cake')"],
      ]
    ),
    event: orderedOptions(
      ['correct', 'onClick'],
      [
        ['hover', 'onHover'],
        ['delete', 'onDelete'],
        ['scroll', 'onScroll'],
      ]
    ),
    action: orderedOptions(
      ['correct', 'extinguishAllCandles()'],
      [
        ['reload', 'reloadPage()'],
        ['delete', 'deleteCake()'],
        ['add', 'addCandle()'],
      ]
    ),
  },
  partLabels: {
    text: 'Texto del botón',
    event: 'Evento',
    action: 'Acción',
  },
  partHints: {
    text: 'Tiene que decir claramente qué hace el botón: apagar las velas.',
    event: 'Es el evento estándar para manejar un click.',
    action: 'La función tiene que apagar TODAS las velas a la vez.',
  },
  blowPrompt: 'Presioná el botón para apagar las velas.',
  blownMessage: 'Todas las velas apagadas. Deploy final desbloqueado.',
}

export const ACHIEVEMENTS: Array<{ id: string; icon: string; title: string; description: string }> = [
  { id: 'event-handler', icon: '🖱️', title: 'System Starter', description: 'Arrancaste la build y devolviste el control al sistema.' },
  { id: 'css-recovery', icon: '🎨', title: 'Interface Restorer', description: 'Convertiste el caos visual en una interfaz lista para producción.' },
  { id: 'first-match', icon: '🤾', title: 'First Match', description: 'Recuperaste la cancha de handball donde empezó esta amistad.' },
  { id: 'rest-protocol', icon: '🪑', title: 'Rest Mode', description: 'Recordaste que descansar también forma parte del progreso.' },
  { id: 'travel-route', icon: '✈️', title: 'Japan Route', description: 'Dejaste preparada la ruta para todos los viajes que todavía faltan.' },
  { id: 'production-merge', icon: '🔀', title: 'Identity Merge', description: 'Uniste a Nahuel y Zuku sin romper producción.' },
  { id: 'project-r33', icon: '🏎️', title: 'Dream Build', description: 'Construiste el R33 pieza por pieza y encendiste su motor.' },
  { id: 'lemon-pie-protocol', icon: '🥧', title: 'Twenty-Six Online', description: 'Encendiste 26 velas y completaste la última etapa de la build.' },
  { id: 'nala', icon: '🐾', title: 'Nala Approved', description: 'Todos los fixes pasaron el control de calidad más importante.' },
]

export const SECRET_CONTENT = {
  levelName: 'MANI_ARCHIVE',
  discoveryHints: ['Inspect build.', 'Secret file.', 'Untracked asset.', 'MANI_ARCHIVE.'],
  terminalLines: [
    'RECOVERING UNTRACKED ASSET...',
    'archive/mani.legacy found.',
    'Integrity check: stable.',
    'Ancient dependency recovered.',
    'Still more stable than production.',
  ],
  placeholderTitle: 'MANI_ARCHIVE',
  placeholderSubtitle: 'Waiting for mani.png',
}

export const FINAL_CONTENT = {
  deployLines: [
    'All critical errors fixed.',
    'All tests passed.',
    'Build integrity: 100%.',
    'Deploying final message...',
  ],
  deploySuccessful: 'DEPLOY SUCCESSFUL',
  headline: 'FELIZ CUMPLEAÑOS, ZUKU',
  message: `Pasala hermoso.

Estoy orgulloso de todos tus progresos y de que todo lo que te proponés, lo terminás cumpliendo.

Gracias por todos estos años desde aquella cancha de handball, y por todos los viajes, proyectos y aventuras que todavía quedan por vivir.

Con cariño,
Jonococina`,
  achievement: 'Achievement unlocked: Another year successfully deployed.',
}
