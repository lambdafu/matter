export default {
  // SM: Photon
  flashlight: {
    key: "flashlight",
    name: "Flashlight",
    desc: "A battery-operated source for visible light.",
    wp: "Flashlight",
    baseCost: 1,
    inputs: {},
    outputs: { "photon": 1 },
  },
  laserpointer: {
    key: "laserpointer",
    name: "Laserpointer",
    desc: "Don't look into the beam!",
    wp: "Laser_pointer",
    baseCost: 100,
    inputs: {},
    outputs: { "photon": 100 },
  },
  laser: {
    key: "laser",
    name: "Laser",
    desc: "Light amplification by stimulated emission of radiation.",
    wp: "Laser",
    baseCost: 10000,
    inputs: {},
    outputs: { "photon": 10000 },
  },

  // SM: Electron
  solarpanel: {
    key: "solarpanel",
    name: "Solar Panel",
    desc: "Electrons being elevated by light.",
    wp: "Photodiode",
    baseCost: 10,
    inputs: { "photon": 100 },
    outputs: { "electron": 1 },
  },
}
