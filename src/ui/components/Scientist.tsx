import { Card, Label, Icon } from 'semantic-ui-react'
import { useMatter } from '../hooks'
import Wp from './Wp'
import type { SemanticICONS } from 'semantic-ui-react'

// Import scientist images
import curieImg from '../../images/scientist/curie.jpg'
import einsteinImg from '../../images/scientist/einstein.jpg'

const scientistImages: Record<string, string> = {
  'curie.jpg': curieImg,
  'einstein.jpg': einsteinImg,
}

interface ScientistProps {
  scientistKey: string
}

export default function Scientist({ scientistKey }: ScientistProps) {
  const matter = useMatter()
  const scientist = matter.scientists[scientistKey]

  if (!scientist) return null

  const imageSrc = scientistImages[scientist.image]

  return (
    <Card style={{ width: '290px' }}>
      {imageSrc && <img src={imageSrc} alt={scientist.name} />}
      <Card.Content>
        <Card.Header>
          {scientist.name} <Wp lemma={scientist.wp} />
        </Card.Header>
        <Card.Meta>{scientist.title}</Card.Meta>
        <Card.Description>
          {scientist.tagline} <Wp lemma={scientist.tagline_wp} />
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Label.Group>
          {scientist.achievements.map((achievementKey: string) => {
            const achievement = matter.achievements[achievementKey]
            return (
              <Label key={achievementKey}>
                <Icon name={achievement.icon as SemanticICONS} />
                {achievement.name}
              </Label>
            )
          })}
        </Label.Group>
      </Card.Content>
    </Card>
  )
}
