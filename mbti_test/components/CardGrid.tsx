import CardItem from "./CardItem";
import Link from "next/link";
import Image from "next/image";

type CardGridProps = {
  cards: {
    id: string;
    title: string;
    mbtiType: string;
    user: {
      username: string;
      image?: string | null; // เพิ่ม image เพื่อใช้กับ <Image />
    };
  }[];
};

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.id}>
          <CardItem card={card} />

          {/* เพิ่มรูปโปรไฟล์และลิงก์ไปหน้าโปรไฟล์ */}
          <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            by{" "}
            <Link
              href={`/profile/${card.user.username}`}
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <Image
                src={card.user.image || "/default-avatar.png"}
                alt={card.user.username}
                width={24}
                height={24}
                className="rounded-full object-cover"
                // ถ้าใช้ Next.js 13+ ให้เพิ่ม priority หรือ loading="lazy" ได้
              />
              {card.user.username}
            </Link>
          </p>
        </div>
      ))}
    </div>
  );
}
