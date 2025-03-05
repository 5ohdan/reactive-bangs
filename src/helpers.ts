import { CustomBang } from "./components/custom-bangs";
import { CUSTOM_BANGS } from "./constants";

const getCustomBangs = () => {
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
    1,
  );
  localStorage.setItem(CUSTOM_BANGS, JSON.stringify(customBangs));
};

export { getCustomBangs, addCustomBang, removeCustomBang };
