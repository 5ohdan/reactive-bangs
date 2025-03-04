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
  const [customBangs, setCustomBangs] = useState<CustomBang[]>(
    getCustomBangs()
  );

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
          className="flex items-center justify-center h-10 px-4 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors shadow-sm"
          onClick={() => setIsOpen(true)}
        >
          Custom Shortcuts
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="fixed m-0 p-0 inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg overflow-visible max-h-[85vh] w-full max-w-[95vw] md:max-w-3xl border-none"
        onCancel={() => setIsOpen(false)}
      >
        <button
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all transform hover:scale-105"
          onClick={() => setIsOpen(false)}
          aria-label="Close"
        >
          X
        </button>
        <div className="pt-6 px-6 pb-4 border-neutral-200">
          <div className="text-center text-neutral-600">
            <p className="mb-2">
              Create custom shortcuts to quickly access your favorite websites.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mx-auto">
              <div className="bg-neutral-100 p-3 rounded-md">
                <span className="font-semibold">Trigger:</span> A short keyword
                you&apos;ll type to activate the shortcut (e.g., &quot;yt&quot;
                for YouTube)
              </div>
              <div className="bg-neutral-100 p-3 rounded-md">
                <span className="font-semibold">URL:</span> The destination with
                optional placeholders like {"{{{s}}}"} for search terms
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 space-y-6 overflow-visible">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-visible">
              <input
                type="text"
                placeholder="Enter a short keyword (e.g., 'yt', 'maps')"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full py-3 px-4 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-neutral-900"
              />
              <input
                type="text"
                placeholder="Enter URL with optional {{{s}}} for search terms"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full py-3 px-4 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-neutral-900"
              />
            </div>
            <button
              type="submit"
              disabled={!trigger.trim() || !url.trim().includes("{{{s}}}")}
              className="w-full h-12 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-200 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors"
            >
              Add
            </button>
            <p className="text-sm text-neutral-500 italic">
              Example: Trigger &quot;yt&quot; with URL
              &quot;https://youtube.com/results?search_query={"{{{s}}}"}&quot;
              will let you search YouTube directly.
            </p>
          </form>

          <div className="border border-neutral-200 rounded-md overflow-hidden">
            <div className="h-64 overflow-y-auto overflow-x-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-neutral-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left p-4 font-semibold w-1/3 text-neutral-900">
                      Trigger
                    </th>
                    <th className="text-left p-4 font-semibold text-neutral-900">
                      URL
                    </th>
                    <th className="w-24 p-4 text-right font-semibold text-neutral-900">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customBangs.length > 0 ? (
                    customBangs.map((bang) => (
                      <tr
                        key={bang.t}
                        className="border-t border-neutral-200 hover:bg-neutral-50"
                      >
                        <td className="p-4 font-medium text-neutral-900">
                          {bang.t}
                        </td>
                        <td className="p-4 font-mono text-sm text-neutral-900 truncate max-w-[250px]">
                          {bang.u}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              removeCustomBang(bang.t);
                              setCustomBangs(getCustomBangs());
                            }}
                            className="size-10 p-2 text-red-500 hover:text-red-600 hover:bg-red-100 bg-red-50 rounded-md transition-colors"
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center">
                        No custom shortcuts yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-md border border-dashed border-neutral-200">
            <h3 className="font-medium mb-2 flex items-center gap-1 text-neutral-900">
              How it works
            </h3>
            <div className="space-y-2 text-sm text-neutral-600">
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
