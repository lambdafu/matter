import { Button, Divider, Popup } from 'semantic-ui-react'
import { useDispatch, useGameState, useMatter } from '../hooks'

export default function TopicSelector() {
  const dispatch = useDispatch()
  const matter = useMatter()
  const activeTopic = useGameState(state => state.active.topic)

  const handleSelect = (topic: string) => {
    dispatch({ type: 'setTopic', payload: { topic } })
  }

  return (
    <>
      <Divider horizontal>Topic</Divider>
      <Button.Group>
        {matter.ui.topics.map((topicKey: string) => {
          const topic = matter.topics[topicKey]
          return (
            <Popup
              key={topicKey}
              trigger={
                <Button
                  active={activeTopic === topicKey}
                  onClick={() => handleSelect(topicKey)}
                >
                  {topic.short}
                </Button>
              }
              content={topic.name}
            />
          )
        })}
      </Button.Group>
    </>
  )
}
