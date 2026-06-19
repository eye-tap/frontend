<script setup lang="ts">
    import LogoRenderer from './LogoRenderer.vue';
    import auth from '@/ts/auth';
    import {
        ref
    } from 'vue';
    import request from '@/ts/util/request';
    import {
        useStatusStore
    } from '@/ts/stores/status';

    const show = ref( false );

    const dismiss = async () => {
        show.value = false;

        await request.updateUserOptions( 'ended', 'true' );

        const username = useStatusStore().username;

        auth.logout();

        // TODO: Replace the URL here. Want to set the username directly in the forms
        location.href = `https://janishutz.com/${ username }`;
    };

    document.addEventListener( 'eyetap:timer-ended', async () => {
        show.value = true;
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
                    Annotation Session Complete
                </h2>
                <div class="desc">
                    <div style="max-width: 80%;">
                        <p>
                            You have completed the annotation. Thank you very much.
                            We now kindly ask you to participate in a workload survey,
                            where you can share your experience using EYE-TAP
                        </p>
                        <p>
                            <strong>This survey is just as important to our work as the annotation itself</strong>
                        </p>
                    </div>
                </div>
                <button :class="['button', 'primary']" style="margin-top: 5px;" @click="dismiss">
                    To Workload Summary
                </button>
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
