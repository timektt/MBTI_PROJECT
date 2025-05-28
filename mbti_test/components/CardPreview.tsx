import Link from "next/link";
import Image from "next/image";

type CardPreviewType = {
  id: string;
  title: string;
  mbtiType: string;
  user: {
    username: string | null;
    image?: string | null; // เพิ่ม field image ถ้าต้องการใช้รูป
  };
};

export default function CardPreview({ card }: { card: CardPreviewType }) {
  return (
    <Link
      href={`/card/${card.id}`}
      className="border rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition block"
    >
      <p className="font-bold text-purple-600 dark:text-purple-400">{card.mbtiType}</p>
      <p className="text-sm text-gray-500">{card.title}</p>
      <p className="text-xs text-gray-400 mt-2 flex items-center gap-2">
        by{" "}
        <Link
          href={`/profile/${card.user?.username ?? ""}`}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          {/* เพิ่มรูปโปรไฟล์ */}
          <Image
            src={card.user?.image || "/default-avatar.png"}
            alt={card.user?.username || "user"}
            width={20}
            height={20}
            className="rounded-full object-cover"
          />
          @{card.user?.username}
        </Link>
      </p>
    </Link>
  );
}
