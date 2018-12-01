import { version } from '../../package.json';
import ui from '../data/ui.js';
import sm from './sm.js';
import pt from './pt.js';
import scientists from '../data/scientists.js';
import achievements from '../data/achievements.js';
import generators from '../data/generators.js';
import upgrades from '../data/upgrades.js';

export default {
  version,
  ui,
  topics: { sm, pt },
  scientists,
  achievements,
  generators,
  upgrades,
};
