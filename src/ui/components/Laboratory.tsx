import { useGameState } from '../hooks'
import TopicDisplay from './TopicDisplay'
import TopicSelector from './TopicSelector'
import TopicItem from './TopicItem'

export default function Laboratory() {
  const activeTopic = useGameState(state => state.active.topic)
  const activeItem = useGameState(state => state.active.item[state.active.topic])

  return (
    <div>
      <TopicDisplay topicKey={activeTopic} />
      <TopicSelector />
      {activeItem && <TopicItem topicKey={activeTopic} itemKey={activeItem} />}
    </div>
  )
}
