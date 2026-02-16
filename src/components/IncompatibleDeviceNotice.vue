<script setup lang="ts">
    import {
        onMounted,
        onUnmounted,
        ref
    } from 'vue';
    import LogoRenderer from './LogoRenderer.vue';

    // TODO: Set this to false once design done
    const show = ref( true );
    // const show = ref( false );
    const isTouchDevice = ref( false );
    const isTooSmall = ref( false );
    const isUnsuitableAspectRatio = ref( false );

    const dismiss = () => {
        show.value = false;
        sessionStorage.setItem( 'dismissed-incompatibility', 'true' );
    };

    const runCheck = () => {
        isTouchDevice.value = ( 'ontouchstart' in window )
            || ( navigator.maxTouchPoints > 0 );
        isTooSmall.value = window.innerHeight < 400 || window.innerWidth < 400;
        isUnsuitableAspectRatio.value = window.innerWidth / window.innerWidth > 1.1;

        if ( !show.value && !sessionStorage.getItem( 'dismissed-incompatibility' ) )
            show.value = isTooSmall.value || isTouchDevice.value || isUnsuitableAspectRatio.value;
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
                <i class="fa-solid fa-close" @click="dismiss"></i>
            </div>
            <LogoRenderer kind="full" class="logo" />
            <div v-if="isTouchDevice || isTooSmall || isUnsuitableAspectRatio" class="popup-body">
                <!-- TODO: Better title -->
                <h2>Potential issues with your device</h2>
                <p>We have detected that you are on a device that is incompatible with EyeTap for the following reasons:</p>
                <ul>
                    <li></li>
                </ul>
            </div>
            <div v-else class="popup-body">
                <h2>Device fully compatible</h2>
                <p>Your device should work great with Eye-TAP</p>
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

        >.logo {
            height: 5rem;
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
