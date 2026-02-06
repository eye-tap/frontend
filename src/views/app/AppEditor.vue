<script setup lang="ts">
    import RefactoredEditor from '@/components/editor/RefactoredEditor.vue';
    import SidePane from '@/components/editor/SidePane.vue';
</script>

<template>
    <div class="editor">
        <SidePane />
        <RefactoredEditor />
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
