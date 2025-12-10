import { Segment } from 'semantic-ui-react'
import { useGameState } from '../hooks'
import LeadScientist from './LeadScientist'
import Scientist from './Scientist'

export default function Notebook() {
  const leadScientist = useGameState(state => state.leadScientist)

  return (
    <Segment basic vertical style={{ width: '300px', margin: '0 auto' }}>
      <LeadScientist />
      <Scientist scientistKey={leadScientist} />
    </Segment>
  )
}
