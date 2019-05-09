import { version } from '../../package.json';
import ui from './ui.js';
import sm from './sm.js';
import pt from './pt.js';
import items from './items.js';
import categories from './categories.js';
import scientists from './scientists.js';
import achievements from './achievements.js';
import generators from './generators.js';
import upgrades from './upgrades.js';

export default {
  version,
  ui,
  topics: { sm, pt },
  items,
  categories,
  scientists,
  achievements,
  generators,
  upgrades,
};

