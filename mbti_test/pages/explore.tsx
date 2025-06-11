// /pages/explore.tsx
import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import CardGrid from "@/components/CardGrid";
import FilterSidebar from "@/components/FilterSidebar";

type Card = {
  id: string;
  title: string;
  mbtiType: string;
  user: {
    username: string;
  };
};

export default function ExplorePage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mbtiFilter, setMbtiFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchCards = async (pageToFetch: number, reset = false) => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pageToFetch.toString(),
        mbti: mbtiFilter,
        search,
      });

      const res = await fetch(`/api/cards/list?${query.toString()}`);
      const data = await res.json();

      // 🔹 ใช้ data.items แทน data.cards
      if (reset) {
        setCards(data.items ?? []);
      } else {
        setCards((prev) => [...prev, ...(data.items ?? [])]);
      }

      setHasMore(data.hasMore);
      setPage(pageToFetch + 1);
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchCards(page);
  }, [page, hasMore, loading, mbtiFilter, search]);

  useEffect(() => {
    // Reset cards when filter or search changes
    setPage(1);
    setHasMore(true);
    fetchCards(1, true);
  }, [mbtiFilter, search]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <>
      <Head>
        <title>Explore MBTI Cards | MBTI.AI</title>
        <meta
          name="description"
          content="Browse personality cards created by the community."
        />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-white">
          Explore MBTI Cards
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <FilterSidebar
              mbtiFilter={mbtiFilter}
              setMbtiFilter={setMbtiFilter}
              search={search}
              setSearch={setSearch}
            />
          </div>

          <div className="md:w-3/4">
            <CardGrid cards={cards ?? []} />
            {loading && (
              <p className="text-center mt-4 text-gray-500">Loading...</p>
            )}
            {!hasMore && !loading && (
              <p className="text-center mt-6 text-gray-400">No more cards.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
