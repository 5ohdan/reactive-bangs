import { bangs } from "./bang.ts";
import {
  type CustomBang,
  CustomBangs,
  getCustomBangs,
} from "./components/custom-bangs";

// Interface for built-in bangs
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

  if (!query) {
    return (
      <main className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <h1 className="text-2xl">
          You know `Unduck`? This's my implementation in React
        </h1>
        <CustomBangs checkBangExists={checkBangExists} />
      </main>
    );
  }

  const MAX_BANGS = 3;
  const DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
  const defaultBang = bangs.find((bang) => bang.t === DEFAULT_BANG)!;

  const match = query.match(/!(\S+)/gi) || [];

  const matchList = match
    .slice(0, MAX_BANGS)
    .map((bang: string) => bang.toLowerCase().replace("!", ""))
    .map((bang: string) => {
      // First check if it's a custom bang
      const customBang = customBangs.find((b: CustomBang) => b.t === bang);
      if (customBang) return customBang;

      // If not, check if it's a built-in bang
      const builtInBang = bangs.find((b) => b.t === bang);
      // Return the built-in bang as is (it doesn't have the c property)
      return builtInBang;
    });

  const cleanQuery = query.replace(/!(\S+)/gi, "").trim();

  if (!cleanQuery) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        <h1 className="text-4xl underline">
          No query provided, please provide a query
        </h1>
      </main>
    );
  }

  if (matchList.length === 0) {
    window.location.href = searchUrl(defaultBang.t, cleanQuery)!;
  }

  console.log({ matchList });

  const searchUrls = matchList.map((bang: Bang | CustomBang | undefined) => {
    if (!bang) return null;

    return "custom" in bang && bang.custom === true
      ? searchCustomBang(bang.t, cleanQuery)
      : searchUrl(bang.t, cleanQuery);
  });

  console.log({ searchUrls });

  searchUrls.forEach((url, index) => {
    if (index === searchUrls.length - 1) {
      window.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  });
}

export default App;
