<script setup lang="ts">
    import {
        RouterView
    } from 'vue-router';
    import StatusBar from '@/components/StatusBar.vue';
    import {
        ref
    } from 'vue';

    const pageTitle = ref( '' );

    document.addEventListener( 'eyetap:fileload', e => {
        pageTitle.value = e.detail.baseName;
    } );

    document.addEventListener( 'eyetap:fileunload', () => {
        pageTitle.value = '';
    } );

    // TODO: Link to admin panel for users that have the permissions
</script>

<template>
    <div class="app-main">
        <StatusBar
            class="top-bar"
            page-title="Eye-TAP"
            :show-account="true"
            :show-theme-picker="true"
            logo-click-target="/app"
        />
        <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition ? String( route.meta.transition ) : 'fade'" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<style lang="scss" scoped>
    .app-main {
        >.top-bar {
            height: 8vh;
            width: 100vw;
            top: 0;
            left: 0;
            position: fixed;
            background-color: var( --theme-bg-2 );
        }
    }
</style>
