import { Menu as SemanticMenu, Dropdown, Confirm } from 'semantic-ui-react'
import { useState } from 'react'
import { useGame, useMatter } from '../hooks'
import Settings from './Settings'

export default function Menu() {
  const { dispatch, manualSave, manualLoad, reset } = useGame()
  const matter = useMatter()
  const [confirmReset, setConfirmReset] = useState(false)

  const handlePredict = () => {
    dispatch({ type: 'updatePrediction' })
  }

  const handleReset = () => {
    setConfirmReset(true)
  }

  const confirmResetAction = () => {
    reset()
    setConfirmReset(false)
  }

  return (
    <>
      <SemanticMenu>
        <SemanticMenu.Item header>
          Matter {matter.version}
        </SemanticMenu.Item>

        <SemanticMenu.Item onClick={handleReset}>
          Reset
        </SemanticMenu.Item>

        <Dropdown item text="Debug">
          <Dropdown.Menu>
            <Dropdown.Item onClick={manualSave}>
              Save Snapshot
            </Dropdown.Item>
            <Dropdown.Item onClick={manualLoad}>
              Load Snapshot
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handlePredict}>
              Recalculate Prediction
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <SemanticMenu.Menu position="right">
          <SemanticMenu.Item>
            <Settings />
          </SemanticMenu.Item>
        </SemanticMenu.Menu>
      </SemanticMenu>

      <Confirm
        open={confirmReset}
        content="Are you sure you want to reset the game? All progress will be lost."
        onCancel={() => setConfirmReset(false)}
        onConfirm={confirmResetAction}
        confirmButton="Reset Game"
        size="mini"
      />
    </>
  )
}
