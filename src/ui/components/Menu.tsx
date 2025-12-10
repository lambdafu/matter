import { Menu as SemanticMenu } from 'semantic-ui-react'
import { useGame, useMatter } from '../hooks'
import Settings from './Settings'

export default function Menu() {
  const { dispatch, save, load, reset } = useGame()
  const matter = useMatter()

  const handlePredict = () => {
    dispatch({ type: 'updatePrediction' })
  }

  return (
    <SemanticMenu>
      <SemanticMenu.Item header>
        Matter {matter.version}
      </SemanticMenu.Item>
      <SemanticMenu.Item onClick={save}>
        Save
      </SemanticMenu.Item>
      <SemanticMenu.Item onClick={load}>
        Load
      </SemanticMenu.Item>
      <SemanticMenu.Item onClick={reset}>
        Reset
      </SemanticMenu.Item>
      <SemanticMenu.Item onClick={handlePredict}>
        Predict
      </SemanticMenu.Item>
      <SemanticMenu.Menu position="right">
        <SemanticMenu.Item>
          <Settings />
        </SemanticMenu.Item>
      </SemanticMenu.Menu>
    </SemanticMenu>
  )
}
