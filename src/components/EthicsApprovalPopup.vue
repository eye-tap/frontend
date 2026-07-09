<script setup lang="ts">
    import LogoRenderer from './LogoRenderer.vue';
    import {
        loadVideo
    } from '@/ts/util/video';
    import {
        ref
    } from 'vue';
    import request from '@/ts/util/request';

    const show = ref( false );
    const hasConfirmed = ref( false );
    const showVideo = ref( false );

    const dismiss = () => {
        if ( !hasConfirmed.value ) return;

        show.value = false;

        request.updateUserOptions( 'ethicsApproved', 'true' );

        document.dispatchEvent( new CustomEvent( 'eyetap:ethics:approve' ) );
    };

    document.addEventListener( 'eyetap:ethics:show', async ev => {
        if ( await request.getUserOptions( 'ethicsApproved' ) !== 'true' ) {
            if ( ev.detail ) {
                showVideo.value = true;
                setTimeout( () => {
                    loadVideo( document.getElementById( 'intro-video-wrapper' )!, ev.detail! );
                }, 500 );
            }

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
                    EYE-TAP Study
                </h2>
                <div class="desc">
                    <div>
                        <p>
                            You are about to participate in a study testing the EYE-TAP platform.
                            Thank you for your time!
                        </p>
                      <h1>EYE-TAP</h1>

                      <p>
                        <strong>EYE-TAP</strong> is a platform for annotating eye-tracking data from
                        reading experiments. It lets users assign each recorded fixation to the
                        linguistic unit the reader was most likely looking at.
                      </p>

                      <p>If you are new to eye tracking, the main terms are:</p>

                      <h2>Fixation</h2>
                      <p>
                        A short pause during reading in which the eye stays roughly still on one part
                        of the text. During a fixation, the reader processes the linguistic material
                        at that location. Fixations are connected by quick eye movements called
                        <strong>saccades</strong>.
                      </p>

                      <h2>Reading Trial</h2>
                      <p>
                        One instance of a reader reading one text while their eye movements are
                        recorded. Each trial produces a sequence of ordered fixations on that text
                        (e.g., in English, reading usually progresses from left to right and from top
                        to bottom).
                      </p>

                      <h2>Annotation Task</h2>
                      <p>
                        The task performed in <strong>EYE-TAP</strong>. The annotator decides which
                        linguistic unit—in our case, a character—each fixation belongs to. This is
                        needed because eye-tracking data is noisy, and a fixation can be ambiguous
                        between neighbouring characters, words, or lines.
                      </p>
                        <p>
                            <strong>EYE-TAP</strong> provides an intuitive interface to make annotating fast and reliable.
                        </p>
                        <h3>Your Task</h3>
                        <p>
                            In this study, you are asked to use EYE-TAP for a limited amount of time
                            and fill out a short survey on your experience.
                        </p>
                        <p>
                            Using EYE-TAP works like this:
                        </p>

                        <ol>
                            <li>
                                You are given a list of <strong>Texts</strong>.
                                Pick the first text and click "Edit".
                            </li>
                            <li>
                                Your goal is to <strong>connect each fixation</strong> with the character you <i>think</i>
                                the reader was looking at.
                            </li>
                            <li>
                                If you can't find a suitable character for a fixation,
                                then <strong>mark this fixation as invalid</strong>.
                            </li>
                            <li>
                                <strong>Continue annotating</strong> until the timer runs out.
                            </li>
                            <li>
                                Once the timer ends, please <strong>fill out the workload survey</strong> you are given.
                            </li>
                        </ol>
                        <div v-if="showVideo">
                            <h3>Video Introduction</h3>
                            <p>
                                Please watch the following video for a short introduction to EYE-TAP.
                            </p>
                            <div id="intro-video-wrapper" class="video-wrapper"></div>
                        </div>
                        <h3>Notes</h3>
                        <ul>
                            <li>Your <strong>timer starts immediately</strong> once you click "Continue", and cannot be paused.</li>
                            <li>Do not use a Mobile device, EYE-TAP is designed for Desktop use.</li>
                            <li>Refreshing the page may cause you to <strong>lose progress</strong>.</li>
                        </ul>
                        <p class="warning">
                            Your participation is only complete if you also <strong class="warn">fill out the workload survey</strong>.
                        </p>
                        <div style="margin-top: 20px;">
                            <input id="confirm-ethics" v-model="hasConfirmed" type="checkbox">
                            <label for="confirm-ethics">
                                I voluntarily consent to participate in this study. I have read and agree to the
                                <a href="/ethics-form.pdf" target="_blank">full ethics agreement</a>.
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
    z-index: 900;
    background-color: var( --theme-overlay );
    display: flex;
    justify-content: center;
    align-items: center;

    strong {
        color: var(--theme-bg-4);

        &.warn {
            color: var(--theme-warning);
        }
    }

    .title {
        color: var(--theme-foreground-text);
        font-size: 2rem;
        margin: 0px;
        padding-top: 1rem;
    }

    .video-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
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
            font-size: 1.5rem;
            margin-bottom: 0rem;
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
