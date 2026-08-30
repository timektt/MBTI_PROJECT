"use client";

import type { CardItem } from "@/types/card";
import CardGrid from "@/components/CardGrid";


export default function CardFeed({ cards }: { cards: CardItem[] }) {
  return (
    <div className="space-y-6">
      {/* Main Feed Content */}
      <CardGrid cards={cards} />
    </div>
  );
}
