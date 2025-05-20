import Link from "next/link"


type CardPreviewType = {
    id: string
    title: string
    mbtiType: string
    user: {
      username: string | null
    }
  }
  
  export default function CardPreview({ card }: { card: CardPreviewType }) {
    return (
      <Link href={`/card/${card.id}`} className="border rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition block">
        <p className="font-bold text-purple-600 dark:text-purple-400">{card.mbtiType}</p>
        <p className="text-sm text-gray-500">{card.title}</p>
        <p className="text-xs text-gray-400 mt-2">
          by{" "}
          <Link
            href={`/profile/${card.user?.username}`}
            className="text-blue-600 hover:underline"
          >
            @{card.user?.username}
          </Link>
        </p>

      </Link>
    )
  }
  