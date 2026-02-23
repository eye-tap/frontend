<script setup lang="ts">
    import SwitchOption from '@/components/settings/SwitchOption.vue'
    import { adminBaseRoute } from '../adminConfig';
    import dataImport from '@/ts/dataImport';
    import router from '@/ts/router';

    const goBack = () => {
        router.push( adminBaseRoute + 'texts' );
    };

    // TODO: If any errors from src/ts/dataImport/util/errors.ts are raised, open this popup automatically
</script>

<template>
    <div class="content">
        <div class="top-bar">
            <h2 class="title">
                Upload Options
            </h2>
        </div>
        <p class="subtitle">
            FIXATIONS
        </p>
        <div class="options-container">
            <div class="options-section">
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
                <input
                    v-model="dataImport.importConfigFixationFixationIDCSVName.value"
                    type="text"
                    placeholder="Fixation ID"
                >
                <SwitchOption v-model="dataImport.importConfigFixationHasMultipleTexts.value" text="Use TextID on fixations" />
            </div>

            <p class="subtitle">
                BOUNDING BOXES
            </p>
            <div class="options-section">
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
                <SwitchOption
                    v-model="dataImport.importConfigFixationHasMultipleReaders.value"
                    text="Imported files contain multiple readers"
                />
            </div>

            <div class="options-section">
                <p class="subtitle">
                    ANNOTATIONS
                </p>
                <input
                    v-model="dataImport.importConfigAnnotationTextIDCSVName.value"
                    type="text"
                    placeholder="Text ID"
                >
                <input
                    v-model="dataImport.importConfigAnnotationReaderCSVName.value"
                    type="text"
                    placeholder="Reader"
                >
                <input
                    v-model="dataImport.importConfigAnnotationFixationIDCSVName.value"
                    type="text"
                    placeholder="Fixation ID"
                >
                <input
                    v-model="dataImport.importConfigAnnotationBoundingBoxIdCSVName.value"
                    type="text"
                    placeholder="Bounding Box ID"
                >
                <SwitchOption
                    v-model="dataImport.importConfigAnnotationHasMultipleTexts.value"
                    text="Use TextID on Bounding Boxes"
                />
            </div>
        </div>
        <button 
            class="button primary" 
            @click="goBack"
        >
            Back
        </button>
    </div>
</template>

<style scoped lang="scss">
@use '@/scss/admin/general';
@use '@/scss/admin/top-bar';

.content {
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
    max-height: 80vh;

    >button {
        margin-top: 2rem;
        margin-left: 1rem;
    }
}
</style>
