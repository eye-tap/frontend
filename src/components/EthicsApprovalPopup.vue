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
                            You are about to participate in a study testing the Eye-TAP platform for fixation annotation.
                            Thank you for your time!
                        </p>
                        <h3>What is EyeTAP?</h3>
                        <p>
                            In EyeTAP, you will see a text overlayed with dots,
                            which represent eye-tracking data of someone reading this text.
                        </p>
                        <p>
                            Each dot is a <strong>Fixation</strong>: A point
                            the reader stared at for a longer duration. Usually, there is one fixation per word read.
                        </p>
                        <p>
                            Fixations rarely align exactly with the word the reader was focusing on at the time.
                            In many cases, it is easy to see though which word the reader meant.
                            The connection can then be manually registered, which is called <strong>Annotation</strong>.
                        </p>
                        <p>
                            <strong>EyeTAP</strong> provides an intuitive interface to make annotating fast and reliable.
                        </p>
                        <h3>Your Task</h3>
                        <p>
                            In this study, you are asked to use EyeTAP for a limited amount of time
                            and fill out a short survey on your experience.
                        </p>
                        <p>
                            Using EyeTAP works like this:
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
                                Once you are done,
                                click <strong>next annotation set</strong>
                                to go to the next text.
                            </li>
                            <li>
                                <strong>Continue annotating</strong> until the timer runs out.
                            </li>
                            <li>
                                Once the timer ends, please <strong>fill out the workload survey</strong> you are given.
                            </li>
                        </ol>
                        <h3>Notes</h3>
                        <ul>
                            <li>Your <strong>timer starts immediately</strong> once you click "Continue", and cannot be paused.</li>
                            <li>Do not use a Mobile device, EyeTAP is designed for Desktop use.</li>
                            <li>Refreshing the page may cause you to <strong>lose progress</strong>.</li>
                        </ul>
                        <p class="warning">
                            You are <strong class="warn">only entitled to compensation</strong>
                            if you complete the full duration of the study and fill out the workload survey!
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
    z-index: 1000;
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
