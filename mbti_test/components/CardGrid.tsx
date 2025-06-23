import CardItem from "./CardItem";
import Link from "next/link";
import Image from "next/image";
import type { CardItem as CardType } from "@/types/card";

type CardGridProps = {
  cards: CardType[];
};

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.id}>
          <CardItem card={card} />

          {/* Profile + Link */}
          <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            by{" "}
            <Link
              href={`/profile/${card.user.username}`}
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <Image
                src={card.user.image || "/default-avatar.png"}
                alt={card.user.username || "user"}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
              {card.user.username}
            </Link>
          </p>
        </div>
      ))}
    </div>
  );
}
