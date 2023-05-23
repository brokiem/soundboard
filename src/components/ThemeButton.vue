<template>
  <button @click="toggleTheme" class="!cursor-default bg-[var(--button-background)] border border-[var(--button-border-color)] active:border-[var(--button-active-border-color)] hover:text-[var(--button-hover-color) hover:bg-[var(--button-hover-background)] active:text-[var(--button-active-color)] active:bg-[var(--button-active-background)] py-1.5 px-2 rounded-md transition duration-150">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  </button>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {getSettings, setSettings} from "../assets/settings.js";

export default defineComponent({
  name: "ThemeButton",
  data() {
    return {
      theme: "system"
    }
  },
  mounted() {
    getSettings().then((settings) => {
      this.theme = settings.theme;
    });
  },
  methods: {
    toggleTheme() {
      if (this.theme === "dark") {
        this.setTheme("light");
      } else if (this.theme === "light") {
        this.setTheme("dark");
      } else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          this.setTheme("light");
        } else {
          this.setTheme("dark");
        }
      }
    },
    setTheme(theme: "dark" | "light") {
      if (theme === "dark") {
        this.theme = "dark";
        document.documentElement.classList.add('dark');
      } else {
        this.theme = "light";
        document.documentElement.classList.remove('dark');
      }

      getSettings().then(async (settings) => {
        settings.theme = this.theme;
        await setSettings(settings);
      });
    }
  }
});
</script>

<style scoped>

</style>
