<script setup lang="ts">
    import {
        onMounted,
        onUnmounted,
        ref
    } from 'vue';
    import LogoRenderer from './LogoRenderer.vue';
    import {
        useNotification
    } from '@kyvg/vue3-notification';

    const show = ref( false );
    const isTouchDevice = ref( false );
    const hasMouseSupport = ref( false );
    const isTooSmall = ref( false );
    const isUnsuitableAspectRatio = ref( false );
    const notifications = useNotification();
    const devForceIncompatible = false;
    const devMode = import.meta.env.VITE_DEV_MODE;

    const dismiss = () => {
        show.value = false;
        sessionStorage.setItem( 'dismissed-incompatibility', 'true' );
    };

    const runCheck = () => {
        if ( devMode && devForceIncompatible ) return useTestData();

        isTouchDevice.value = ( 'ontouchstart' in window )
            || ( navigator.maxTouchPoints > 0 );
        hasMouseSupport.value = matchMedia( '(hover:hover)' ).matches;
        isTooSmall.value = window.innerHeight < 400 || window.innerWidth < 400;
        isUnsuitableAspectRatio.value = window.innerWidth / window.innerWidth > 1.1;

        if ( !show.value && !sessionStorage.getItem( 'dismissed-incompatibility' ) )
            show.value = isTooSmall.value || isTouchDevice.value || isUnsuitableAspectRatio.value;
    };

    const useTestData = () => {
        isTouchDevice.value = true;
        show.value = isTouchDevice.value;

        notifications.notify( {
            'text': 'Forced Unsupported device for frontend dev',
            'type': 'warn',
            'title': 'Forced Unsupported Device'
        } );
    };

    onMounted( () => {
        runCheck();
        window.addEventListener( 'resize', runCheck );
    } );

    onUnmounted( () => {
        try {
            window.removeEventListener( 'resize', runCheck );
        } catch { /* empty */ }
    } );
</script>

<template>
    <div v-if="show" class="incompatible-device">
        <div class="popup">
            <div class="top-bar">
                <LogoRenderer kind="full" class="logo" />
                <i class="fa-solid fa-close" @click="dismiss"></i>
            </div>
            <div v-if="( isTouchDevice && !hasMouseSupport ) || isTooSmall || isUnsuitableAspectRatio" class="popup-body">
                <h2 class="title">
                    Unsupported Device
                </h2>
                <p class="desc">
                    Eye-TAP is intended for a desktop deviceand does not support this device type:
                </p>
                <ul>
                    <li v-if="isTouchDevice">
                        Touch Device
                    </li>
                    <li v-if="isTooSmall">
                        Screen size too small
                    </li>
                    <li v-if="isUnsuitableAspectRatio">
                        Unsuitable Aspect Ratio
                    </li>
                </ul>
            </div>
            <div v-else class="popup-body">
                <h2 class="title">
                    Device compatible
                </h2>
                <p class="desc">
                    All features required for Eye-TAP are supported
                </p>
                <button class="button primary" @click="dismiss">
                    Continue
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.incompatible-device {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: var( --theme-overlay );
    display: flex;
    justify-content: center;
    align-items: center;

    ul {
        margin: 0px;
        padding: 0px;
        li {
            list-style-type: none;
            padding: 0.85rem;
            margin-bottom: 1rem;
            border-radius: 20px;
            color: var(--theme-warning);
            background-color: var(--theme-bg-2);
        }
    }

    .title {
        color: var(--theme-foreground-text);
        margin: 0px;
    }

    .desc {
        color: var(--theme-background-text-20);
        padding-bottom: 1rem;
    }

    >.popup {
        width: max(40vw, 380px);
        height: max-content;
        padding: 1.5rem;
        position: relative;
        background-color: var( --theme-bg-2 );
        border-radius: 20px;
        height: 50%;
        display: flex;
        flex-direction: column;

        >.top-bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            >.logo {
                height: 4rem;
            }

            >.fa-solid {
                margin-left: auto;
                font-size: 1.5rem;
                cursor: pointer;
            }

            >.fa-solid:hover {
                color: var(--theme-bg-4-20);
            }

            >h1 {
                font-size: 2rem;
            }
        }

        >.popup-body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px;
            background-color: var( --theme-bg-1 );
            border-radius: 10px;
            height: 100%;

            >p {
                text-align: center;
            }
        }
    }
}
</style>
