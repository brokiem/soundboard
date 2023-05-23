import {appConfigDir} from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";

export async function getSettings() {
    const dir = await appConfigDir();

    // check if settings.json exists
    if (!await fs.exists(dir + "settings.json")) {
        fs.writeFile({
            path: dir + "settings.json",
            contents: JSON.stringify({})
        });
    }

    return JSON.parse(await fs.readTextFile(dir + "settings.json"));
}

export async function setSettings(settings, callEvent = true) {
    const dir = await appConfigDir();

    fs.writeFile({
        path: dir + "settings.json",
        contents: JSON.stringify(settings)
    });

    if (callEvent) {
        const event = new CustomEvent("settings_changed", {
            detail: settings
        });
        document.dispatchEvent(event);
    }
}
