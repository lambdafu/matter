import { version } from '../../package.json';
import ui from '../data/ui';
import sm from './sm';
import pt from './pt';
import scientists from '../data/scientists';
import achievements from '../data/achievements';
import generators from '../data/generators';
import upgrades from '../data/upgrades';

export default {
  version,
  ui,
  topics: { sm, pt },
  scientists,
  achievements,
  generators,
  upgrades,
};
