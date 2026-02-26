<script setup lang="ts">
    import {
        RouterView,
        useRoute
    } from 'vue-router';
    import StatusBar from '@/components/StatusBar.vue';
    import {
        ref
    } from 'vue';

    const pageTitle = ref( 'Eye-TAP' );
    const router = useRoute();

    document.addEventListener( 'eyetap:fileload', e => {
        pageTitle.value = e.detail.title;
    } );

    document.addEventListener( 'eyetap:annotation-done', () => {
        if ( pageTitle.value.includes( 'soft complete' ) )
            pageTitle.value = pageTitle.value.slice( 0, pageTitle.value.indexOf( 'soft complete' ) - 1 ) + ' complete';
        else if ( !pageTitle.value.includes( 'complete' ) )
            pageTitle.value += ' (complete)';
    } );

    document.addEventListener( 'eyetap:fileunload', () => {
        pageTitle.value = 'Eye-TAP';
    } );
</script>

<template>
    <div class="app-main">
        <StatusBar
            class="top-bar"
            :mode="(router.meta.mode as 'standard' | 'editor' | undefined)"
            :page-title="pageTitle"
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
