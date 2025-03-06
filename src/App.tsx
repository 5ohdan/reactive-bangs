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
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-neutral-950 to-neutral-800/70 transition-colors duration-200">
          <CustomBangs checkBangExists={checkBangExists} />
          <h1 className="line text-6xl font-semibold text-teal-50 font-stretch-condensed">
            Bang
            <span className="rounded-lg bg-teal-100 font-medium text-teal-950 italic">
              {" "}
              it{" "}
            </span>
            out
          </h1>
          {query && !cleanQuery && (
            <h1 className="mt-4 text-3xl font-light text-gray-200/70 decoration-2 hover:underline hover:underline-offset-2">
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

  const searchUrls = matchList
    .map((bang: Bang | CustomBang | undefined) => {
      if (!bang) return null;

      return "custom" in bang && bang.custom === true
        ? searchCustomBang(bang.t, cleanQuery)
        : searchUrl(bang.t, cleanQuery);
    })
    .filter(Boolean);

  if (matchList.length === 0 || searchUrls.length === 0) {
    const defaultSearchUrl = searchUrl(defaultBang.t, cleanQuery);
    if (defaultSearchUrl) {
      window.location.href = defaultSearchUrl;
      return null;
    }
  }

  searchUrls.forEach((url, index) => {
    if (!url) return;
    if (index === searchUrls.length - 1) {
      setTimeout(() => {
        window.location.href = url;
      }, searchUrls.length * 100);
    } else {
      setTimeout(() => {
        window.open(url, "_blank");
      }, index * 100);
    }
  });
}

export default App;
