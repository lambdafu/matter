import type { Generator } from '../types'

const generators: Record<string, Generator> = {
  flashlight: {
    key: 'flashlight',
    name: 'Flashlight',
    desc: 'A battery-operated source for visible light.',
    wp: 'Flashlight',
    cost: {}, // First one is free!
    costMultiplier: 1.1,
    inputs: {},
    outputs: { photon: 1 },
  },
  laserpointer: {
    key: 'laserpointer',
    name: 'Laserpointer',
    desc: "Don't look into the beam!",
    wp: 'Laser_pointer',
    cost: { photon: 100 },
    costMultiplier: 1.15,
    inputs: {},
    outputs: { photon: 100 },
  },
  laser: {
    key: 'laser',
    name: 'Laser',
    desc: 'Light amplification by stimulated emission of radiation.',
    wp: 'Laser',
    cost: { photon: 10000 },
    costMultiplier: 1.2,
    inputs: {},
    outputs: { photon: 10000 },
  },
  solarpanel: {
    key: 'solarpanel',
    name: 'Solar Panel',
    desc: 'Electrons being elevated by light.',
    wp: 'Photodiode',
    cost: { photon: 1000 },
    costMultiplier: 1.15,
    inputs: { photon: 100 },
    outputs: { electron: 1 },
  },
}

export default generators
