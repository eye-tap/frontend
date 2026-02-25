<script setup lang="ts">
    import {
        annotationParsers,
        selectedAnnotationParserIndex
    } from '@/ts/dataImport/importers/annotations';
    import {
        characterBoxParsers,
        selectedCharacterBoxParserIndex
    } from '@/ts/dataImport/importers/characterBoxes';
    import {
        readingSessionParsers,
        selectedReadingSessionParserIndex
    } from '@/ts/dataImport/importers/fixations';
    import TextUploadOptionsOptionRenderer from './TextUploadOptionsOptionRenderer.vue';
    import {
        adminBaseRoute
    } from '../adminConfig';
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
                <TextUploadOptionsOptionRenderer
                    v-model="selectedReadingSessionParserIndex"
                    :parsers="readingSessionParsers"
                />
            </div>

            <div class="options-section">
                <p class="subtitle">
                    BOUNDING BOXES
                </p>
                <TextUploadOptionsOptionRenderer
                    v-model="selectedCharacterBoxParserIndex"
                    :parsers="characterBoxParsers"
                />
            </div>

            <div class="options-section">
                <p class="subtitle">
                    ANNOTATIONS
                </p>
                <TextUploadOptionsOptionRenderer
                    v-model="selectedAnnotationParserIndex"
                    :parsers="annotationParsers"
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
