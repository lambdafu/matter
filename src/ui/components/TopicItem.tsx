import { Header, Item } from 'semantic-ui-react'
import { useGameState, useMatter } from '../hooks'
import { formatCompact, formatRate } from '../../engine/format'
import Wp from './Wp'
import Generator from './Generator'

interface TopicItemProps {
  topicKey: string
  itemKey: string
}

export default function TopicItem({ itemKey }: TopicItemProps) {
  const matter = useMatter()
  const itemState = useGameState(state => state.items[itemKey])
  const prediction = useGameState(state => state.prediction?.result?.items[itemKey])
  const numberFormat = useGameState(state => state.settings.numberFormat)

  const item = matter.items[itemKey]
  if (!item) return null

  // Find generators that produce or consume this item
  const generators = Object.keys(matter.generators).filter(generatorKey => {
    const generator = matter.generators[generatorKey]
    return generator.outputs[itemKey] !== undefined || generator.inputs[itemKey] !== undefined
  })

  const delta = prediction?.delta ?? 0

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

      {generators.length > 0 && (
        <>
          <Header as="h3">Generators</Header>
          <Item.Group divided>
            {generators.map(generatorKey => (
              <Generator key={generatorKey} generatorKey={generatorKey} />
            ))}
          </Item.Group>
        </>
      )}
    </div>
  )
}
