<script setup lang="ts">
    import EditorComponent from '@/editor/new/EditorComponent.vue';
</script>

<template>
    <div class="editor-wrapper">
        <EditorComponent />
    </div>
</template>

<style lang="scss" scoped>
.editor-wrapper {
    margin-top: 9vh;
    display: flex;
    height: 90vh;
    width: 100vw;
    overflow-x: hidden;
    overflow-y: scroll
}
</style>
