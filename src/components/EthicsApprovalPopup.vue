<script setup lang="ts">
    import LogoRenderer from './LogoRenderer.vue';
    import {
        ref
    } from 'vue';
    import request from '@/ts/util/request';

    const show = ref( false );
    const hasConfirmed = ref( false );

    const dismiss = () => {
        if ( !hasConfirmed.value ) return;

        show.value = false;

        request.updateUserOptions( 'ethicsApproved', 'true' );

        document.dispatchEvent( new CustomEvent( 'eyetap:ethics:approve' ) );
    };

    document.addEventListener( 'eyetap:ethics:show', async () => {
        if ( await request.getUserOptions( 'ethicsApproved' ) !== 'true' ) {
            show.value = true;
        } else {
            document.dispatchEvent( new CustomEvent( 'eyetap:ethics:approve' ) );
        }
    } );
</script>

<template>
    <div v-if="show" class="ethics-approval-popup">
        <div class="popup">
            <div class="top-bar">
                <LogoRenderer kind="full" class="logo" />
            </div>
            <div class="popup-body">
                <h2 class="title">
                    Eye-TAP Study
                </h2>
                <div class="desc">
                    <div>
                        <p>
                            You are about to participate in a study evaluating how the quality of
                            annotation data and the annotation user experience is affected by the Eye-TAP platform.
                            The data you are about to annotate consists of texts with points displayed above which indicate
                            where the reader was looking.
                        </p>
                        <p>
                            You do not need any special knowledge to take part in this study.
                        </p>
                        <h3>Your task</h3>
                        <ol>
                            <li>
                                You are given a list of <strong>annotation sets</strong>.
                                Pick the first annotation set and click "Edit".
                            </li>
                            <li>
                                Your <strong>goal is</strong> to <strong>connect the points</strong>
                                to the corresponding <strong>characters</strong> in the text.
                            </li>
                            <li>
                                Connect each point with the characters that you <i>think</i>
                                the reader was <strong>looking at</strong> when reading the text.
                            </li>
                            <li>
                                If no box makes sense for a point,
                                then <strong>mark this point as invalid</strong>.
                            </li>
                            <li>
                                When you are done with all points,
                                click "next annotation set"
                                and repeat until the timer runs out.
                            </li>
                            <li>
                                After the time has run out, please fill out the workload survey presented to you.
                            </li>
                        </ol>
                        <p class="warning">
                            You are <strong>only entitled to compensation</strong>
                            if you also fill out the workload survey!
                        </p>
                        <h3>Important Notes</h3>
                        <ul>
                            <li>Your <strong>timer starts immediately</strong> once you click the "Continue" button.</li>
                            <li>Use a device with a mouse or trackpad, with a landscape-format screen of at least 1280x720 pixels.</li>
                            <li>Be sure to <strong>save regularly.</strong></li>
                            <li>Refreshing the page may cause you to <strong>lose progress</strong>.</li>
                        </ul>
                        <p class="warning">
                            You are <strong>only entitled to compensation</strong>
                            if you complete the full duration of the study!
                        </p>
                        <p>Thank you for your time! You are contributing to active research.</p>
                        <div style="margin-top: 20px;">
                            <input id="confirm-ethics" v-model="hasConfirmed" type="checkbox">
                            <label for="confirm-ethics">
                                I voluntarily consent to participate in this study. I have read and agree to the
                                <a href="/ethics-form.pdf" target="_blank">full ethics agreement</a>*
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="popup-footer">
                <button :class="['button', 'primary', hasConfirmed ? '' : 'disabled']" style="margin-top: 5px;" @click="dismiss">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ethics-approval-popup {
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
        padding-top: 1rem;
    }

    .desc {
        color: var(--theme-background-text-20);
        padding: 1rem;
        display: flex;
        justify-content: center;
        overflow-y: auto;
        scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );

        h3 {
            color: var(--theme-bg-4);
        }

        p.warning {
            color: var(--theme-warning);
        }
    }

    >.popup {
        width: max(80vw, 500px);
        max-width: 1000px;
        height: 80vh;
        max-height: 800px;
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
