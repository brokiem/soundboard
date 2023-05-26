import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
    state: () => ({
        store: new Map()
    }),
    actions: {
        set(key: string, value: any) {
            this.store.set(key, value)
        },
        get(key: string) {
            return this.store.get(key)
        },
        delete(key: string) {
            this.store.delete(key)
        },
        clear() {
            this.store.clear()
        },
        has(key: string) {
            return this.store.has(key)
        },
        size() {
            return this.store.size;
        }
    }
});
