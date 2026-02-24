<script setup lang="ts">
    import TextBrowser from './texts/TextBrowser.vue';
    // import TextUpload from './texts/TextUpload.vue';
    // import TextUploadOptions from './texts/TextUploadOptions.vue';
</script>

<template>
    <div class="text-manager">
        <TextBrowser />
        <!-- TODO: Fix alignment -->
        <div>
            <router-view v-slot="{ Component, route }">
                <transition :name="route.meta.transition ? String( route.meta.transition ) : 'fade'" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>
