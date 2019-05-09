export default {
  key: "sm",
  name: "Standard Model",
  short: "SM",
  wp: "Standard_Model",
  desc: "Four fundamental forces of nature, a bunch of particles, and their interactions.",
  gridui: {
    compact: true,
    celled: true,
    class: "doubled"
  },
  grid: [
    [ null, null, "up", "charm", "top", "gluon", "higgs", null, null ],
    [ null, null, "down", "strange", "bottom", "photon", null, null, null ],
    [ null, null, "electron", "muon", "tau", "zboson", null, null, null ],
    [ null, null, "neutrino", "mneutrino", "tneutrino", "wboson", null, null, null ],
    [ null, null, null, null, null, null, null, null, null ]
  ],
}
