<script setup lang="ts">
    import '../scss/components/tour.scss';
    import {
        type Ref,
        ref
    } from 'vue';
    import {
        VTour,
        type VTourExposedMethods
    } from '@globalhive/vuejs-tour';
    import AnnotationCompletion from './components/AnnotationCompletion.vue';
    import EditorView from './components/EditorView.vue';
    import PageTour from './tour/PageTour.vue';
    import SidePane from './components/SidePane.vue';
    import {
        useAnnotationNavigation
    } from './composables/useAnnotationNavigation';
    import {
        useEditorTour
    } from './tour/editorTour';


    const {
        goToNextAnnotation, isAnnotationComplete
    } = useAnnotationNavigation();
    const tour: Ref<VTourExposedMethods | null> = ref( null );
    const {
        steps,
        showWelcomeTour,
        startFullTour,
        skipTour
    } = useEditorTour( tour );
</script>

<template>
    <div class="editor">
        <PageTour v-model="showWelcomeTour" @launch-tour="startFullTour" />
        <AnnotationCompletion
            v-model="isAnnotationComplete"
            @next="goToNextAnnotation"
            @close="isAnnotationComplete = false"
        />
        <SidePane />
        <EditorView id="tour-editor" />
        <VTour ref="tour" :steps="steps">
            <template #actions="{ lastStep, nextStep, endTour, _CurrentStep, getNextLabel }">
                <div class="vjt-actions">
                    <button
                        v-if="_CurrentStep.lastStep < _CurrentStep.currentStep"
                        type="button"
                        @click.prevent="lastStep()"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        @click.prevent="() => {
                            skipTour();
                            endTour();
                        }"
                    >
                        Skip
                    </button>
                    <button type="button" @click.prevent="nextStep()" v-text="getNextLabel"></button>
                </div>
            </template>
        </VTour>
    </div>
</template>

<style lang="scss" scoped>
.editor {
    height: 100%;
    width: 100%;
    display: flex;
    overflow-x: hidden;
    overflow-y: hidden;
}
</style>
