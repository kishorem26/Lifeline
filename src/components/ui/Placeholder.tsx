export function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="card grid min-h-[50vh] place-items-center p-10 text-center">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-muted">Coming in {phase}.</p>
      </div>
    </div>
  )
}
