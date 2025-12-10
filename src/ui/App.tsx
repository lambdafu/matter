import { Container, Grid } from 'semantic-ui-react'
import { GameProvider } from './hooks'
import Menu from './components/Menu'
import Notebook from './components/Notebook'
import Laboratory from './components/Laboratory'
import NarrativeModal from './components/NarrativeModal'
import ScientistUnlockModal from './components/ScientistUnlockModal'

function AppContent() {
  return (
    <>
      <Menu />
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={5}>
              <Notebook />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={11}>
              <Laboratory />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <ScientistUnlockModal />
      <NarrativeModal />
    </>
  )
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
