import { Icon } from 'semantic-ui-react'

interface WpProps {
  lemma: string
}

export default function Wp({ lemma }: WpProps) {
  const url = `https://en.wikipedia.org/wiki/${lemma}`

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Icon name="wikipedia w" />
    </a>
  )
}
