<script lang="ts">
import SoundButton from "./components/SoundButton.vue";
import SpeakerButton from "./components/SpeakerButton.vue";
import ThemeButton from "./components/ThemeButton.vue";
import InputDeviceDropdown from "./components/InputDeviceDropdown.vue";
import AddSoundButton from "./components/AddSoundButton.vue";
import Titlebar from "./components/Titlebar.vue";
import {defineComponent} from "vue";
import {getAllSounds} from "./assets/sound-manager.js";
import {getSettings, setSettings} from "./assets/settings.js";
import SoundContextMenu from "./components/SoundContextMenu.vue";
import {invoke} from "@tauri-apps/api";
import {listen} from "@tauri-apps/api/event";
import {useStore} from "./store/store";

export default defineComponent( {
  name: 'App',
  components: {SoundContextMenu, Titlebar, AddSoundButton, InputDeviceDropdown, ThemeButton, SpeakerButton, SoundButton},
  setup() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    getSettings().then(async (settings) => {
      settings.theme = settings.theme ?? "system";
      settings.volume = settings.volume ?? 50;
      settings.output_device = settings.output_device ?? "default";
      await setSettings(settings);

      if (settings.theme === "dark") {
        document.documentElement.classList.add('dark');
      } else if (settings.theme === "light") {
        document.documentElement.classList.remove('dark');
      }
    });
  },
  data() {
    return {
      sounds: [] as any[],
      volume: 50,
      isCtrlKeyPressed: false
    }
  },
  mounted() {
    getAllSounds().then((sounds) => {
      this.sounds = sounds;
    });

    listen("sound_added", (e) => {
      this.sounds.push(e.payload);
    });

    listen("sound_removed", (e: any) => {
      this.sounds = this.sounds.filter((sound: any) => {
        return sound.name !== e.payload.name;
      });
    });

    listen("sound_keybind_changed", (e: any) => {
      const sound = this.sounds.find((sound) => {
        return sound.name === e.payload.name;
      });

      if (sound) {
        sound.keybind = e.payload.keybind;
      }
    });

    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === "Control") {
        this.isCtrlKeyPressed = true;
      } else if (this.isCtrlKeyPressed && event.key !== "Control") {
        const sound = this.sounds.find((sound) => {
          return sound.keybind.key === event.key;
        });

        if (sound) {
          // @ts-ignore
          const outputDevice = useStore().get("output_device");
          invoke("play_sound", {
            soundName: sound.name,
            soundPath: sound.path,
            outputDeviceId: outputDevice.id
          });
        }

        this.isCtrlKeyPressed = false; // Reset the flag after keybind is obtained
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === "Control") {
        this.isCtrlKeyPressed = false;
      }
    });
  }
});
</script>

<template>
  <main>
    <Titlebar />

    <div class="mx-4 mt-14 mb-4">
      <div class="flex items-center gap-2">
        <div>
          <ThemeButton />
        </div>
        <div>
          <div class="vl"></div>
        </div>
        <div>
          <AddSoundButton />
        </div>
        <div>
          <SpeakerButton />
        </div>
        <div class="grow"></div>
        <div>
          <InputDeviceDropdown />
        </div>
      </div>

      <div class="grid grid-cols-3 md:grid-cols-4 gap-2 mt-5">
        <SoundButton v-for="sound in sounds" :sound_name="sound.name" :sound_path="sound.path" :keybind="sound.keybind" />
      </div>
    </div>

    <SoundContextMenu />
  </main>
</template>

<style scoped>
.vl {
  border-left: 1px solid rgba(60,60,60,255);
  height: 20px;
}
</style>
