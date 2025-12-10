import { Modal, Button, Header, Image, Label, Icon } from 'semantic-ui-react'
import { useDispatch, useGameState, useMatter } from '../hooks'
import Wp from './Wp'
import type { SemanticICONS } from 'semantic-ui-react'

// Import scientist images
import curieImg from '../../images/scientist/curie.jpg'
import einsteinImg from '../../images/scientist/einstein.jpg'

const scientistImages: Record<string, string> = {
  'curie.jpg': curieImg,
  'einstein.jpg': einsteinImg,
}

export default function ScientistUnlockModal() {
  const dispatch = useDispatch()
  const matter = useMatter()
  const modalQueue = useGameState(state => state.narrative.modalQueue)

  // Only show if the first item in queue is a scientist unlock modal
  const currentEntry = modalQueue[0]
  if (!currentEntry || currentEntry.type !== 'scientistUnlock') return null

  const scientist = matter.scientists[currentEntry.key]
  if (!scientist) return null

  const imageSrc = scientistImages[scientist.image]

  const handleDismiss = () => {
    dispatch({ type: 'dismissModal' })
  }

  return (
    <Modal open={true} size="small" onClose={handleDismiss}>
      <Modal.Header style={{ textAlign: 'center', background: '#f8f8f8' }}>
        <Icon name="star" color="yellow" />
        New Principal Investigator!
        <Icon name="star" color="yellow" />
      </Modal.Header>
      <Modal.Content image>
        {imageSrc && (
          <Image
            wrapped
            size="medium"
            src={imageSrc}
            style={{ borderRadius: '8px' }}
          />
        )}
        <Modal.Description>
          <Header>
            {scientist.name}
            <Header.Subheader>{scientist.title}</Header.Subheader>
          </Header>
          <p style={{ fontSize: '1.1em', fontStyle: 'italic', color: '#555' }}>
            "{scientist.tagline}"
          </p>
          <p>
            <Wp lemma={scientist.tagline_wp} />
          </p>
          <Label.Group style={{ marginTop: '1em' }}>
            {scientist.achievements.map((achievementKey: string) => {
              const achievement = matter.achievements[achievementKey]
              return (
                <Label key={achievementKey} size="large">
                  <Icon name={achievement.icon as SemanticICONS} />
                  {achievement.name}
                </Label>
              )
            })}
          </Label.Group>
          <p style={{ marginTop: '1em', color: '#888' }}>
            <Wp lemma={scientist.wp} /> has joined your research team!
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={handleDismiss} size="large">
          <Icon name="flask" />
          Start Researching!
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
