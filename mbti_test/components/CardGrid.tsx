import CardItem from "./CardItem"

type CardGridProps = {
  cards: {
    id: string
    title: string
    mbtiType: string
    user: {
      username: string
    }
  }[]
}

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  )
}
