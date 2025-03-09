import { useState, useRef, useEffect } from "react";
import "./search-animation.css";

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
    <form
      className="animated-search-container m-2 w-full pt-4"
      onSubmit={handleSubmit}
    >
      <label htmlFor="search">Search</label>
      <input
        ref={inputRef}
        id="search"
        type="search"
        pattern=".*\S.*"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
        placeholder="Search for everything and more"
      />
      <span className="caret"></span>
    </form>
  );
}
