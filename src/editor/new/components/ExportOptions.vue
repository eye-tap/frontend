<script setup lang="ts">
    import {
        ref
    } from 'vue';
    import {
        startExport
    } from '@/ts/export';

    const exportImage = ref( false );
    const exportBoxes = ref( false );


</script>

<template>
    <div class="options-pane">
        <div class="options-container">
            <div class="options-section">
                <p>Options</p>
                <span>
                    <input v-model="exportImage" type="checkbox">
                    <p>Include image</p>
                </span>
                <span>
                    <input v-model="exportBoxes" type="checkbox">
                    <p>Include bounding boxes</p>
                </span>
            </div>
        </div>
    </div>
    <button
        class="button primary has-icon export-button"
        @click=" startExport( {
            'annotations': false, // Do not change
            'localAnnotations': true, // Do not change
            'image': exportImage,
            'boundingBoxes': exportBoxes
        } );"
    >
        <i class="fa-lg fa-solid fa-file-arrow-down"></i>
        Export
    </button>
</template>

<style scoped lang="scss">
.export-button {
    margin-top: 20px;
}

.options-pane {
    padding: 10px;
    background-color: var( --theme-bg-1 );
    user-select: none;

    .advanced-toggle {
        display: flex;
        align-items: center;
        justify-content: center;

        .advanced-button {
            font-size: 1rem;
            width: full;
            margin-top: 15px;
            margin-bottom: 10px;
        }
    }

    .options-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .options-section {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: 1rem;

            >p {
                color: var( --theme-bg-3 );
                font-weight: 400;
                font-size: 1rem;
                margin-top: 10x;
                margin-bottom: 0px;
            }

            >span {
                display: flex;
                align-items: center;
                margin-bottom: 0px;
                margin-top: 10px;

                >p {
                    color: var(--theme-bg-4-20);
                    margin-top: 0px;
                    margin-bottom: 0px;
                }
            }

            input[type=checkbox] {
                appearance: none;
                background-color: var(--theme-bg-3);
                height: 20px;
                width: 20px;
                margin-left: 1rem;
                margin-top: 0px;
                margin-bottom: 0px;
                margin-right: 1rem;
                cursor: pointer;
                &:checked {
                    background-color: var(--theme-bg-3);

                    &::after {
                        display: inline-block;
                        position: relative;
                        left: 5px;
                        top: 2px;
                        content: "\00d7";
                        color: var(--theme-bg-4-20);
                        transform: scale(1.7);
                    }
                }
            }
        }
    }
}
</style>
