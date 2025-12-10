import { Item, Label, Icon } from 'semantic-ui-react'
import { useMatter } from '../hooks'
import placeholderImg from '../../images/image.png'

interface LockedGeneratorProps {
  generatorKey: string
}

/**
 * Display a locked/teaser version of a generator.
 * Shows the name and image but greys out and hides details.
 */
export default function LockedGenerator({ generatorKey }: LockedGeneratorProps) {
  const matter = useMatter()
  const generator = matter.generators[generatorKey]

  if (!generator) return null

  return (
    <Item style={{ opacity: 0.5 }}>
      <Item.Image
        size="tiny"
        src={placeholderImg}
        style={{ filter: 'grayscale(100%)' }}
      />
      <Item.Content>
        <Item.Header as="h3" style={{ color: '#888' }}>
          {generator.name}
          <Label size="mini" style={{ marginLeft: '0.5em' }}>
            <Icon name="lock" /> Locked
          </Label>
        </Item.Header>
        <Item.Meta style={{ color: '#aaa', fontStyle: 'italic' }}>
          Keep experimenting to unlock...
        </Item.Meta>
      </Item.Content>
    </Item>
  )
}
