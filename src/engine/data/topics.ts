import type { Topic } from '../types'

const sm: Topic = {
  key: 'sm',
  name: 'Standard Model',
  short: 'SM',
  wp: 'Standard_Model',
  desc: 'Four fundamental forces of nature, a bunch of particles, and their interactions.',
  gridui: {
    compact: true,
    celled: true,
    class: 'doubled',
  },
  grid: [
    [null, null, 'up', 'charm', 'top', 'gluon', 'higgs', null, null],
    [null, null, 'down', 'strange', 'bottom', 'photon', null, null, null],
    [null, null, 'electron', 'muon', 'tau', 'zboson', null, null, null],
    [null, null, 'neutrino', 'mneutrino', 'tneutrino', 'wboson', null, null, null],
    [null, null, null, null, null, null, null, null, null],
  ],
}

const pt: Topic = {
  key: 'pt',
  name: 'Periodic Table',
  short: 'PT',
  wp: 'Periodic_table',
  desc: 'A table of all elements.',
  grid: [
    ['H', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'He'],
    ['Li', 'Be', null, null, null, null, null, null, null, null, null, null, 'B', 'C', 'N', 'O', 'F', 'Ne'],
    ['Na', 'Mg', null, null, null, null, null, null, null, null, null, null, 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
    ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'],
    ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'],
    ['Cs', 'Ba', 'La', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'],
    ['Fr', 'Ra', 'Ac', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', null, null],
    [null, null, 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', null, null],
  ],
  gridui: {
    compact: true,
    celled: true,
    class: 'single',
    size: 'small',
  },
}

const topics: Record<string, Topic> = { sm, pt }

export default topics
