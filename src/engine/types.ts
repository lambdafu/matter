// =============================================================================
// Game Data Types (Static, defined at build time)
// =============================================================================

/** Category for grouping items (quarks, leptons, metals, etc.) */
export interface Category {
  name: string
  wp: string
  desc: string
  color: string
}

/** Base item properties shared by all items */
export interface BaseItem {
  category: string
  name: string
  short: string
  wp: string
  desc: string
}

/** Standard Model particle (quark, lepton, boson) */
export interface ParticleItem extends BaseItem {
  mass: string
  charge: number
  spin: number
  generators?: string[]
}

/** Periodic Table element */
export interface ElementItem extends BaseItem {
  mass: string
  Z: number
}

/** Union of all item types */
export type Item = ParticleItem | ElementItem

/** Generator that produces/consumes items */
export interface Generator {
  key: string
  name: string
  desc: string
  wp: string
  /** Cost to purchase one generator: itemKey -> amount */
  cost: Record<string, number>
  /** Cost multiplier per owned generator (for exponential scaling, e.g., 1.15) */
  costMultiplier?: number
  inputs: Record<string, number>
  outputs: Record<string, number>
}

/** Types of effects an upgrade can have on a generator */
export type UpgradeEffectType =
  | 'efficiency'      // Multiplier on production rate (1.5 = 50% faster)
  | 'addOutput'       // Add a secondary output resource
  | 'addInput'        // Add a secondary input requirement
  | 'reduceInput'     // Reduce an existing input requirement

/** Upgrade effect on a generator */
export interface UpgradeEffect {
  generator: string
  type: UpgradeEffectType
  /** For efficiency: multiplier. For addOutput/addInput: item key */
  target?: string
  /** The value: multiplier for efficiency, amount for resource changes */
  value: number
}

/** Upgrade that enhances generators */
export interface Upgrade {
  key: string
  name: string
  desc: string
  wp: string
  /** Cost to purchase: itemKey -> amount */
  cost: Record<string, number>
  /** Optional expiration time in seconds (null = permanent) */
  expiration?: number
  effects: UpgradeEffect[]
}

// =============================================================================
// Narrative Types (Story/Event System)
// =============================================================================

/** Comparison operators for narrative conditions */
export type NarrativeOperator = '>=' | '>' | '<' | '<=' | '==' | 'has'

/** Condition that must be met to trigger a narrative event */
export interface NarrativeCondition {
  /** Type of condition to check */
  type: 'item' | 'generator' | 'upgrade' | 'event' | 'gameTime'
  /** Key of the item/generator/upgrade/event to check (not needed for gameTime) */
  key?: string
  /** Comparison operator */
  op: NarrativeOperator
  /** Value to compare against */
  value: number | boolean
}

/** Effect types that narrative events can trigger */
export type NarrativeEffectType =
  | 'grantItem'        // Add items to inventory
  | 'grantGenerator'   // Add generators (free, bypasses cost)
  | 'unlockItem'       // Set item as available
  | 'unlockGenerator'  // Set generator as available (can be purchased)
  | 'unlockUpgrade'    // Set upgrade as available
  | 'revealGenerator'  // Make generator visible but not yet available (teaser)
  | 'revealUpgrade'    // Make upgrade visible but not yet available (teaser)
  | 'removeItem'       // Remove items (catastrophe)
  | 'removeGenerator'  // Remove generators (catastrophe)

/** Effect applied when a narrative event triggers */
export interface NarrativeEffect {
  type: NarrativeEffectType
  key: string
  /** Count for grant/remove effects (default 1) */
  count?: number
}

/** A narrative event that can be triggered during gameplay */
export interface NarrativeEvent {
  /** Unique identifier */
  key: string
  /** Story arc this event belongs to */
  arc: string
  /** Conditions that must ALL be true to trigger (empty = trigger immediately) */
  conditions: NarrativeCondition[]
  /** Minimum seconds since last narrative event (prevents spam) */
  cooldown?: number
  /** Minimum total game time before this can trigger */
  minGameTime?: number
  /** Effects to apply when triggered */
  effects: NarrativeEffect[]
  /** Scientist who speaks this message (for portrait) */
  speaker?: string
  /** The narrative message to display */
  message: string
  /** Show in modal (major plot point) vs message log (minor) */
  modal?: boolean
  /** Teaser text shown before this event triggers (for upcoming goals) */
  teaser?: string
}

