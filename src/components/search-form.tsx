import { useState, useRef, useEffect } from "react";

export function SearchForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
    <form className="group m-2 flex w-full" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        className="flex-1 rounded-l-md border-2 border-r-0 border-teal-800/90 bg-teal-950/50 p-3 text-teal-50 group-hover:border-teal-900/90 group-active:border-teal-950/90 placeholder:italic hover:text-teal-100/90 focus-visible:outline-hidden active:text-teal-200/90"
        placeholder="Search for everything and more"
      />

      <button
        type="submit"
        className="cursor-pointer rounded-r-md bg-teal-800/90 px-4 py-2 text-lg text-teal-50 font-stretch-condensed transition-colors group-hover:bg-teal-900/90 group-active:bg-teal-950/90 hover:text-teal-200/90 active:text-teal-200/90"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
}
