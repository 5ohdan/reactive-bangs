import { useState, useRef, useEffect } from "react";
import { getCustomBangs, addCustomBang, removeCustomBang } from "../helpers";

export interface CustomBang {
  t: string;
  u: string;
  custom: boolean;
}

export function CustomBangs({
  checkBangExists,
}: {
  checkBangExists: (trigger: string) => boolean;
}) {
  const [customBangs, setCustomBangs] =
    useState<CustomBang[]>(getCustomBangs());

  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [trigger, setTrigger] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(1px);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    if (isOpen) {
      dialogElement.showModal();
    } else {
      dialogElement.close();
    }

    const handleClose = () => setIsOpen(false);
    dialogElement.addEventListener("close", handleClose);

    const handleBackdropClick = (e: MouseEvent) => {
      const dialogRect = dialogElement.getBoundingClientRect();

      if (
        e.clientX < dialogRect.left ||
        e.clientX > dialogRect.right ||
        e.clientY < dialogRect.top ||
        e.clientY > dialogRect.bottom
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      dialogElement.addEventListener("mousedown", handleBackdropClick);
    }

    return () => {
      dialogElement.removeEventListener("close", handleClose);
      dialogElement.removeEventListener("mousedown", handleBackdropClick);
    };
  }, [isOpen]);

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
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          className="focus:ring-opacity-20 flex h-10 items-center justify-center rounded-md bg-teal-950/90 px-4 font-medium text-teal-100 shadow-sm transition-colors hover:bg-teal-800/90 hover:text-teal-200 focus:ring-2 focus:ring-teal-800 focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          Custom Shortcuts
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="fixed inset-0 top-1/2 left-1/2 m-0 max-h-[85vh] w-full max-w-[95vw] -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-lg border-none bg-gray-900 p-0 shadow-lg md:max-w-3xl"
        onCancel={() => setIsOpen(false)}
      >
        <button
          className="focus:ring-opacity-50 absolute top-3 right-3 flex h-8 w-8 transform items-center justify-center rounded-md bg-teal-600 text-white shadow-sm transition-all hover:scale-105 hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          onClick={() => setIsOpen(false)}
          aria-label="Close"
        >
          X
        </button>
        <div className="border-gray-700 px-6 pt-6 pb-4">
          <div className="text-center text-gray-300">
            <h2 className="text-lg font-medium">Create custom shortcuts</h2>
            <div className="mx-auto grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
              <div className="rounded-md bg-gray-800 p-3">
                <span className="font-semibold">Trigger:</span> A short keyword
                you&apos;ll type to activate the shortcut (e.g., &quot;yt&quot;
                for YouTube)
              </div>
              <div className="rounded-md bg-gray-800 p-3">
                <span className="font-semibold">URL:</span> The destination with
                optional placeholders like {"{{{s}}}"} for search terms
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6 overflow-visible px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 overflow-visible md:grid-cols-2">
              <input
                type="text"
                placeholder="Enter a short keyword (e.g., 'yt', 'maps')"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Enter URL with optional {{{s}}} for search terms"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!trigger.trim() || !url.trim().includes("{{{s}}}")}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-teal-600 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-600"
            >
              Add
            </button>
            <p className="text-sm text-gray-400 italic">
              Example: Trigger &quot;yt&quot; with URL
              &quot;https://youtube.com/results?search_query={"{{{s}}}"}&quot;
              will let you search YouTube directly.
            </p>
          </form>

          <div className="overflow-hidden rounded-md border border-gray-700">
            <div className="h-64 overflow-x-hidden overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-gray-800">
                  <tr>
                    <th className="w-1/3 p-4 text-left font-semibold text-white">
                      Trigger
                    </th>
                    <th className="p-4 text-left font-semibold text-white">
                      URL
                    </th>
                    <th className="w-24 p-4 text-right font-semibold text-white">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customBangs.length > 0 ? (
                    customBangs.map((bang) => (
                      <tr
                        key={bang.t}
                        className="border-t border-gray-700 hover:bg-gray-800"
                      >
                        <td className="p-4 font-medium text-white">{bang.t}</td>
                        <td className="max-w-[250px] truncate p-4 font-mono text-sm text-white">
                          {bang.u}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => removeCustomBang(bang.t)}
                            className="text-red-500 transition-colors hover:text-red-400"
                            aria-label={`Remove ${bang.t}`}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-gray-700">
                      <td colSpan={3} className="p-4 text-center text-gray-400">
                        No custom shortcuts yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-md border border-dashed border-gray-700 bg-gray-800 p-4">
            <h3 className="mb-2 flex items-center gap-1 font-medium text-white">
              How it works
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                1. Add a trigger and URL above (e.g., &quot;g&quot; and
                &quot;https://google.com/search?q={"{{{s}}}"}&quot;)
              </p>
              <p>
                2. When you type &quot;g cats&quot; in your browser&apos;s
                address bar, it redirects to
                &quot;https://google.com/search?q=cats&quot;
              </p>
              <p>
                3. The {"{{{s}}}"} placeholder gets replaced with whatever you
                type after the trigger
              </p>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