/** Achievement unlocked by scientists */
export interface Achievement {
  name: string
  info: string
  icon: string
}

/** Scientist NPC with achievements */
export interface Scientist {
  name: string
  wp: string
  image: string
  image_source: string
  title: string
  tagline: string
  tagline_wp: string
  achievements: string[]
}

/** UI configuration for topic grid display */
export interface TopicGridUI {
  compact?: boolean
  celled?: boolean
  class?: string
  size?: string
}

/** Topic (Standard Model or Periodic Table) */
export interface Topic {
  key: string
  name: string
  short: string
  wp: string
  desc: string
  grid: (string | null)[][]
  gridui?: TopicGridUI
}

/** UI configuration listing available topics and scientists */
export interface UIConfig {
  topics: string[]
  scientists: string[]
}

/** Complete static game data */
export interface MatterData {
  version: string
  ui: UIConfig
  topics: Record<string, Topic>
  items: Record<string, Item>
  categories: Record<string, Category>
  scientists: Record<string, Scientist>
  achievements: Record<string, Achievement>
  generators: Record<string, Generator>
  upgrades: Record<string, Upgrade>
  narrative: NarrativeEvent[]
}

// =============================================================================
// Game State Types (Dynamic, changes during gameplay)
// =============================================================================

/** State of a single item in inventory */
export interface ItemState {
  available: boolean
  count: number
}

/** State of a single generator */
export interface GeneratorState {
  /** Visible in UI (teaser/locked state) */
  visible: boolean
  /** Available for purchase/use */
  available: boolean
  count: number
}

/** State of a single upgrade */
export interface UpgradeState {
  /** Visible in UI (teaser/locked state) */
  visible: boolean
  /** Available for purchase */
  available: boolean
  acquired: boolean
  /**
   * For expiring upgrades: remaining durability in seconds.
   * This is modeled as a pseudo-resource consumed by a hidden "decay" generator.
   * When durability reaches 0, the upgrade becomes inactive.
   * Permanent upgrades have undefined durability.
   */
  durability?: number
}

/** Currently active UI selections */
export interface ActiveState {
  topic: string
  item: Record<string, string>
}

/** User settings */
export interface Settings {
  numberFormat: 'scientific' | 'compact' | 'full'
}

/** Entry in the narrative message log */
export interface NarrativeLogEntry {
  eventKey: string
  timestamp: number
  message: string
  speaker?: string
}

/** Narrative/story progress state */
export interface NarrativeState {
  /** Event keys that have already triggered */
  triggered: string[]
  /** Game time when last event triggered (for cooldown) */
  lastEventTime: number
  /** Total seconds played */
  gameTime: number
  /** Recent messages for UI display */
  messageLog: NarrativeLogEntry[]
  /** Currently displayed modal event (null if none) */
  currentModal: string | null
}

/** LP solver result for a single item */
export interface ItemPrediction {
  delta: number
  maxdelta: number
}

/** LP solver result for a single generator */
export interface GeneratorPrediction {
  utilization: number
  utilizationMax: number
}

/** Complete LP solver prediction result */
export interface PredictionResult {
  items: Record<string, ItemPrediction>
  generators: Record<string, GeneratorPrediction>
}

/**
 * A breakpoint is a moment when the system state changes qualitatively.
 * The solver predicts when these occur so the simulation can handle them.
 */
export interface Breakpoint {
  /** Time in seconds until this breakpoint occurs */
  timeUntil: number
  /** Type of breakpoint */
  type: 'resourceDepleted' | 'upgradeExpired'
  /** Key of the affected entity (item key or upgrade key) */
  key: string
}

/** Full prediction data including model and solution */
export interface Prediction {
  model: unknown
  solution: Record<string, number>
  result: PredictionResult
  /**
   * The next breakpoint where system state will change.
   * null if the system is in steady state (no resources depleting).
   */
  nextBreakpoint: Breakpoint | null
}

/** Saved game state (persisted to localStorage) */
export interface SavedState {
  version: number
  leadScientist: string
  active: ActiveState
  settings: Settings
  items: Record<string, ItemState>
  generators: Record<string, GeneratorState>
  upgrades: Record<string, UpgradeState>
  narrative: NarrativeState
  prediction?: Prediction
}

/** Complete game state */
export interface GameState {
  matter: MatterData
  saved: SavedState
}

