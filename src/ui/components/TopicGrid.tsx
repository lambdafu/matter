import { Popup } from 'semantic-ui-react'
import classNames from 'classnames'
import { useDispatch, useGameState, useMatter } from '../hooks'
import { formatCompact } from '../../engine/format'
import type { Topic } from '../../engine/types'
import './TopicGrid.css'

interface GridCellItemProps {
  topic: Topic
  itemKey: string
}

function GridCellItem({ topic, itemKey }: GridCellItemProps) {
  const dispatch = useDispatch()
  const matter = useMatter()
  const activeItem = useGameState(state => state.active.item[state.active.topic])
  const itemState = useGameState(state => state.items[itemKey])
  const numberFormat = useGameState(state => state.settings.numberFormat)

  const item = matter.items[itemKey]
  if (!item) return null

  const category = matter.categories[item.category]

  const handleClick = () => {
    dispatch({ type: 'setTopicItem', payload: { topic: topic.key, item: itemKey } })
  }

  return (
    <Popup
      trigger={
        <div
          className={classNames('cell', { active: activeItem === itemKey })}
          style={{ backgroundColor: category?.color }}
          onClick={handleClick}
        >
          <p>
            {item.short}
            <span className="count">{formatCompact(itemState?.count ?? 0, { style: numberFormat })}</span>
          </p>
        </div>
      }
      header={item.name}
      content={item.desc}
      position="bottom left"
    />
  )
}

function GridCellEmpty() {
  return <div className="cell empty" />
}

interface GridCellProps {
  topic: Topic
  item: string | null
}

function GridCell({ topic, item }: GridCellProps) {
  if (item === null) {
    return <GridCellEmpty />
  }
  return <GridCellItem topic={topic} itemKey={item} />
}

interface GridRowProps {
  topic: Topic
  items: (string | null)[]
}

function GridRow({ topic, items }: GridRowProps) {
  return (
    <div className="row">
      {items.map((itemKey, col) => (
        <GridCell key={col} topic={topic} item={itemKey} />
      ))}
    </div>
  )
}

interface TopicGridProps {
  topicKey: string
}

export default function TopicGrid({ topicKey }: TopicGridProps) {
  const matter = useMatter()
  const topic = matter.topics[topicKey]

  if (!topic) return null

  const gridClass = topic.gridui?.class ?? ''

  return (
    <div className={`topicgrid ${gridClass}`}>
      {topic.grid.map((items: (string | null)[], row: number) => (
        <GridRow key={row} topic={topic} items={items} />
      ))}
    </div>
  )
}
