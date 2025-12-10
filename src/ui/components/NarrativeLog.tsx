import { Segment, Comment, Header, List, Icon } from 'semantic-ui-react'
import { useGameState, useMatter } from '../hooks'

// Import scientist images for avatars
import curieImg from '../../images/scientist/curie.jpg'
import einsteinImg from '../../images/scientist/einstein.jpg'

const scientistImages: Record<string, string> = {
  curie: curieImg,
  einstein: einsteinImg,
}

export default function NarrativeLog() {
  const matter = useMatter()
  const messageLog = useGameState(state => state.narrative.messageLog)
  const triggered = useGameState(state => state.narrative.triggered)

  // Find upcoming events with teasers (not yet triggered, have a teaser)
  const upcomingGoals = matter.narrative
    .filter(event => !triggered.includes(event.key) && event.teaser)
    .slice(0, 3) // Show at most 3 upcoming goals

  // Show most recent messages first (reversed), limited to last 10
  const recentMessages = [...messageLog].reverse().slice(0, 10)

  const hasContent = messageLog.length > 0 || upcomingGoals.length > 0

  if (!hasContent) {
    return null
  }

  return (
    <>
      {upcomingGoals.length > 0 && (
        <Segment>
          <Header as="h4" style={{ marginBottom: '0.5em' }}>
            <Icon name="flag checkered" />
            Next Goals
          </Header>
          <List>
            {upcomingGoals.map(event => (
              <List.Item key={event.key}>
                <Icon name="circle outline" color="grey" />
                <List.Content>
                  <span style={{ color: '#666' }}>{event.teaser}</span>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Segment>
      )}

      {messageLog.length > 0 && (
        <Segment style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <Header as="h4" style={{ marginBottom: '0.5em' }}>
            <Icon name="comments" />
            Recent Messages
          </Header>
          <Comment.Group size="small">
            {recentMessages.map((entry, index) => {
              const scientist = entry.speaker ? matter.scientists[entry.speaker] : null
              const avatar = entry.speaker ? scientistImages[entry.speaker] : undefined

              return (
                <Comment key={`${entry.eventKey}-${index}`}>
                  {avatar && <Comment.Avatar src={avatar} />}
                  <Comment.Content>
                    {scientist && (
                      <Comment.Author>{scientist.name}</Comment.Author>
                    )}
                    <Comment.Text>{entry.message}</Comment.Text>
                    <Comment.Metadata>
                      {Math.floor(entry.timestamp)}s
                    </Comment.Metadata>
                  </Comment.Content>
                </Comment>
              )
            })}
          </Comment.Group>
        </Segment>
      )}
    </>
  )
}
