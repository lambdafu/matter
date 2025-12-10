import { Header, Item } from 'semantic-ui-react'
import { useGameState, useMatter } from '../hooks'
import { formatCompact, formatRate } from '../../engine/format'
import Wp from './Wp'
import Generator from './Generator'
import LockedGenerator from './LockedGenerator'

interface TopicItemProps {
  topicKey: string
  itemKey: string
}

export default function TopicItem({ itemKey }: TopicItemProps) {
  const matter = useMatter()
  const itemState = useGameState(state => state.items[itemKey])
  const generatorStates = useGameState(state => state.generators)
  const prediction = useGameState(state => state.prediction?.result?.items[itemKey])
  const numberFormat = useGameState(state => state.settings.numberFormat)

  const item = matter.items[itemKey]
  if (!item) return null

  // Find generators that produce or consume this item AND are available (unlocked)
  const availableGenerators = Object.keys(matter.generators).filter(generatorKey => {
    const generator = matter.generators[generatorKey]
    const generatorState = generatorStates[generatorKey]
    const isRelevant = generator.outputs[itemKey] !== undefined || generator.inputs[itemKey] !== undefined
    const isAvailable = generatorState?.available ?? false
    return isRelevant && isAvailable
  })

  // Find generators that are visible but not available (locked/teaser)
  const lockedGenerators = Object.keys(matter.generators).filter(generatorKey => {
    const generator = matter.generators[generatorKey]
    const generatorState = generatorStates[generatorKey]
    const isRelevant = generator.outputs[itemKey] !== undefined || generator.inputs[itemKey] !== undefined
    const isVisible = generatorState?.visible ?? false
    const isAvailable = generatorState?.available ?? false
    return isRelevant && isVisible && !isAvailable
  })

  const delta = prediction?.delta ?? 0
  const hasGenerators = availableGenerators.length > 0 || lockedGenerators.length > 0

  return (
    <div>
      <Header as="h2">
        {item.name} <Wp lemma={item.wp} />
      </Header>
      <p>{item.desc}</p>
      <p>
        <strong>Count:</strong> {formatCompact(itemState?.count ?? 0, { style: numberFormat })}
        {delta !== 0 && (
          <span style={{ marginLeft: '1em', color: delta > 0 ? 'green' : 'red' }}>
            ({formatRate(delta, { style: numberFormat })})
          </span>
        )}
      </p>

      {hasGenerators && (
        <>
          <Header as="h3">Generators</Header>
          <Item.Group divided>
            {availableGenerators.map(generatorKey => (
              <Generator key={generatorKey} generatorKey={generatorKey} />
            ))}
            {lockedGenerators.map(generatorKey => (
              <LockedGenerator key={generatorKey} generatorKey={generatorKey} />
            ))}
          </Item.Group>
        </>
      )}
    </div>
  )
}
