import { useState } from "react";
import { CUSTOM_BANGS } from "../constants";

export interface CustomBang {
  t: string;
  u: string;
  custom: boolean;
}

export const getCustomBangs = () => {
  return JSON.parse(localStorage.getItem(CUSTOM_BANGS) || "[]");
};

const addCustomBang = (trigger: string, url: string) => {
  const customBangs = getCustomBangs();
  if (customBangs.find((bang: CustomBang) => bang.t === trigger)) {
    alert("Bang already exists");
    return;
  }
  customBangs.push({ t: trigger, u: url, custom: true });
  localStorage.setItem(CUSTOM_BANGS, JSON.stringify(customBangs));
};

const removeCustomBang = (trigger: string) => {
  const customBangs = getCustomBangs();
  customBangs.splice(
    customBangs.findIndex((bang: CustomBang) => bang.t === trigger),
    1
  );
  localStorage.setItem(CUSTOM_BANGS, JSON.stringify(customBangs));
};

export function CustomBangs({
  checkBangExists,
}: {
  checkBangExists: (trigger: string) => boolean;
}) {
  const [customBangs, setCustomBangs] = useState<CustomBang[]>(
    getCustomBangs()
  );

  const [trigger, setTrigger] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isUrlValid = url.includes("{{{s}}}");

    if (!trigger || !url) {
      alert("Please provide a trigger and URL");
      return;
    }

    if (!isUrlValid) {
      alert("Please provide a valid URL");
      return;
    }

    if (checkBangExists(trigger)) {
      alert("Bang already exists");
      return;
    }

    addCustomBang(trigger, url);
    setCustomBangs(getCustomBangs());
    setTrigger("");
    setUrl("");
  };
  return (
    <div className="flex flex-col space-y-3 bg-neutral-600 p-4 rounded-md text-white w-2/3">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          className="bg-neutral-200 p-3 rounded-md text-black placeholder:text-neutral-700/50"
          name="trigger"
          type="text"
          placeholder="Trigger"
          required
          minLength={1}
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
        />
        <input
          className="bg-neutral-200 p-3 rounded-md text-black placeholder:text-neutral-700/50"
          name="url"
          type="text"
          placeholder="URL"
          required
          minLength={1}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="bg-neutral-400 p-2 rounded-md text-black cursor-pointer"
          type="submit"
        >
          Add
        </button>
      </form>
      <table className="flex flex-col space-y-3 w-full">
        <thead>
          <tr className="flex">
            <th className="text-left flex-1">Trigger</th>
            <th className="text-left flex-1">URL</th>
            <th className="text-left flex-1">Remove</th>
          </tr>
        </thead>
        <tbody>
          {customBangs.length > 0 ? (
            customBangs.map((bang: CustomBang) => (
              <tr key={bang.t} className="flex">
                <td className="flex-1">{bang.t}</td>
                <td className="flex-1">{bang.u}</td>
                <td className="flex-1">
                  <button
                    onClick={() => {
                      removeCustomBang(bang.t);
                      setCustomBangs(getCustomBangs());
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No custom bangs</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
