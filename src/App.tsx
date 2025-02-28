import { bangs } from "./bang.ts";

function App() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl underline">
          You know `Unduck`? This's my implementation in React
        </h1>
      </main>
    );
  }

  const MAX_BANGS = 3;
  const DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
  const defaultBang = bangs.find((bang) => bang.t === DEFAULT_BANG)!;

  const match = query.match(/!(\S+)/gi) || [];

  const matchList = match
    .slice(0, MAX_BANGS)
    .map((bang) => bang.toLowerCase().replace("!", ""))
    .map((bang) => bangs.find((b) => b.t === bang));

  const cleanQuery = query.replace(/!(\S+)/gi, "").trim();

  if (!cleanQuery) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl underline">
          No query provided, please provide a query
        </h1>
      </main>
    );
  }

  if (matchList.length === 0) {
    window.location.href = searchUrl(defaultBang.t, cleanQuery)!;
  }

  const searchUrls = matchList.map(
    (bang) => bang?.t && searchUrl(bang.t, cleanQuery)
  );

  searchUrls.forEach((url, index) => {
    if (!url) return;
    if (index === 0) {
      window.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  });
}

const searchUrl = (trigger: string, query: string) =>
  bangs.find((bang) => bang.t === trigger)?.u.replace("{{{s}}}", query);

export default App;
