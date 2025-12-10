import { Modal, Button, Image } from 'semantic-ui-react'
import { useGameState, useMatter, useDispatch } from '../hooks'

// Import scientist images
import curieImg from '../../images/scientist/curie.jpg'
import einsteinImg from '../../images/scientist/einstein.jpg'

const scientistImages: Record<string, string> = {
  curie: curieImg,
  einstein: einsteinImg,
}

export default function NarrativeModal() {
  const matter = useMatter()
  const dispatch = useDispatch()
  const currentModal = useGameState(state => state.narrative.currentModal)

  // Find the event data for the current modal
  const currentEvent = currentModal
    ? matter.narrative.find(e => e.key === currentModal)
    : null

  if (!currentModal || !currentEvent) {
    return null
  }

  const scientist = currentEvent.speaker
    ? matter.scientists[currentEvent.speaker]
    : null
  const avatar = currentEvent.speaker
    ? scientistImages[currentEvent.speaker]
    : undefined

  const handleDismiss = () => {
    dispatch({ type: 'dismissNarrativeModal' })
  }

  return (
    <Modal open={true} onClose={handleDismiss} size="small">
      <Modal.Header>
        {scientist ? scientist.name : 'Notification'}
      </Modal.Header>
      <Modal.Content image>
        {avatar && (
          <Image wrapped size="small" src={avatar} />
        )}
        <Modal.Description>
          <p style={{ fontSize: '1.1em' }}>{currentEvent.message}</p>
          {currentEvent.effects.length > 0 && (
            <div style={{ marginTop: '1em', color: '#666' }}>
              {currentEvent.effects.map((effect, i) => {
                let text = ''
                switch (effect.type) {
                  case 'grantGenerator':
                    const gen = matter.generators[effect.key]
                    text = `Received: ${gen?.name ?? effect.key}`
                    break
                  case 'grantItem':
                    const item = matter.items[effect.key]
                    text = `Received: ${effect.count ?? 1} ${item?.name ?? effect.key}`
                    break
                  case 'unlockGenerator':
                    const unlockedGen = matter.generators[effect.key]
                    text = `Unlocked: ${unlockedGen?.name ?? effect.key}`
                    break
                  case 'unlockUpgrade':
                    const upgrade = matter.upgrades[effect.key]
                    text = `Unlocked upgrade: ${upgrade?.name ?? effect.key}`
                    break
                  case 'unlockItem':
                    const unlockedItem = matter.items[effect.key]
                    text = `Discovered: ${unlockedItem?.name ?? effect.key}`
                    break
                  default:
                    return null
                }
                return (
                  <div key={i} style={{ marginTop: '0.25em' }}>
                    {text}
                  </div>
                )
              })}
            </div>
          )}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={handleDismiss}>
          Continue
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
