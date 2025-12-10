import { Message, Icon } from 'semantic-ui-react'
import { useGameState } from '../hooks'
import TopicDisplay from './TopicDisplay'
import TopicSelector from './TopicSelector'
import TopicItem from './TopicItem'

export default function Laboratory() {
  const activeTopic = useGameState(state => state.active.topic)
  const activeItem = useGameState(state => state.active.item[state.active.topic])
  const activeItemState = useGameState(state =>
    state.active.item[state.active.topic]
      ? state.items[state.active.item[state.active.topic]]
      : null
  )

  const isItemAvailable = activeItemState?.available ?? false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      <div style={{ flexShrink: 0 }}>
        <TopicDisplay topicKey={activeTopic} />
        <TopicSelector />
      </div>
      {activeItem && isItemAvailable ? (
        <div style={{ flex: 1, overflow: 'auto', marginTop: '1em', paddingRight: '0.5em' }}>
          <TopicItem topicKey={activeTopic} itemKey={activeItem} />
        </div>
      ) : (
        <div style={{ flex: 1, marginTop: '2em', textAlign: 'center' }}>
          <Message info icon style={{ display: 'inline-block', textAlign: 'left' }}>
            <Icon name="lab" />
            <Message.Content>
              <Message.Header>Nothing discovered yet</Message.Header>
              <p>Keep researching to unlock new particles and elements!</p>
            </Message.Content>
          </Message>
        </div>
      )}
    </div>
  )
}
