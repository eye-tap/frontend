<script setup lang="ts">
    import SwitchOption from '../settings/SwitchOption.vue';
    import dataImport from '@/ts/dataImport';

    const dismiss = () => {
        show.value = false;
    };

    const show = defineModel<boolean>();
    // TODO: Fix up design (it is quite horrible currently)
</script>

<template>
    <div v-if="show" class="preferences">
        <div class="preferences-box">
            <div class="top-bar">
                <h1>CSV Column Names</h1>
                <i class="fa-solid fa-close" @click="dismiss"></i>
            </div>
            <div>
                <div class="options-container">
                    <div class="options-section">
                        <p>Fixations</p>
                        <input
                            v-model="dataImport.importConfigFixationTextIDCSVName.value"
                            type="text"
                            placeholder="Text ID"
                        >
                        <input
                            v-model="dataImport.importConfigFixationReaderCSVName.value"
                            type="text"
                            placeholder="Reader ID"
                        >
                        <input
                            v-model="dataImport.importConfigFixationXCoordCSVName.value"
                            type="text"
                            placeholder="X coordinate"
                        >
                        <input
                            v-model="dataImport.importConfigFixationYCoordCSVName.value"
                            type="text"
                            placeholder="Y coordinate"
                        >
                        <SwitchOption v-model="dataImport.importConfigFixationHasMultipleTexts.value" text="Use TextID on fixations" />
                    </div>

                    <div class="options-section">
                        <p>Bounding Boxes</p>
                        <input
                            v-model="dataImport.importConfigBBTextIDCSVName.value"
                            type="text"
                            placeholder="Text ID"
                        >
                        <input
                            v-model="dataImport.importConfigBBCharacterCSVName.value"
                            type="text"
                            placeholder="Character"
                        >
                        <input
                            v-model="dataImport.importConfigBBXminCoordCSVName.value"
                            type="text"
                            placeholder="Smaller X coordinate"
                        >
                        <input
                            v-model="dataImport.importConfigBBXmaxCoordCSVName.value"
                            type="text"
                            placeholder="Larger X coordinate"
                        >
                        <input
                            v-model="dataImport.importConfigBBYminCoordCSVName.value"
                            type="text"
                            placeholder="Smaller Y coordinate"
                        >
                        <input
                            v-model="dataImport.importConfigBBYmaxCoordCSVName.value"
                            type="text"
                            placeholder="Larger Y coordinate"
                        >
                        <SwitchOption v-model="dataImport.importConfigBBHasMultipleTexts.value" text="Use TextID on Bounding Boxes" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.preferences {
    position: fixed;
    top: 0;
    left: 0;
    background-color: var( --theme-overlay );
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    z-index: 1;     // To properly black out all of the Editor

    >.preferences-box {

        width: max(40vw, 380px);
        height: max-content;
        padding: 1px 1.5rem 1.5rem 1.5rem;
        position: relative;
        background-color: var( --theme-bg-2 );
        border-radius: 20px;

        >.top-bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            >.fa-solid {
                font-size: 1.5rem;
                cursor: pointer;
            }

            >h1 {
                font-size: 2rem;
            }

        }

        .options-container {
            display: flex;
            flex-direction: column;
            height: max(60vh, 400px);
            padding: 1rem;
            background-color: var(--theme-bg-1);
            overflow-y: scroll;

            .options-section {

                .slider-option {
                    width: 16rem;
                    margin-left: 1rem;
                    margin-bottom: 20px;

                    >p {
                        color: var(--theme-background-text-20);
                        font-size: 1rem;
                    }
                }

                >p {
                    color: var( --theme-bg-3 );
                    font-weight: 400;
                    font-size: 1rem;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }

                >input[type=text] {
                    all: unset;
                    background-color: var(--theme-bg-3);
                    width: 15rem;
                    padding: 8px;
                    margin-bottom: 0.5rem;
                    margin-left: 1rem;
                    border-style: none;
                }
            }
        }
    }
}
</style>
