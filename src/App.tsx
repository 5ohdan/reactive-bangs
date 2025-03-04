import { bangs } from "./bang.ts";
import { type CustomBang, CustomBangs } from "./components/custom-bangs";
import { SearchForm } from "./components/search-form";
import { getCustomBangs } from "./helpers";

interface Bang {
  t: string;
  u: string;
}

const customBangs = getCustomBangs();

const checkBangExists = (trigger: string) =>
  bangs.findIndex((bang: Bang) => bang.t === trigger) !== -1;

const searchUrl = (trigger: string, query: string) =>
  bangs.find((bang: Bang) => bang.t === trigger)?.u.replace("{{{s}}}", query);

const searchCustomBang = (trigger: string, query: string) =>
  customBangs
    .find((bang: CustomBang) => bang.t === trigger)
    ?.u.replace("{{{s}}}", query);

function App() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";

  const MAX_BANGS = 3;
  const DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
  const defaultBang = bangs.find((bang) => bang.t === DEFAULT_BANG)!;

  const match = query.match(/!(\S+)/gi) || [];

  const matchList = match
    .slice(0, MAX_BANGS)
    .map((bang: string) => bang.toLowerCase().replace("!", ""))
    .map((bang: string) => {
      const customBang = customBangs.find((b: CustomBang) => b.t === bang);
      if (customBang) return customBang;

      const builtInBang = bangs.find((b) => b.t === bang);
      return builtInBang;
    });

  const cleanQuery = query.replace(/!(\S+)/gi, "").trim();

  if (!query || !cleanQuery) {
    return (
      <>
        <CustomBangs checkBangExists={checkBangExists} />

        <main className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <h1 className="text-3xl font-bold">Und*ck-React</h1>
          {query && !cleanQuery && (
            <h1 className="text-4xl font-bold mt-4">
              No query provided, please provide a query
            </h1>
          )}
          <div className="mx-auto w-full max-w-2xl pt-4">
            <SearchForm />
          </div>
        </main>
      </>
    );
  }

  if (matchList.length === 0) {
    const defaultSearchUrl = searchUrl(defaultBang.t, cleanQuery);
    if (defaultSearchUrl) {
      window.location.href = defaultSearchUrl;
      return null;
    }
  }

  const searchUrls = matchList
    .map((bang: Bang | CustomBang | undefined) => {
      if (!bang) return null;

      return "custom" in bang && bang.custom === true
        ? searchCustomBang(bang.t, cleanQuery)
        : searchUrl(bang.t, cleanQuery);
    })
    .filter(Boolean);

  searchUrls.forEach((url, index) => {
    if (url) {
      if (index === searchUrls.length - 1) {
        window.location.href = url;
      } else {
        window.open(url, "_blank");
      }
    }
  });

  return (
    <>
      <CustomBangs checkBangExists={checkBangExists} />
    </>
  );
}

export default App;
