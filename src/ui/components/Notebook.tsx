import { Segment, Header } from 'semantic-ui-react'
import { useGameState } from '../hooks'
import LeadScientist from './LeadScientist'
import Scientist from './Scientist'
import NarrativeLog from './NarrativeLog'

export default function Notebook() {
  const leadScientist = useGameState(state => state.leadScientist)
  const hasNarrativeContent = useGameState(state =>
    state.narrative.messageLog.length > 0 ||
    state.narrative.triggered.length > 0
  )

  return (
    <Segment basic vertical style={{ width: '300px', margin: '0 auto' }}>
      <LeadScientist />
      <Scientist scientistKey={leadScientist} />
      {hasNarrativeContent && (
        <>
          <Header as="h4" style={{ marginTop: '1em' }}>Lab Notes</Header>
          <NarrativeLog />
        </>
      )}
    </Segment>
  )
}
