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

function fix(id: string, prompt: string, hint: string, resultLabel: string, options: Array<[string, string, boolean]>): FixDefinition {
  return {
    id,
    prompt,
    hint,
    resultLabel,
    options: options.map(([optId, label, correct]) => ({ id: optId, label, correct })),
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
        'goal-position',
        'El arco está fuera de la cancha.',
        'El arco tiene que estar centrado sobre la línea de fondo.',
        'Arco reposicionado.',
        [
          ['correct', 'goal.position = "baseline-center";', true],
          ['midfield', 'goal.position = "midfield";', false],
          ['offcourt', 'goal.position = "off-court";', false],
          ['bench', 'goal.position = "bench";', false],
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
        'players-position',
        'Los dos jugadores están ubicados de forma imposible.',
        'Tienen que estar dentro de la cancha, acercándose al centro.',
        'Jugadores reubicados.',
        [
          ['correct', 'players.position = "center-court";', true],
          ['stands', 'players.position = "stands";', false],
          ['parking', 'players.position = "parking-lot";', false],
          ['roof', 'players.position = "roof";', false],
        ]
      ),
      fix(
        'start-match',
        'El evento que arranca el partido no está conectado.',
        'Falta enlazar el botón con la función que inicia el partido.',
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
        'chair-visibility',
        'La silla existe en el código pero nadie la ve.',
        'visibility: hidden oculta el elemento sin sacarlo del layout.',
        'Silla visible.',
        [
          ['correct', 'chair.style.visibility = "visible";', true],
          ['hidden', 'chair.style.visibility = "hidden";', false],
          ['collapse', 'chair.style.visibility = "collapse";', false],
          ['opacity0', 'chair.style.opacity = 0;', false],
        ]
      ),
      fix(
        'chair-position',
        'La silla está del otro lado del cuarto.',
        'Tiene que estar justo detrás del escritorio.',
        'Silla en posición.',
        [
          ['correct', 'chair.position = "at-desk";', true],
          ['hallway', 'chair.position = "hallway";', false],
          ['roof', 'chair.position = "roof";', false],
          ['kitchen', 'chair.position = "kitchen";', false],
        ]
      ),
      fix(
        'brightness',
        'El monitor encandila. El brillo está al máximo.',
        'Bajalo a un nivel cómodo para los ojos.',
        'Brillo ajustado.',
        [
          ['correct', 'monitor.brightness = 55;', true],
          ['max', 'monitor.brightness = 100;', false],
          ['over', 'monitor.brightness = 250;', false],
          ['zero', 'monitor.brightness = 0;', false],
        ]
      ),
      fix(
        'rest-mode',
        'El modo descanso del sistema está apagado.',
        'restMode necesita pasar a true.',
        'restMode activado.',
        [
          ['correct', 'restMode = true;', true],
          ['false', 'restMode = false;', false],
          ['undefined', 'restMode = undefined;', false],
          ['string', 'restMode = "later";', false],
        ]
      ),
      fix(
        'sit-zuku',
        'El botón de descanso no llama a la función correcta.',
        'Conectá el botón con sitZuku().',
        'Zuku se sienta.',
        [
          ['correct', 'restButton.onclick = sitZuku;', true],
          ['stand', 'restButton.onclick = keepStanding;', false],
          ['none', 'restButton.onclick = null;', false],
          ['wrong', 'restButton.onclick = startBuild;', false],
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

export const LEMON_PIE_CONTENT = {
  candlesOnlineLabel: (count: number) => `Candles online: ${count} / 26`,
  allCandlesOnline: 'All candles online.\nShutdown control missing.',
  buttonParts: {
    text: [
      { id: 'correct', label: 'BLOW CANDLES', correct: true },
      { id: 'delete', label: 'DELETE CANDLES', correct: false },
      { id: 'ignore', label: 'IGNORE', correct: false },
      { id: 'log', label: "console.log('cake')", correct: false },
    ],
    event: [
      { id: 'correct', label: 'onClick', correct: true },
      { id: 'hover', label: 'onHover', correct: false },
      { id: 'delete', label: 'onDelete', correct: false },
      { id: 'scroll', label: 'onScroll', correct: false },
    ],
    action: [
      { id: 'correct', label: 'extinguishAllCandles()', correct: true },
      { id: 'reload', label: 'reloadPage()', correct: false },
      { id: 'delete', label: 'deleteCake()', correct: false },
      { id: 'add', label: 'addCandle()', correct: false },
    ],
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
