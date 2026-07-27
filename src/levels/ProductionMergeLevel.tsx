import { LEVELS } from '../content/gameContent'
import { FixSequenceLevel } from '../components/FixSequenceLevel'
import './ProductionMergeLevel.css'

const level = LEVELS.find((l) => l.id === 'production-merge')!

function Scene({ fixIndex, isComplete }: { fixIndex: number; isComplete: boolean }) {
  const mergeResolved = fixIndex >= 1
  const commitCreated = fixIndex >= 2
  const pipelineRun = fixIndex >= 3

  return (
    <div className="merge-scene mono">
      <div className={`merge-block ${mergeResolved ? 'merge-block-resolved' : 'merge-block-conflict'}`}>
        {mergeResolved ? (
          <p>const developer = {'{'} name: "Nahuel", alias: "Zuku" {'}'};</p>
        ) : (
          <>
            <p className="merge-marker">&lt;&lt;&lt;&lt;&lt;&lt;&lt; feature</p>
            <p>const developer = "Nahuel";</p>
            <p className="merge-marker">=======</p>
            <p>const developer = "Zuku";</p>
            <p className="merge-marker">&gt;&gt;&gt;&gt;&gt;&gt;&gt; main</p>
          </>
        )}
      </div>

      <ul className="merge-steps">
        <li className={mergeResolved ? 'merge-step-done' : ''}>{mergeResolved ? '✓' : '○'} merge resolved</li>
        <li className={commitCreated ? 'merge-step-done' : ''}>{commitCreated ? '✓' : '○'} commit created</li>
        <li className={pipelineRun ? 'merge-step-done' : ''}>{pipelineRun ? '✓' : '○'} pipeline green</li>
        <li className={isComplete ? 'merge-step-done' : ''}>{isComplete ? '✓' : '○'} deployed to production</li>
      </ul>

      {isComplete && <p className="merge-badge">PRODUCTION ● LIVE</p>}
    </div>
  )
}

export function ProductionMergeLevel() {
  return (
    <FixSequenceLevel
      level={level}
      introLine="Hay un conflicto de merge bloqueando el deploy a producción."
      scene={({ fixIndex, isComplete }) => <Scene fixIndex={fixIndex} isComplete={isComplete} />}
    />
  )
}
