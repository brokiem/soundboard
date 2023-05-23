import * as fs from "@tauri-apps/api/fs";
import {appLocalDataDir} from "@tauri-apps/api/path";

export async function getAllSounds() {
    const appLocalData = await appLocalDataDir();

    // check if sounds.json exists
    if (!await fs.exists(appLocalData + "sounds.json")) {
        fs.writeFile({
            path: appLocalData + "sounds.json",
            contents: JSON.stringify({
                sounds: []
            })
        });
    }

    const sounds = JSON.parse(await fs.readTextFile(appLocalData + "sounds.json"));
    return sounds.sounds;
}

export async function addSound(soundName, fileName, buffer, callEvent = true) {
    const appLocalData = await appLocalDataDir();

    // check if sounds folder exists
    if (!await fs.exists(appLocalData + "sounds")) {
        await fs.createDir(appLocalData + "sounds");
    }

    const sounds = JSON.parse(await fs.readTextFile(appLocalData + "sounds.json"));

    if (sounds.sounds.find(sound => sound.name === soundName)) {
        alert("Sound with same name already exists");
        return;
    }

    fs.writeBinaryFile({
        path: `${appLocalData}sounds/${soundName}-${fileName}`,
        contents: buffer
    });

    sounds.sounds.push({
        name: soundName,
        keybind: {
            code: null,
            key: null
        },
        path: `${appLocalData}sounds/${soundName}-${fileName}`
    });
    fs.writeFile({
        path: appLocalData + "sounds.json",
        contents: JSON.stringify(sounds)
    });

    if (callEvent) {
        const event = new CustomEvent("sound_added", {
            detail: {
                name: soundName,
                keybind: null,
                path: `${appLocalData}sounds/${soundName}-${fileName}`
            }
        });
        document.dispatchEvent(event);
    }
}

export async function removeSound(soundName, callEvent = true) {
    const appLocalData = await appLocalDataDir();

    const sounds = JSON.parse(await fs.readTextFile(appLocalData + "sounds.json"));
    const sound = sounds.sounds.find(sound => sound.name === soundName);

    if (sound) {
        await fs.removeFile(sound.path);
        sounds.sounds.splice(sounds.sounds.indexOf(sound), 1);
        fs.writeFile({
            path: appLocalData + "sounds.json",
            contents: JSON.stringify(sounds)
        });

        if (callEvent) {
            const event = new CustomEvent("sound_removed", {
                detail: {
                    name: soundName,
                    keybind: sound.keybind,
                    path: sound.path
                }
            });
            document.dispatchEvent(event);
        }
    }
}

export async function setSoundKeybind(soundName, keybind, callEvent = true) {
    const appLocalData = await appLocalDataDir();

    const sounds = JSON.parse(await fs.readTextFile(appLocalData + "sounds.json"));
    const sound = sounds.sounds.find(sound => sound.name === soundName);

    if (sound) {
        sound.keybind = {
            code: keybind.code,
            key: keybind.key
        };
        fs.writeFile({
            path: appLocalData + "sounds.json",
            contents: JSON.stringify(sounds)
        });

        if (callEvent) {
            const event = new CustomEvent("sound_keybind_changed", {
                detail: {
                    name: soundName,
                    keybind: sound.keybind,
                    path: sound.path
                }
            });
            document.dispatchEvent(event);
        }
    }
}
