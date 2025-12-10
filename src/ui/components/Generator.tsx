import { Item, Button, Statistic, Label, Icon } from 'semantic-ui-react'
import { useDispatch, useGameState, useMatter } from '../hooks'
import { formatCompact } from '../../engine/format'
import Wp from './Wp'
import placeholderImg from '../../images/image.png'
import type { UpgradeEffect } from '../../engine/types'

interface GeneratorProps {
  generatorKey: string
}

function formatEffectDescription(effect: UpgradeEffect, matter: ReturnType<typeof useMatter>): string {
  switch (effect.type) {
    case 'efficiency':
      const percent = Math.round((effect.value - 1) * 100)
      return percent >= 0 ? `+${percent}% speed` : `${percent}% speed`
    case 'addOutput':
      return `+${effect.value} ${matter.items[effect.target ?? '']?.name ?? effect.target}/s`
    case 'addInput':
      return `+${effect.value} ${matter.items[effect.target ?? '']?.name ?? effect.target}/s input`
    case 'reduceInput':
      return `-${effect.value} ${matter.items[effect.target ?? '']?.name ?? effect.target}/s input`
    default:
      return ''
  }
}

export default function Generator({ generatorKey }: GeneratorProps) {
  const dispatch = useDispatch()
  const matter = useMatter()
  const generatorState = useGameState(state => state.generators[generatorKey])
  const upgradeStates = useGameState(state => state.upgrades)
  const itemStates = useGameState(state => state.items)
  const prediction = useGameState(state => state.prediction?.result)
  const numberFormat = useGameState(state => state.settings.numberFormat)

  const generator = matter.generators[generatorKey]
  if (!generator) return null

  const count = generatorState?.count ?? 0
  const generatorPrediction = prediction?.generators[generatorKey]
  const multiplier = generator.costMultiplier ?? 1

  // Calculate cost for next generator purchase
  const getNextCost = (): Record<string, number> => {
    const costs: Record<string, number> = {}
    const scale = Math.pow(multiplier, count)
    for (const [itemKey, baseCost] of Object.entries(generator.cost)) {
      costs[itemKey] = Math.ceil(baseCost * scale)
    }
    return costs
  }

  const nextCost = getNextCost()
  const hasCost = Object.keys(nextCost).length > 0

  // Check if player can afford next purchase
  const canAffordGenerator = (): boolean => {
    for (const [itemKey, cost] of Object.entries(nextCost)) {
      const have = itemStates[itemKey]?.count ?? 0
      if (have < cost) return false
    }
    return true
  }

  const handlePurchase = () => {
    dispatch({ type: 'purchaseGenerator', payload: { generator: generatorKey, count: 1 } })
    dispatch({ type: 'updatePrediction' })
  }

  const handleSell = () => {
    if (count > 0) {
      dispatch({ type: 'sellGenerator', payload: { generator: generatorKey, count: 1 } })
      dispatch({ type: 'updatePrediction' })
    }
  }

  // Find upgrades for this generator
  const upgrades = Object.keys(matter.upgrades).filter(upgradeKey =>
    matter.upgrades[upgradeKey].effects.some((effect: { generator: string }) => effect.generator === generatorKey)
  )

  // Check if player can afford an upgrade
  const canAffordUpgrade = (upgradeKey: string): boolean => {
    const upgrade = matter.upgrades[upgradeKey]
    if (!upgrade) return false
    for (const [itemKey, cost] of Object.entries(upgrade.cost)) {
      const have = itemStates[itemKey]?.count ?? 0
      if (have < cost) return false
    }
    return true
  }

  const handlePurchaseUpgrade = (upgradeKey: string) => {
    dispatch({ type: 'purchaseUpgrade', payload: { upgrade: upgradeKey } })
    dispatch({ type: 'updatePrediction' })
  }

  const affordable = canAffordGenerator()

  return (
    <Item>
      <Item.Image size="tiny" src={placeholderImg} />
      <Item.Content>
        <Item.Header as="h3">{generator.name}</Item.Header>
        <Item.Meta>
          {generator.desc} <Wp lemma={generator.wp} />
        </Item.Meta>
        <Item.Description>
          {Object.keys(generator.outputs).length > 0 && (
            <div>
              Produces:
              <ul>
                {Object.entries(generator.outputs).map(([output, amount]) => (
                  <li key={output}>
                    {amount} {matter.items[output]?.name ?? output}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Object.keys(generator.inputs).length > 0 && (
            <div>
              Consumes:
              <ul>
                {Object.entries(generator.inputs).map(([input, amount]) => (
                  <li key={input}>
                    {amount} {matter.items[input]?.name ?? input}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Object.keys(generator.inputs).length > 0 &&
            generatorPrediction &&
            generatorPrediction.utilizationMax !== 0 && (
              <div>
                Efficiency: {Math.trunc(100 * generatorPrediction.utilization)}%
              </div>
            )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginTop: '0.5em' }}>
            <Statistic size="tiny">
              <Statistic.Value>{count}</Statistic.Value>
              <Statistic.Label>owned</Statistic.Label>
            </Statistic>

            <div>
              <Button.Group size="mini">
                <Button
                  disabled={count === 0}
                  onClick={handleSell}
                  title="Sell for 50% refund"
                >
                  Sell
                </Button>
                <Button
                  color={affordable ? 'green' : undefined}
                  disabled={!affordable && hasCost}
                  onClick={handlePurchase}
                >
                  Buy
                </Button>
              </Button.Group>
              {hasCost && (
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '0.25em' }}>
                  Cost: {Object.entries(nextCost).map(([itemKey, cost]) => (
                    <span
                      key={itemKey}
                      style={{
                        marginRight: '0.5em',
                        color: (itemStates[itemKey]?.count ?? 0) >= cost ? 'green' : 'red'
                      }}
                    >
                      {formatCompact(cost, { style: numberFormat })} {matter.items[itemKey]?.name ?? itemKey}
                    </span>
                  ))}
                </div>
              )}
              {!hasCost && (
                <div style={{ fontSize: '0.85em', color: '#888', marginTop: '0.25em' }}>
                  Free
                </div>
              )}
            </div>
          </div>

          {upgrades.length > 0 && (
            <div style={{ marginTop: '1em' }}>
              <strong>Upgrades</strong>
              <div style={{ marginTop: '0.5em' }}>
                {upgrades.map(upgradeKey => {
                  const upgrade = matter.upgrades[upgradeKey]
                  const upgradeState = upgradeStates[upgradeKey]
                  const isOwned = upgradeState?.acquired ?? false
                  const isExpired = upgradeState?.durability !== undefined && upgradeState.durability <= 0
                  const isActive = isOwned && !isExpired
                  const upgradeAffordable = canAffordUpgrade(upgradeKey)
                  const effectsForThisGenerator = upgrade.effects.filter(e => e.generator === generatorKey)

                  // Format remaining time for expiring upgrades
                  const formatTimeRemaining = (seconds: number): string => {
                    if (seconds <= 0) return 'Expired'
                    const mins = Math.floor(seconds / 60)
                    const secs = Math.floor(seconds % 60)
                    if (mins > 0) return `${mins}:${secs.toString().padStart(2, '0')}`
                    return `${secs}s`
                  }

                  // Determine background color based on state
                  let bgColor = '#f5f5f5' // default
                  if (isActive) bgColor = '#e8f5e9' // green for active
                  if (isExpired) bgColor = '#fff3e0' // orange for expired (can rebuy)

                  return (
                    <div key={upgradeKey} style={{ marginBottom: '0.5em', padding: '0.5em', backgroundColor: bgColor, borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{upgrade.name}</strong>
                          {isActive && upgradeState?.durability === undefined && (
                            <Label size="mini" color="green" style={{ marginLeft: '0.5em' }}>
                              <Icon name="check" /> Owned
                            </Label>
                          )}
                          {isActive && upgradeState?.durability !== undefined && (
                            <Label size="mini" color="blue" style={{ marginLeft: '0.5em' }}>
                              <Icon name="clock" /> {formatTimeRemaining(upgradeState.durability)}
                            </Label>
                          )}
                          {isExpired && (
                            <Label size="mini" color="orange" style={{ marginLeft: '0.5em' }}>
                              <Icon name="redo" /> Expired
                            </Label>
                          )}
                          {upgrade.expiration && !isOwned && (
                            <Label size="mini" basic style={{ marginLeft: '0.5em' }}>
                              <Icon name="clock outline" /> {formatTimeRemaining(upgrade.expiration)}
                            </Label>
                          )}
                        </div>
                        {(!isOwned || isExpired) && (
                          <Button
                            size="mini"
                            color={upgradeAffordable ? 'green' : undefined}
                            disabled={!upgradeAffordable}
                            onClick={() => handlePurchaseUpgrade(upgradeKey)}
                          >
                            {isExpired ? 'Rebuy' : 'Buy'}
                          </Button>
                        )}
                      </div>
                      <div style={{ fontSize: '0.9em', color: '#666', marginTop: '0.25em' }}>
                        {upgrade.desc}
                      </div>
                      <div style={{ fontSize: '0.85em', marginTop: '0.25em' }}>
                        {effectsForThisGenerator.map((effect, i) => (
                          <Label key={i} size="mini" basic>
                            {formatEffectDescription(effect, matter)}
                          </Label>
                        ))}
                      </div>
                      {(!isOwned || isExpired) && (
                        <div style={{ fontSize: '0.85em', color: '#888', marginTop: '0.25em' }}>
                          Cost: {Object.entries(upgrade.cost).map(([itemKey, cost]) => (
                            <span key={itemKey} style={{ marginRight: '0.5em', color: (itemStates[itemKey]?.count ?? 0) >= cost ? 'green' : 'red' }}>
                              {formatCompact(cost, { style: numberFormat })} {matter.items[itemKey]?.name ?? itemKey}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Item.Description>
      </Item.Content>
    </Item>
  )
}