// =============================================================================
// Action Types
// =============================================================================

export interface SetStateAction {
  type: 'setState'
  payload: Partial<SavedState>
}

export interface ResetStateAction {
  type: 'resetState'
}

export interface SetTopicAction {
  type: 'setTopic'
  payload: { topic: string }
}

export interface SetTopicItemAction {
  type: 'setTopicItem'
  payload: { topic: string; item: string }
}

export interface SetLeadScientistAction {
  type: 'setLeadScientist'
  payload: { scientist: string }
}

export interface UpdateGeneratorCountAction {
  type: 'updateGeneratorCount'
  payload: { generator: string; count: number }
}

export interface PurchaseGeneratorAction {
  type: 'purchaseGenerator'
  payload: { generator: string; count: number }
}

export interface SellGeneratorAction {
  type: 'sellGenerator'
  payload: { generator: string; count: number }
}

export interface UpdatePredictionAction {
  type: 'updatePrediction'
}

export interface TickAction {
  type: 'tick'
  payload: { dt: number }
}

export interface UpdateItemCountAction {
  type: 'updateItemCount'
  payload: { item: string; count: number }
}

export interface UpdateSettingsAction {
  type: 'updateSettings'
  payload: Partial<Settings>
}

export interface PurchaseUpgradeAction {
  type: 'purchaseUpgrade'
  payload: { upgrade: string }
}

export interface TriggerNarrativeEventAction {
  type: 'triggerNarrativeEvent'
  payload: { eventKey: string }
}

export interface DismissNarrativeModalAction {
  type: 'dismissNarrativeModal'
}

export type GameAction =
  | SetStateAction
  | ResetStateAction
  | SetTopicAction
  | SetTopicItemAction
  | SetLeadScientistAction
  | UpdateGeneratorCountAction
  | PurchaseGeneratorAction
  | SellGeneratorAction
  | UpdatePredictionAction
  | TickAction
  | UpdateItemCountAction
  | UpdateSettingsAction
  | PurchaseUpgradeAction
  | TriggerNarrativeEventAction
  | DismissNarrativeModalAction

// =============================================================================
// Event Types
// =============================================================================

export type GameEventType =
  | 'stateChange'
  | 'itemUnlocked'
  | 'generatorUnlocked'
  | 'upgradeUnlocked'
  | 'upgradeAcquired'
  | 'achievementUnlocked'
  | 'narrativeEvent'

export interface StateChangeEvent {
  type: 'stateChange'
  action: GameAction
  prevState: SavedState
  nextState: SavedState
}

export interface ItemUnlockedEvent {
  type: 'itemUnlocked'
  item: string
}

export interface GeneratorUnlockedEvent {
  type: 'generatorUnlocked'
  generator: string
}

export interface UpgradeUnlockedEvent {
  type: 'upgradeUnlocked'
  upgrade: string
}

export interface UpgradeAcquiredEvent {
  type: 'upgradeAcquired'
  upgrade: string
}

export interface AchievementUnlockedEvent {
  type: 'achievementUnlocked'
  achievement: string
}

export interface NarrativeEventTriggered {
  type: 'narrativeEvent'
  event: NarrativeEvent
}

export type GameEvent =
  | StateChangeEvent
  | ItemUnlockedEvent
  | GeneratorUnlockedEvent
  | UpgradeUnlockedEvent
  | UpgradeAcquiredEvent
  | AchievementUnlockedEvent
  | NarrativeEventTriggered

// =============================================================================
// Engine Types
// =============================================================================

export type StateListener = (state: SavedState, action: GameAction, prevState: SavedState) => void
export type EventListener<T extends GameEvent = GameEvent> = (event: T) => void
export type Unsubscribe = () => void

export interface Game {
  /** Get current saved state */
  getState(): SavedState

  /** Get static game data */
  getMatter(): MatterData

  /** Dispatch an action to update state */
  dispatch(action: GameAction): void

  /** Subscribe to all state changes */
  subscribe(listener: StateListener): Unsubscribe

  /** Subscribe to specific game events */
  on<T extends GameEventType>(
    eventType: T,
    listener: EventListener
  ): Unsubscribe

  /** Serialize state for persistence */
  save(): string

  /** Load state from serialized data */
  load(data: string): void

  /** Shorthand for dispatching a tick action */
  tick(dt: number): void
}
