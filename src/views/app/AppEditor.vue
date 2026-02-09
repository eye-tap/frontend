<script setup lang="ts">
    import {
        type ITourStep, VTour
    } from '@globalhive/vuejs-tour';
    import EditorView from '@/components/editor/EditorView.vue';
    import PageTour from '@/components/tour/PageTour.vue';
    import SidePane from '@/components/editor/SidePane.vue';
    import {
        ref
    } from 'vue';

    // TODO: To change theme, follow this guide: https://globalhive.github.io/vuejs-tour/guide/css-theme.html
    const steps: ITourStep[] = [
        {
            'target': '#tour-editor',
            'content': '<h3>Editor</h3><p>Here you can do your annotating. Pressing a letter on your keyboard will assign the currently selected point to the closest box with that letter. Alternatively, you may click the corresponding box, or drag the point to the correct box.</p>',
            'highlight': true,
            'backdrop': true
        },
        {
            'target': '#tour-history',
            'content': '<h3>History</h3><p>Undo (Ctrl + Z) and redo (Ctrl + Y) your actions. <br> Press Ctrl + S to save</p>',
            'highlight': true,
            'backdrop': true
        }
    ];
    const showWelcomeTour = ref( !localStorage.getItem( 'welcomeTourViewed' ) );
    // TODO: Use the start method for the tour
</script>

<template>
    <div class="editor">
        <PageTour v-model="showWelcomeTour" />
        <SidePane />
        <EditorView id="tour-editor" />
        <VTour :steps="steps" />
    </div>
</template>

<style lang="scss" scoped>
.editor {
    margin-top: 9vh;
    display: flex;
    height: 90vh;
    width: 100vw;
    overflow-x: hidden;
    overflow-y: scroll
}
</style>
