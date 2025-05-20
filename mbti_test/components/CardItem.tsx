// components/CardItem.tsx

import Link from "next/link";

type Card = {
  id: string;
  title: string;
  mbtiType: string;
  user: {
    username: string;
  };
};

export default function CardItem({ card }: { card: Card }) {
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition">
      <p className="text-lg font-semibold text-purple-700 dark:text-purple-400">
        {card.mbtiType}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {card.title}
      </p>
      <Link
        href={`/card/${card.id}`}
        className="text-blue-600 hover:underline text-sm"
      >
        View Card
      </Link>

      {/* ✅ เพิ่มลิงก์ไปหน้าโปรไฟล์ */}
      <p className="text-xs text-gray-500 mt-2">
        by{" "}
        <Link
          href={`/profile/${card.user.username}`}
          className="text-blue-600 hover:underline"
        >
          @{card.user.username}
        </Link>
      </p>
    </div>
  );
}
