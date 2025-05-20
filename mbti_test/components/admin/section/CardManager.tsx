import { useEffect, useState } from "react";
import Link from "next/link";

type Card = {
  id: string;
  title: string;
  mbti: string;
  createdAt: string;
  author: {
    username: string | null;
    image: string | null;
  };
};

export default function CardsManager() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/cards/list")
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load cards");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    const res = await fetch(`/api/admin/cards/delete?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setCards((prev) => prev.filter((card) => card.id !== id));
    } else {
      alert("Failed to delete.");
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="p-4 bg-white dark:bg-gray-800 rounded shadow border dark:border-gray-700"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{card.title}</h3>
              <p className="text-sm text-gray-400">
                MBTI: {card.mbti} · By:{" "}
                {card.author.username ? (
                  <Link
                    href={`/profile/${card.author.username}`}
                    className="text-blue-600 hover:underline"
                  >
                    @{card.author.username}
                  </Link>
                ) : (
                  "Unknown"
                )}
              </p>
              <p className="text-xs text-gray-500">{new Date(card.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/card/${card.id}`}
                target="_blank"
                className="text-blue-600 hover:underline text-sm"
              >
                View
              </Link>
              <button
                onClick={() => handleDelete(card.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
