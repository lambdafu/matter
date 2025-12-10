import { Dropdown, DropdownProps } from 'semantic-ui-react'
import { useDispatch, useGameState, useMatter } from '../hooks'

export default function LeadScientist() {
  const dispatch = useDispatch()
  const matter = useMatter()
  const leadScientist = useGameState(state => state.leadScientist)

  const options = matter.ui.scientists.map((key: string) => ({
    key,
    text: matter.scientists[key].name,
    value: key,
  }))

  const handleChange = (_: unknown, data: DropdownProps) => {
    dispatch({ type: 'setLeadScientist', payload: { scientist: data.value as string } })
  }

  return (
    <Dropdown
      placeholder="Select Scientist"
      fluid
      selection
      options={options}
      value={leadScientist}
      onChange={handleChange}
    />
  )
}
