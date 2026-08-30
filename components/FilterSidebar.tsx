type FilterSidebarProps = {
    mbtiFilter: string
    setMbtiFilter: (value: string) => void
    search: string
    setSearch: (value: string) => void
  }
  
  export default function FilterSidebar({
    mbtiFilter,
    setMbtiFilter,
    search,
    setSearch,
  }: FilterSidebarProps) {
    return (
      <div className="space-y-4">
        <div>
          <label
            htmlFor="mbtiFilter"
            className="block text-sm font-medium mb-1"
          >
            Filter by MBTI
          </label>
          <select
            id="mbtiFilter"
            value={mbtiFilter}
            onChange={(e) => setMbtiFilter(e.target.value)}
            className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Types</option>
            {[
              "INTJ", "INTP", "ENTJ", "ENTP",
              "INFJ", "INFP", "ENFJ", "ENFP",
              "ISTJ", "ISFJ", "ESTJ", "ESFJ",
              "ISTP", "ISFP", "ESTP", "ESFP",
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label
            htmlFor="searchTitle"
            className="block text-sm font-medium mb-1"
          >
            Search by Title
          </label>
          <input
            id="searchTitle"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white"
            placeholder="Search..."
          />
        </div>
      </div>
    )
  }
  