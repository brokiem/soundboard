<script lang="ts">
import { appWindow } from '@tauri-apps/api/window'

export default {
  name: 'Titlebar',
  methods: {
    minimize() {
      appWindow.minimize()
    },
    maximize() {
      appWindow.toggleMaximize()
    },
    close() {
      appWindow.close()
    }
  }
}
</script>

<template>
  <div data-tauri-drag-region class="titlebar">
    <button @click="minimize" class="titlebar-button" id="titlebar-minimize">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
      </svg>
    </button>
<!--    <button @click="maximize" class="titlebar-button" id="titlebar-maximize">-->
<!--      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">-->
<!--        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" />-->
<!--      </svg>-->
<!--    </button>-->
    <button @click="close" class="titlebar-button hover:!bg-[rgba(232,0,47,255)]" id="titlebar-close">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.titlebar {
  height: 30px;
  background: var(--background);
  user-select: none;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 30px;
  padding-left: 12px;
  padding-right: 12px;
}
.titlebar-button:hover {
  background: var(--button-hover-background);
}
</style>
