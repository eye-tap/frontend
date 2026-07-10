<script setup lang="ts">
    import {
        RouterView,
        useRoute
    } from 'vue-router';
    import StatusBar from '@/components/StatusBar.vue';
    import SurveyCompletePopup from '@/components/survey/SurveyCompletePopup.vue';
    import {
        ref
    } from 'vue';
    import {
        useStatusStore
    } from '@/ts/stores/status';

    const pageTitle = ref( 'EYE-TAP' );
    const router = useRoute();
    const status = useStatusStore();

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
        <!-- FIXME: Here, we need to update the logo click target depending on page -->
        <StatusBar
            class="top-bar"
            :mode="(router.meta.mode as 'standard' | 'editor' | undefined)"
            :page-title="pageTitle"
            :show-account="true"
            :show-theme-picker="true"
            :logo-click-target="status.roles.includes( 'ROLE_SURVEY_PARTICIPANT' ) ? '/app/survey' : '/app/colab/session'"
        />
        <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition ? String( route.meta.transition ) : 'fade'" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
        <SurveyCompletePopup />
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
