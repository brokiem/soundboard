<template>
  <button @click="play" :id="sound_name" class="!cursor-default bg-[var(--button-background)] border border-[var(--button-border-color)] active:border-[var(--button-active-border-color)] hover:text-[var(--button-hover-color) hover:bg-[var(--button-hover-background)] active:text-[var(--button-active-color)] active:bg-[var(--button-active-background)] py-2 px-4 rounded-md transition duration-150">
    <div class="flex flex-col">
      <span>{{ sound_name }}</span>
      <span v-if="keybind_1.key" class="text-blue-300">
        CTRL + {{ keybind_1.key }}
      </span>
    </div>
  </button>
</template>

<script lang="ts">
import {invoke} from "@tauri-apps/api";
import {listen} from "@tauri-apps/api/event";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SoundButton",
  props: {
    sound_name: {
      type: String,
      required: true
    },
    sound_path: {
      type: String,
      required: true
    },
    keybind: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      selected: {},
      keybind_1: {
        code: null,
        key: null
      },
    }
  },
  methods: {
    play() {
      const outputDevice = JSON.parse(localStorage.getItem("output_device") as string);
      invoke("play_sound", {
        soundName: this.sound_name,
        soundPath: this.sound_path,
        outputDeviceId: outputDevice.id
      });
    },
    show(x = 0, y = 0) {
      const customMenu = document.getElementById("sound-context-menu");
      customMenu!.classList.remove("hidden");
      customMenu!.style.left = x + "px";
      customMenu!.style.top = y + "px";
    },
  },
  mounted() {
    // @ts-ignore
    this.keybind_1 = this.keybind;

    // Event listener to cancel default right-click behavior
    document.getElementById(this.sound_name)!.addEventListener("contextmenu", (event) => {
      localStorage.setItem("selected_sound", this.sound_name);

      const x = event.clientX;
      const y = event.clientY;

      // Show custom context menu at the clicked position
      this.show(x, y);
    });

    listen("sound_keybind_changed", (event: any) => {
      if (event.payload.name === this.sound_name) {
        this.keybind_1 = event.payload.keybind;
      }
    });
  }
});
</script>

<style scoped>

</style>
