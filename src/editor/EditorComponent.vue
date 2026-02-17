<script setup lang="ts">
    import {
        type ITourStep, VTour,
        type VTourExposedMethods
    } from '@globalhive/vuejs-tour';
    import {
        type Ref,
        ref
    } from 'vue';
    import AnnotationCompletion from './components/AnnotationCompletion.vue';
    import EditorView from './components/EditorView.vue';
    import PageTour from './tour/PageTour.vue';
    import SidePane from './components/SidePane.vue';
    import PropertyPane from './components/PropertyPane.vue';
    import '../scss/components/tour.scss';
    import {
        useAnnotationNavigation
    } from './composables/useAnnotationNavigation';
    import {useEditorTour} from './tour/editorTour';


    const {
        goToNextAnnotation, isAnnotationComplete
    } = useAnnotationNavigation();
    const {
        tour, steps, showWelcomeTour, startFullTour
    } = useEditorTour();

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
        <VTour ref="tour" :steps="steps" />
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
