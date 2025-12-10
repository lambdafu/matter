import { useState } from 'react'
import { Modal, Button, Form, Icon } from 'semantic-ui-react'
import { useDispatch, useGameState } from '../hooks'
import type { Settings as SettingsType } from '../../engine/types'

const numberFormatOptions = [
  { key: 'scientific', text: 'Scientific (1.2e6)', value: 'scientific' },
  { key: 'compact', text: 'SI Prefix (1.2M)', value: 'compact' },
  { key: 'full', text: 'Full (1,200,000)', value: 'full' },
]

export default function Settings() {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const settings = useGameState(state => state.settings)

  const handleNumberFormatChange = (value: SettingsType['numberFormat']) => {
    dispatch({ type: 'updateSettings', payload: { numberFormat: value } })
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={
        <Button icon basic>
          <Icon name="setting" />
        </Button>
      }
      size="tiny"
    >
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Number Format</label>
            <Form.Select
              options={numberFormatOptions}
              value={settings.numberFormat}
              onChange={(_, data) =>
                handleNumberFormatChange(data.value as SettingsType['numberFormat'])
              }
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  )
}
