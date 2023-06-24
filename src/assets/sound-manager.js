import * as fs from "@tauri-apps/api/fs";
import {appLocalDataDir} from "@tauri-apps/api/path";
import {emit} from "@tauri-apps/api/event";

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

export async function addSound(soundName, fileName, buffer) {
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

    await emit("sound_added", {
        name: soundName,
        keybind: null,
        path: `${appLocalData}sounds/${soundName}-${fileName}`
    });
}

export async function removeSound(soundName) {
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

        await emit("sound_removed", {
            name: soundName,
            keybind: sound.keybind,
            path: sound.path
        });
    }
}

export async function setSoundKeybind(soundName, keybind) {
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

        await emit("sound_keybind_changed", {
            name: soundName,
            keybind: sound.keybind,
            path: sound.path
        });
    }
}
