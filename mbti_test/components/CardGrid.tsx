import CardItem from "./CardItem";
import Link from "next/link";

type CardGridProps = {
  cards: {
    id: string;
    title: string;
    mbtiType: string;
    user: {
      username: string;
    };
  }[];
};

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.id}>
          <CardItem card={card} />

          {/* ✅ เพิ่มลิงก์ไปหน้าโปรไฟล์ */}
          <p className="mt-2 text-sm text-gray-500">
            by{" "}
            <Link
              href={`/profile/${card.user.username}`}
              className="text-blue-600 hover:underline"
            >
              {card.user.username}
            </Link>
          </p>
        </div>
      ))}
    </div>
  );
}
