import { useState } from "react";

export function SearchForm() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      alert("Please provide a query");
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.location.href = url.toString();
  };

  return (
    <form className="flex gap-2 w-full py-2" onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        className="flex-1 rounded-md p-2 border-2 border-neutral-200"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>
    </form>
  );
}
