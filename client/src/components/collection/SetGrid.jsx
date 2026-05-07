import SetCard from './SetCard'

export default function SetGrid({ sets }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {sets.map(set => (
        <SetCard key={set.id} set={set} />
      ))}
    </div>
  )
}
