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
                <h2 class="title">
                    End Session Prematurely
                </h2>
                <div class="desc">
                    <div style="max-width: 80%;">
                        <p>
                            Are you really sure you want to end participation early?
                            You may not be eligible for the full payout if you end prematurely.
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
        margin: 0px;
    }

    .desc {
        color: var(--theme-background-text-20);
        padding-bottom: 1rem;
        display: flex;
        justify-content: center;
        overflow-y: scroll;
    }

    >.popup {
        width: max(50vw, 400px);
        height: 50vh;
        padding: 1.5rem;
        position: relative;
        background-color: var( --theme-bg-2 );
        border-radius: 20px;
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
            overflow: scroll;

            >p {
                text-align: center;
            }
        }
    }
}
</style>
