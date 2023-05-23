<script lang="ts">
import {defineComponent} from "vue";
import {removeSound, setSoundKeybind} from "../assets/sound-manager";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

export default defineComponent( {
  name: 'SoundContextMenu',
  components: {TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle},
  data() {
    return {
      menus: ["Edit Keybind", "Remove"],
      isOpen: false,
      isRecordingKeybind: false,
      recordedKeybind: {
        code: null as null|number,
        key: null as null|string,
      },
    }
  },
  methods: {
    select(menu: string) {
      if (menu === "Edit Keybind") {
        this.openModal();
        this.isRecordingKeybind = true;
      } else if (menu === "Remove") {
        removeSound(localStorage.getItem("selected_sound"));
        localStorage.removeItem("selected_sound");
      }

      this.hide();
    },
    hide() {
      const customMenu = document.getElementById("sound-context-menu");
      customMenu!.classList.add("hidden");
    },
    openModal() {
      this.recordedKeybind.code = null;
      this.recordedKeybind.key = "...";
      this.isOpen = true;
    },
    closeModal() {
      this.isRecordingKeybind = false;
      this.isOpen = false
    },
    setKeybind() {
      if (this.recordedKeybind.code !== null) {
        setSoundKeybind(localStorage.getItem("selected_sound"), this.recordedKeybind);
        localStorage.removeItem("selected_sound");
      }

      this.closeModal();
    },
    resetKeybind() {
      setSoundKeybind(localStorage.getItem("selected_sound"), {
        code: null,
        key: null
      });
      localStorage.removeItem("selected_sound");

      this.closeModal();
    }
  },
  mounted() {
    document.addEventListener("click", (event: any) => {
      const customMenu = document.getElementById("sound-context-menu");
      if (!customMenu!.contains(event.target)) {
        this.hide();
      }
    });

    document.addEventListener('keydown', (ev) => {
      if (this.isRecordingKeybind) {
        this.recordedKeybind.code = ev.keyCode;
        this.recordedKeybind.key = ev.key;
      }
    });
  }
});
</script>

<template>
  <div id="sound-context-menu" class="hidden absolute bg-[var(--button-background)] border border-[rgba(41,41,41,255)] min-w-[110px] rounded-md px-1 mt-1 gap-2">
    <div v-for="menu in menus" :id="menu" @click="select(menu)" class="!cursor-default select-none hover:bg-[rgba(60,60,60,255)] active:bg-[rgba(54,54,54,255)] my-1 px-3 !pr-8 py-1 rounded">
      <span>{{ menu }}</span>
    </div>
  </div>

  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
          as="template"
          enter="duration-200 ease-out"
          enter-from="opacity-0 blur-sm"
          enter-to="opacity-100 blur-none"
          leave="duration-100 ease-in"
          leave-from="opacity-100 blur-none"
          leave-to="opacity-0 blur-sm"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
            class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
              as="template"
              enter="duration-200 ease-out"
              enter-from="opacity-0 scale-105"
              enter-to="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-105"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-xl bg-[var(--dialog-background)] border border-[var(--dialog-border-color)] text-left align-middle shadow-xl transition-all">
              <div class="m-6">
                <DialogTitle as="h3" class="text-xl font-medium leading-6 text-white">
                  Set Keybind
                </DialogTitle>
                <p class="mt-3 flex content-center justify-center items-center">
                  Press the key you want to set as the keybind for this sound.
                </p>
                <div class="mt-3">
                  <input type="text" class="w-full bg-[var(--input-background)] border border-[var(--input-border-color)] rounded-md text-[var(--input-color)] placeholder-[var(--input-placeholder-color)] placeholder-opacity-50 px-3 py-2 text-sm focus:outline-none focus:border-[var(--input-focus-border-color)]" :placeholder="'CTRL + ' + (recordedKeybind.key === null ? '...' : recordedKeybind.key)" disabled />
                </div>
              </div>

              <div class="mt-7">
                <div class="bottom-0 left-0 right-0 bg-[var(--dialog-footer-background)] h-20 flex items-center gap-2">
                  <button @click="setKeybind" class="ml-6 flex-1 !cursor-default bg-[var(--button-primary-background)] border border-[var(--button-primary-border-color)] active:border-[var(--button-primary-active-border-color)] hover:text-[var(--button-primary-hover-color) hover:bg-[var(--button-primary-hover-background)] active:text-[var(--button-primary-active-color)] active:bg-[var(--button-primary-active-background)] text-[var(--button-primary-color)] py-1.5 px-2.5 text-sm rounded-md transition duration-150">
                    Done
                  </button>
                  <button @click="resetKeybind" class="flex-1 !cursor-default bg-[var(--button-background)] border border-[var(--button-border-color)] active:border-[var(--button-active-border-color)] hover:text-[var(--button-hover-color) hover:bg-[var(--button-hover-background)] active:text-[var(--button-active-color)] active:bg-[var(--button-active-background)] py-1.5 px-2.5 text-sm rounded-md transition duration-150">
                    Reset
                  </button>
                  <button @click="closeModal" class="mr-6 flex-1 !cursor-default bg-[var(--button-background)] border border-[var(--button-border-color)] active:border-[var(--button-active-border-color)] hover:text-[var(--button-hover-color) hover:bg-[var(--button-hover-background)] active:text-[var(--button-active-color)] active:bg-[var(--button-active-background)] py-1.5 px-2.5 text-sm rounded-md transition duration-150">
                    Cancel
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>

</style>
