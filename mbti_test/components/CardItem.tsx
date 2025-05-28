// components/CardItem.tsx

import Link from "next/link";
import Image from "next/image";

type Card = {
  id: string;
  title: string;
  mbtiType: string;
  user: {
    username: string;
    image?: string | null; // เพิ่ม field image ถ้าต้องการใช้รูป
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

      {/* ✅ เพิ่มลิงก์ไปหน้าโปรไฟล์และรูปโปรไฟล์ */}
      <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
        by{" "}
        <Link
          href={`/profile/${card.user.username}`}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          <Image
            src={card.user.image || "/default-avatar.png"}
            alt={card.user.username}
            width={20}
            height={20}
            className="rounded-full object-cover"
          />
          @{card.user.username}
        </Link>
      </p>
    </div>
  );
}
