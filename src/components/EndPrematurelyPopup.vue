<script setup lang="ts">
    import LogoRenderer from './LogoRenderer.vue';
    import auth from '@/ts/auth';
    import {
        availableTime
    } from '@/editor/config-presets';
    import {
        ref
    } from 'vue';
    import request from '@/ts/util/request';

    const show = ref( false );

    const cancel = () => {
        show.value = false;
    };

    const confirmLogout = async () => {
        if ( !confirm( 'Are you really sure?' ) ) return;

        show.value = false;

        await request.updateUserOptions( 'ended', 'true' );

        auth.logout();
    };

    document.addEventListener( 'eyetap:end', async () => {
        if ( availableTime.value > 0 )
            show.value = true;
        else
            auth.logout();
    } );
</script>

<template>
    <div v-if="show" class="survey-complete-popup">
        <div class="popup">
            <div class="top-bar">
                <LogoRenderer kind="full" class="logo" />
            </div>
            <div class="popup-body">
                <div class="desc">
                    <h2 class="title">
                        Incomplete Session
                    </h2>
                    <div>
                        <p>
                            Are you sure you want to end participation early?
                        </p>
                        <p>
                            <strong>You may not be entitled to compensation if you end prematurely!</strong>
                        </p>
                    </div>
                </div>
                <div>
                    <button :class="['button', 'primary']" style="margin-top: 5px;" @click="cancel">
                        Cancel
                    </button>
                    <button :class="['button']" style="margin-top: 5px;" @click="confirmLogout">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.survey-complete-popup {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: var( --theme-overlay );
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
        color: var(--theme-foreground-text);
        font-size: 2rem;
        margin: 0px;
    }

    .desc {
        padding-top: 1rem;
        padding-bottom: 1rem;
        color: var(--theme-background-text-20);
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow-y: auto;
        scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );

        strong {
            color: var(--theme-warning);
        }
    }

    >.popup {
        width: 50vw;
        max-width: 600px;
        max-height: 60vh;
        padding: 1rem;
        position: relative;
        background-color: var( --theme-bg-2 );
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        text-align: left;

        >.top-bar {
            display: flex;
            flex-direction: row;
            justify-content: center;
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
            padding: 1rem;
            background-color: var( --theme-bg-1 );
            border-radius: 10px;
            height: 100%;
            overflow-y: auto;
            scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );

            >p {
                text-align: center;
            }
        }

        >.popup-footer {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 1rem;

            >.button {
                font-size: 1.2rem;
                padding: 0.5rem 1rem;
                border-radius: 10px;
                cursor: pointer;
            }
        }
    }
}
</style>
