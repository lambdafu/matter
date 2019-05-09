export default {
  // SM: Photon
  flashlight: {
    key: "flashlight",
    name: "Flashlight",
    desc: "A battery-operated source for visible light.",
    wp: "Flashlight",
    baseCost: 1,
    effects: {
      inputs: [],
      outputs: [{
        item: "photon",
        count: 1,
      }],
    },
  },
  laserpointer: {
    key: "laserpointer",
    name: "Laserpointer",
    desc: "Don't look into the beam!",
    wp: "Laser_pointer",
    baseCost: 100,
    effects: {
      inputs: [],
      outputs: [{
        item: "photon",
        count: 100,
      }],
    },
  },
  laser: {
    key: "laser",
    name: "Laser",
    desc: "Light amplification by stimulated emission of radiation.",
    wp: "Laser",
    baseCost: 10000,
    effects: {
      inputs: [],
      outputs: [{
        item: "photon",
        count: 10000,
      }],
    },
  },

  // SM: Electron
  solarpanel: {
    key: "solarpanel",
    name: "Solar Panel",
    desc: "Electrons being elevated by light.",
    wp: "Photodiode",
    baseCost: 10,
    effects: {
      inputs: [{
        item: "photon",
        count: 100,
      }],
      outputs: [{
        item: "electron",
        count: 1,
      }],
    },
  },
}
