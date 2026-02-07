<script setup lang="ts">
    import EditorView from '@/components/editor/EditorView.vue';
    import SidePane from '@/components/editor/SidePane.vue';
</script>

<template>
    <div class="editor">
        <SidePane />
        <EditorView />
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
