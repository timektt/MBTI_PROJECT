import Head from "next/head"
import { useState, useEffect } from "react"
import CardPreview from "@/components/CardPreview"
import FilterSidebar from "@/components/FilterSidebar"

type CardData = {
  id: string
  title: string
  mbtiType: string
  user: {
    username: string
  }
}

export default function ExplorePage() {
  const [cards, setCards] = useState<CardData[]>([])
  const [search, setSearch] = useState("")
  const [mbtiFilter, setMbtiFilter] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true)
      const query = new URLSearchParams()
      if (search) query.append("search", search)
      if (mbtiFilter) query.append("mbti", mbtiFilter)

      try {
        const res = await fetch(`/api/explore?${query.toString()}`)
        const data = await res.json()
        setCards(data)
      } catch (error) {
        console.error("Failed to fetch cards:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [search, mbtiFilter])

  return (
    <>
      <Head>
        <title>Explore MBTI Cards</title>
      </Head>
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto px-6 py-10 gap-8">
        <div className="lg:w-64 w-full">
          <FilterSidebar
            mbtiFilter={mbtiFilter}
            setMbtiFilter={setMbtiFilter}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Explore Cards</h1>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : cards.length === 0 ? (
            <p className="text-gray-500">No cards found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <CardPreview key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
