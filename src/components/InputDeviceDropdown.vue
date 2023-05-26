<template>
  <div class="select-container">
    <div @click="toggle" id="select" class="!cursor-default select-none bg-[var(--button-background)] border border-[var(--button-border-color)] active:border-[var(--button-active-border-color)] hover:text-[var(--button-hover-color) hover:bg-[var(--button-hover-background)] active:text-[var(--button-active-color)] active:bg-[var(--button-active-background)] py-1.5 px-2.5 text-sm rounded-md w-full transition duration-150">
      <span>{{ selected.name }}</span>
    </div>

    <div id="dropdown-items" class="hidden absolute bg-[var(--button-background)] border border-[rgba(41,41,41,255)] rounded-md px-1 mt-1 gap-2">
      <div v-for="device in devices.map((device) => {return device.name;})" :id="device" @click="select(device)" class="!cursor-default select-none hover:bg-[rgba(60,60,60,255)] active:bg-[rgba(54,54,54,255)] my-1 px-3 py-1 rounded">
        <span class="text-sm">{{ device }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {invoke} from "@tauri-apps/api";
import {getSettings, setSettings} from "../assets/settings.js";
import {useStore} from "../store/store";

export default {
  name: "InputDeviceDropdown",
  data() {
    return {
      devices: [],
      selected: {id: -1, name: 'Loading output devices...'}
    }
  },
  beforeMount() {
    invoke("get_output_devices").then(async (devices) => {
      this.devices = devices;

      const settings = await getSettings();
      if (settings.output_device) {
        this.selected = this.devices.find((device) => {
          return device.name === settings.output_device;
        });

        if (!this.selected) {
          this.selected = devices[0];
        }

        useStore().set("output_device", this.selected);
      }
    });
  },
  methods: {
    toggle() {
      document.getElementById("dropdown-items").classList.toggle("hidden");
    },
    show() {
      document.getElementById("dropdown-items").classList.remove("hidden");
    },
    hide() {
      document.getElementById("dropdown-items").classList.add("hidden");
    },
    select(deviceName) {
      getSettings().then(async (settings) => {
        settings.output_device = deviceName;
        await setSettings(settings);
      });

      this.selected = this.devices.find((device) => {return device.name === deviceName;});
      useStore().set("output_device", this.selected);
      this.toggle();
    }
  }
}
</script>

<style scoped>
.select-container {
  display: inline-block;
  position: relative;
}

#dropdown-items {
  position: absolute;
  top: 100%;
  left: 0;
}

#select {
  width: auto;
}
</style>
