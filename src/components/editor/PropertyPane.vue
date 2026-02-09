<script setup lang="ts">
    const props = defineProps<{
        'showPropertyPane': boolean,
        'pointSelected': boolean,
        'metadata': {
            'assignedBy': string,
            'entropy': number,
            'pointID': number,
            'readerID': number
        }
    }>();
    // Minimum values to apply color change to Entropy property
    const entropyThresholds = {
        'high': 50,
        'mid': 25
    };

    // TODO: Make movable
</script>

<template>
    <div class="property-pane" :class="[ !showPropertyPane ? 'hidden' : undefined ]">
        <h2>Properties</h2>

        <table v-if="pointSelected">
            <tbody>
                <tr>
                    <td>
                        <p class="title">
                            Assigned by
                        </p>
                        <p class="content">
                            {{ props.metadata.assignedBy }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Point number
                        </p>
                        <p class="content">
                            {{ props.metadata.pointID }}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="title">
                            Entropy
                        </p>
                        <p
                            class="content"
                            :class="[
                                metadata.entropy > entropyThresholds.mid ?
                                    metadata.entropy > entropyThresholds.high ?
                                        'warning' : 'information' : 'success'
                            ]"
                        >
                            {{ $props.metadata.entropy }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Reader
                        </p>
                        <p class="content">
                            {{ props.metadata.readerID }}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else class="placeholder">
            <p> Please select a Gaze Point</p>
        </div>
    </div>
</template>

<style scoped>
.hidden {
    visibility: hidden;
}

.placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--theme-bg-1);
    height: 55%;
    padding: 10px;
}

.property-pane {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    width: 15rem;
    height: 13rem;

    background-color: var(--theme-bg-2);
    padding: 1rem;
    border-radius: 10px;

    >h1 {
        color: var(--theme-foreground-text);
    }

    >table {
        margin-top: 20px;
        width: 100%;
        background-color: var( --theme-bg-1 );
        padding: 15px;
        margin-bottom: 5px;
        display: flex;
        flex-direction: column;

        > tbody > tr > td {
            width: 100%;
            >p {
                padding: 0;
                padding-left: 3px;
                padding-right: 2px;
                margin: 0;
                width: max-content;

                &.title {
                    color: var( --theme-background-text-20 );
                    font-size: 0.8rem;
                    padding-bottom: 5px;
                }

                &.content {
                    font-size: 1.25rem;
                }

                &.warning {
                    color: var(--theme-warning);
                }

                &.information {
                    color: var(--theme-information);
                }

                &.success {
                    color: var(--theme-success);
                }
            }
        }
    }
}
</style>
