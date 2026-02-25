<script setup lang="ts">
    import TextBrowser from './texts/TextBrowser.vue';
</script>

<template>
    <div>
        <TextBrowser />
        <!-- Currently, this router does't do anything, but maybe at some point it can display metadata -->
        <div>
            <router-view v-slot="{ Component, route }">
                <transition :name="route.meta.transition ? String( route.meta.transition ) : 'fade'" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>
