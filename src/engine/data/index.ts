import type { MatterData, UIConfig } from '../types'
import items from './items'
import generators from './generators'
import upgrades from './upgrades'
import achievements from './achievements'
import scientists from './scientists'
import topics from './topics'
import categories from './categories'

const ui: UIConfig = {
  topics: ['sm', 'pt'],
  scientists: ['curie', 'einstein'],
}

const matter: MatterData = {
  version: '0.2.0',
  ui,
  topics,
  items,
  categories,
  scientists,
  achievements,
  generators,
  upgrades,
}

export default matter

export {
  items,
  generators,
  upgrades,
  achievements,
  scientists,
  topics,
  categories,
  ui,
}
