import type { NarrativeEvent } from '../types'

/**
 * Physics Student Arc - The introductory story arc
 *
 * A new physics student arrives at the lab and learns the basics of
 * light, photons, and eventually electrons through experimentation.
 *
 * Sequential revelation: each event reveals the next thing to work towards.
 */
const narrative: NarrativeEvent[] = [
  // === WELCOME & FIRST FLASHLIGHT ===
  {
    key: 'welcome',
    arc: 'physics_student',
    conditions: [], // Triggers immediately on new game
    effects: [
      { type: 'grantGenerator', key: 'flashlight', count: 1 },
      { type: 'unlockGenerator', key: 'flashlight' },
      { type: 'unlockItem', key: 'photon' },
      // Reveal the next step (laser pointer - locked for now)
      { type: 'revealGenerator', key: 'laserpointer' },
    ],
    speaker: 'curie',
    message: "Welcome to the lab! I'm Professor Curie. Here's a flashlight to get you started. It will produce photons - the fundamental particles of light.",
    modal: true,
  },

  // === FIRST PHOTONS ===
  {
    key: 'first_photons',
    arc: 'physics_student',
    conditions: [
      { type: 'item', key: 'photon', op: '>=', value: 10 }
    ],
    cooldown: 3,
    effects: [],
    speaker: 'curie',
    message: "Excellent! You're producing photons. Keep going - we'll need more for our experiments.",
    teaser: "Gather 10 photons",
  },

  // === UNLOCK LASER POINTER ===
  {
    key: 'unlock_laserpointer',
    arc: 'physics_student',
    conditions: [
      { type: 'item', key: 'photon', op: '>=', value: 100 }
    ],
    cooldown: 5,
    effects: [
      { type: 'unlockGenerator', key: 'laserpointer' },
      // Reveal the next steps
      { type: 'revealGenerator', key: 'solarpanel' },
    ],
    speaker: 'curie',
    message: "You've gathered enough photons! I've unlocked the laser pointer. It's more efficient than a flashlight, but costs 100 photons to build.",
    teaser: "Gather 100 photons to unlock the Laser Pointer",
  },

  // === FIRST LASER POINTER ===
  {
    key: 'first_laserpointer',
    arc: 'physics_student',
    conditions: [
      { type: 'generator', key: 'laserpointer', op: '>=', value: 1 }
    ],
    cooldown: 5,
    effects: [],
    speaker: 'einstein',
    message: "A laser pointer! Stimulated emission of radiation - one of my favorite topics. The photons are now coherent.",
    teaser: "Build a Laser Pointer",
  },

  // === UNLOCK SOLAR PANEL ===
  {
    key: 'unlock_solarpanel',
    arc: 'physics_student',
    conditions: [
      { type: 'item', key: 'photon', op: '>=', value: 1000 }
    ],
    cooldown: 10,
    effects: [
      { type: 'unlockGenerator', key: 'solarpanel' },
      { type: 'unlockItem', key: 'electron' },
      // Reveal the next step
      { type: 'revealGenerator', key: 'laser' },
    ],
    speaker: 'einstein',
    message: "With this many photons, we can explore the photoelectric effect! I've unlocked the solar panel - it converts photons into electrons.",
    modal: true,
    teaser: "Gather 1,000 photons to unlock the Solar Panel",
  },

  // === FIRST ELECTRON ===
  {
    key: 'first_electron',
    arc: 'physics_student',
    conditions: [
      { type: 'item', key: 'electron', op: '>=', value: 1 }
    ],
    cooldown: 5,
    effects: [
      // Reveal upgrades once we have electrons
      { type: 'revealUpgrade', key: 'lipobat' },
    ],
    speaker: 'einstein',
    message: "Your first electron! The photoelectric effect in action. Light knocks electrons loose from atoms - this is what earned me the Nobel Prize.",
    teaser: "Produce your first electron",
  },

  // === UNLOCK LASER ===
  {
    key: 'unlock_laser',
    arc: 'physics_student',
    conditions: [
      { type: 'item', key: 'photon', op: '>=', value: 10000 }
    ],
    cooldown: 10,
    effects: [
      { type: 'unlockGenerator', key: 'laser' },
    ],
    speaker: 'curie',
    message: "Impressive photon production! I've unlocked the full-size laser. It's expensive but produces photons at an incredible rate.",
    teaser: "Gather 10,000 photons to unlock the Laser",
  },

  // === MANY ELECTRONS ===
  {
    key: 'electron_milestone',
    arc: 'physics_student',
    conditions: [
      { type: 'item', key: 'electron', op: '>=', value: 100 }
    ],
    cooldown: 15,
    effects: [
      { type: 'unlockUpgrade', key: 'lipobat' },
    ],
    speaker: 'curie',
    message: "A hundred electrons! Your lab is becoming quite productive. I've unlocked an upgrade for your flashlight - a lithium polymer battery.",
    teaser: "Gather 100 electrons to unlock an upgrade",
  },

  // === FIRST UPGRADE ===
  {
    key: 'first_upgrade',
    arc: 'physics_student',
    conditions: [
      { type: 'upgrade', key: 'lipobat', op: 'has', value: true }
    ],
    cooldown: 5,
    effects: [],
    speaker: 'curie',
    message: "The battery upgrade doubles your flashlight efficiency. Upgrades are powerful tools for improving your production.",
    teaser: "Purchase your first upgrade",
  },
]

export default narrative
