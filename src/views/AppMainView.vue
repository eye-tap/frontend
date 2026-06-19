<script setup lang="ts">
    import {
        RouterView,
        useRoute
    } from 'vue-router';
    import EndPrematurelyPopup from '@/components/EndPrematurelyPopup.vue';
    import StatusBar from '@/components/StatusBar.vue';
    import SurveyCompletePopup from '@/components/SurveyCompletePopup.vue';
    import {
        ref
    } from 'vue';

    const pageTitle = ref( 'EYE-TAP' );
    const router = useRoute();

    document.addEventListener( 'eyetap:file:load', e => {
        pageTitle.value = e.detail.title;
    } );

    document.addEventListener( 'eyetap:annotation-done', () => {
        if ( pageTitle.value.includes( 'soft complete' ) )
            pageTitle.value = pageTitle.value.slice( 0, pageTitle.value.indexOf( 'soft complete' ) - 1 ) + 'complete';
        else if ( !pageTitle.value.includes( 'complete' ) )
            pageTitle.value += ' (complete)';
    } );

    document.addEventListener( 'eyetap:file:unload', () => {
        pageTitle.value = 'EYE-TAP';
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
        <SurveyCompletePopup />
        <EndPrematurelyPopup />
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
