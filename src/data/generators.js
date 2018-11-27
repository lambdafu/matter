export default {
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
        count: 100
      }],
    },
  },
  laser: {
    key: "laser",
    name: "Laser",
    desc: "light amplification by stimulated emission of radiation.",
    wp: "Laser",
    baseCost: 10000,
    effects: {
      inputs: [],
      outputs: [{
        item: "photon",
        count: 10000
      }],
    },
  },
}
