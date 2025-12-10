import { Header } from 'semantic-ui-react'
import { useMatter } from '../hooks'
import Wp from './Wp'
import TopicGrid from './TopicGrid'

interface TopicDisplayProps {
  topicKey: string
}

export default function TopicDisplay({ topicKey }: TopicDisplayProps) {
  const matter = useMatter()
  const topic = matter.topics[topicKey]

  if (!topic) return null

  return (
    <div>
      <Header as="h1">
        {topic.name} <Wp lemma={topic.wp} />
      </Header>
      <p>{topic.desc}</p>
      <TopicGrid topicKey={topicKey} />
    </div>
  )
}
