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
                    Study Overview
                </h2>
                <div class="desc">
                    <div style="max-width: 80%;">
                        <p>
                            You are about to participate in a study that evaluates how the quality of
                            annotation data and the user experience of it is affected by this platform.
                            The data you are about to annotate are texts with points on them that correspond
                            to where the reader looked.
                            You do not need any special knowledge to take part.
                        </p>
                        <h3>Your task</h3>
                        <ol>
                            <li>
                                You are presented with a list of <strong>annotation sets</strong>.
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
                                If for a point no box makes any sense (e.g. the first point is in the middle of the text),
                                then <strong>mark them as invalid</strong>
                            </li>
                            <li>
                                When you are done with all fixations (points) for a text,
                                click "next annotation set" in the top right corner,
                                and repeat until the time runs out
                            </li>
                            <li>
                                After the time has run out comes the most important part:
                                Filling out the survey that you are then presented with.
                                You are <strong>only eligible for the full compensation</strong> if you have also filled out the survey
                            </li>
                        </ol>
                        <h3>Important Notes</h3>
                        <ul>
                            <li>Your <strong>timer starts immediately</strong> once you click the "Continue" button below.</li>
                            <li>Use a device with a mouse or trackpad, with landscape screen of at least 1280x720 pixels</li>
                            <li>Be sure to <strong>save regularly</strong></li>
                            <li>Refreshing the page may cause you to <strong>lose progress</strong></li>
                        </ul>
                        <p>Thank you for your time participating in this study</p>
                        <div style="margin-top: 20px;">
                            <input id="confirm-ethics" v-model="hasConfirmed" type="checkbox">
                            <label for="confirm-ethics">
                                I voluntarily consent to participate in this study. I have read and agree to the
                                <a href="/ethics-form.pdf" target="_blank">full ethics agreement</a>*
                            </label>
                        </div>
                    </div>
                </div>
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
        width: max(80vw, 500px);
        height: 80vh;
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
