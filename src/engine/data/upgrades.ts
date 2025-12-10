import type { Upgrade } from '../types'

const upgrades: Record<string, Upgrade> = {
  lipobat: {
    key: 'lipobat',
    name: 'Lithium Batteries',
    desc: 'More powerful batteries double flashlight output.',
    wp: 'Lithium_battery',
    cost: { photon: 1000 },
    effects: [{ generator: 'flashlight', type: 'efficiency', value: 2.0 }],
    revealAt: { generator: 'flashlight', count: 2 },
  },
  solarcooling: {
    key: 'solarcooling',
    name: 'Solar Panel Cooling',
    desc: 'Better cooling allows solar panels to work 50% faster.',
    wp: 'Passive_cooling',
    cost: { photon: 5000, electron: 100 },
    effects: [{ generator: 'solarpanel', type: 'efficiency', value: 1.5 }],
    revealAt: { generator: 'solarpanel', count: 2 },
  },
  turboboost: {
    key: 'turboboost',
    name: 'Turbo Boost',
    desc: 'Temporary overclock triples flashlight output for 60 seconds.',
    wp: 'Overclocking',
    cost: { photon: 500 },
    expiration: 60, // Lasts 60 seconds
    effects: [{ generator: 'flashlight', type: 'efficiency', value: 3.0 }],
    revealAt: { generator: 'flashlight', count: 3 },
  },
}

export default upgrades
