import { Item, Button, Label, Icon } from 'semantic-ui-react'
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

  // Calculate cost for N generators starting from current count
  const getCostForN = (n: number): Record<string, number> => {
    const costs: Record<string, number> = {}
    for (const [itemKey, baseCost] of Object.entries(generator.cost)) {
      let totalCost = 0
      for (let i = 0; i < n; i++) {
        totalCost += Math.ceil(baseCost * Math.pow(multiplier, count + i))
      }
      costs[itemKey] = totalCost
    }
    return costs
  }

  // Calculate max purchasable
  const getMaxAffordable = (): number => {
    if (Object.keys(generator.cost).length === 0) return 100 // Free generators
    let maxN = 0
    for (let n = 1; n <= 1000; n++) {
      const costs = getCostForN(n)
      let canAfford = true
      for (const [itemKey, cost] of Object.entries(costs)) {
        if ((itemStates[itemKey]?.count ?? 0) < cost) {
          canAfford = false
          break
        }
      }
      if (canAfford) maxN = n
      else break
    }
    return maxN
  }

  const nextCost = getCostForN(1)
  const hasCost = Object.keys(nextCost).length > 0

  // Check if player can afford N purchases
  const canAffordN = (n: number): boolean => {
    const costs = getCostForN(n)
    for (const [itemKey, cost] of Object.entries(costs)) {
      const have = itemStates[itemKey]?.count ?? 0
      if (have < cost) return false
    }
    return true
  }

  const handlePurchase = (n: number) => {
    dispatch({ type: 'purchaseGenerator', payload: { generator: generatorKey, count: n } })
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

  const affordable1 = canAffordN(1)
  const affordable10 = canAffordN(10)
  const maxAffordable = getMaxAffordable()

  // Format produces/consumes as inline text
  const producesText = Object.entries(generator.outputs)
    .map(([output, amount]) => `${amount} ${matter.items[output]?.name ?? output}`)
    .join(', ')
  const consumesText = Object.entries(generator.inputs)
    .map(([input, amount]) => `${amount} ${matter.items[input]?.name ?? input}`)
    .join(', ')

  return (
    <Item>
      <Item.Image size="tiny" src={placeholderImg} />
      <Item.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Item.Header as="h4" style={{ marginBottom: '0.25em' }}>{generator.name}</Item.Header>
            <Item.Meta style={{ marginBottom: '0.25em' }}>
              {generator.desc} <Wp lemma={generator.wp} />
            </Item.Meta>
            <div style={{ fontSize: '0.85em', color: '#666' }}>
              {producesText && <span>Produces: {producesText}</span>}
              {producesText && consumesText && <span> · </span>}
              {consumesText && <span>Consumes: {consumesText}</span>}
              {Object.keys(generator.inputs).length > 0 &&
                generatorPrediction &&
                generatorPrediction.utilizationMax !== 0 && (
                  <span> · Efficiency: {Math.trunc(100 * generatorPrediction.utilization)}%</span>
                )}
            </div>
          </div>
          <div style={{ textAlign: 'right', marginLeft: '1em' }}>
            <div style={{ marginBottom: '0.25em' }}>
              <strong>{count}</strong> <span style={{ fontSize: '0.85em', color: '#666' }}>owned</span>
            </div>
            <Button.Group size="mini">
              <Button
                disabled={count === 0}
                onClick={handleSell}
                title="Sell for 50% refund"
              >
                Sell
              </Button>
              <Button
                color={affordable1 ? 'green' : undefined}
                disabled={!affordable1 && hasCost}
                onClick={() => handlePurchase(1)}
              >
                +1
              </Button>
              <Button
                color={affordable10 ? 'green' : undefined}
                disabled={!affordable10 && hasCost}
                onClick={() => handlePurchase(10)}
              >
                +10
              </Button>
              <Button
                color={maxAffordable > 0 ? 'green' : undefined}
                disabled={maxAffordable === 0 && hasCost}
                onClick={() => handlePurchase(maxAffordable)}
                title={`Buy ${maxAffordable}`}
              >
                Max
              </Button>
            </Button.Group>
            <div style={{ fontSize: '0.8em', color: '#888', marginTop: '0.25em' }}>
              {hasCost ? (
                <>
                  {Object.entries(nextCost).map(([itemKey, cost], i) => (
                    <span key={itemKey}>
                      {i > 0 && ', '}
                      <span style={{ color: (itemStates[itemKey]?.count ?? 0) >= cost ? 'green' : 'red' }}>
                        {formatCompact(cost, { style: numberFormat })} {matter.items[itemKey]?.name ?? itemKey}
                      </span>
                    </span>
                  ))}
                </>
              ) : (
                <span>Free</span>
              )}
            </div>
          </div>
        </div>

          {upgrades.length > 0 && (
            <div style={{ marginTop: '0.75em', borderTop: '1px solid #eee', paddingTop: '0.5em' }}>
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
                let bgColor = 'transparent'
                if (isActive) bgColor = '#e8f5e9'
                if (isExpired) bgColor = '#fff3e0'

                return (
                  <div key={upgradeKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25em 0.5em', backgroundColor: bgColor, borderRadius: '4px', marginBottom: '0.25em' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 500 }}>{upgrade.name}</span>
                      {' '}
                      <span style={{ fontSize: '0.85em', color: '#666' }}>
                        {effectsForThisGenerator.map((effect, i) => (
                          <span key={i}>
                            {i > 0 && ', '}
                            {formatEffectDescription(effect, matter)}
                          </span>
                        ))}
                      </span>
                      {isActive && upgradeState?.durability !== undefined && (
                        <Label size="mini" color="blue" style={{ marginLeft: '0.5em' }}>
                          <Icon name="clock" /> {formatTimeRemaining(upgradeState.durability)}
                        </Label>
                      )}
                      {upgrade.expiration && !isOwned && (
                        <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '0.5em' }}>
                          ({formatTimeRemaining(upgrade.expiration)})
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {isActive && upgradeState?.durability === undefined && (
                        <Label size="mini" color="green">
                          <Icon name="check" /> Owned
                        </Label>
                      )}
                      {isExpired && (
                        <Label size="mini" color="orange">
                          <Icon name="redo" /> Expired
                        </Label>
                      )}
                      {(!isOwned || isExpired) && (
                        <>
                          <Button
                            size="mini"
                            color={upgradeAffordable ? 'green' : undefined}
                            disabled={!upgradeAffordable}
                            onClick={() => handlePurchaseUpgrade(upgradeKey)}
                          >
                            {isExpired ? 'Rebuy' : 'Buy'}
                          </Button>
                          <div style={{ fontSize: '0.75em', color: '#888', marginTop: '0.15em' }}>
                            {Object.entries(upgrade.cost).map(([itemKey, cost], i) => (
                              <span key={itemKey}>
                                {i > 0 && ', '}
                                <span style={{ color: (itemStates[itemKey]?.count ?? 0) >= cost ? 'green' : 'red' }}>
                                  {formatCompact(cost, { style: numberFormat })} {matter.items[itemKey]?.name ?? itemKey}
                                </span>
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
      </Item.Content>
    </Item>
  )
}
