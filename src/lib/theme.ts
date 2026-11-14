export const THEME_STORAGE_KEY = "theme";

/**
 * Inlined in <head> so a stored choice applies before first paint.
 * With no stored choice the CSS follows the operating system setting.
 * Also marks the page as scripted, so script-only controls can stay hidden otherwise.
 */
export const themeInitScript = `document.documentElement.dataset.js="";try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
