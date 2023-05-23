
<template>
  <button @click="openModal" class="!cursor-default bg-[var(--button-background)] border border-[var(--button-border-color)] active:border-[var(--button-active-border-color)] hover:text-[var(--button-hover-color) hover:bg-[var(--button-hover-background)] active:text-[var(--button-active-color)] active:bg-[var(--button-active-background)] py-1.5 px-2 rounded-md transition duration-150">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

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
                  Add new sound
                </DialogTitle>
                <div class="mt-3 flex flex-col">
                  <label for="sound-name">Sound name</label>
                  <input ref="soundName" class="mt-1 mb-4 rounded-md bg-[var(--input-background-alt)] border border-[var(--input-border-color)] !border-b-[var(--input-bottom-border-color)] focus:bg-[var(--input-focus-background)] focus:!border-b-[var(--input-focus-bottom-border-color)] pl-2 py-0.5 ring-0 outline-none transition-all duration-[50ms]" id="sound-name" name="sound-name" placeholder="..."/>

                  <label for="sound-file">Sound file (mp3, wav, flac)</label>
                  <input ref="soundFile" type="file" accept=".mp3,.wav,.flac" class="mt-1 rounded-md bg-[var(--input-background-alt)] border border-[var(--input-border-color)] focus:bg-[var(--input-focus-background)] !border-b-[var(--input-bottom-border-color)] file:hidden pl-2 py-0.5 !ring-0 !outline-none transition-all duration-[50ms]" id="sound-file" name="sound-file" placeholder="..."/>
                </div>
              </div>

              <div class="mt-7">
                <div class="bottom-0 left-0 right-0 bg-[var(--dialog-footer-background)] h-20 flex items-center gap-2">
                  <button @click="addSound(); closeModal();" class="ml-6 flex-1 !cursor-default bg-[var(--button-primary-background)] border border-[var(--button-primary-border-color)] active:border-[var(--button-primary-active-border-color)] hover:text-[var(--button-primary-hover-color) hover:bg-[var(--button-primary-hover-background)] active:text-[var(--button-primary-active-color)] active:bg-[var(--button-primary-active-background)] text-[var(--button-primary-color)] py-1.5 px-2.5 text-sm rounded-md transition duration-150">
                    Add Sound
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

<script>
import {defineComponent} from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import {addSound as addSoundScript} from "../assets/sound-manager.js";

export default defineComponent({
  name: "AddSoundButton",
  components: {TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle},
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    async addSound() {
      const soundName = this.$refs.soundName.value;
      const fileInput = this.$refs.soundFile;
      const file = fileInput.files[0];
      const fileName = file.name;

      await addSoundScript(soundName, fileName, await file.arrayBuffer());
    },
    openModal() {
      this.isOpen = true
    },
    closeModal() {
      this.isOpen = false
    },
  }
});
</script>

<style scoped>

</style>
