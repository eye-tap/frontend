<script setup lang="ts">
    const props = defineProps<{
        'max': number,
        'progress': number
    }>();
</script>

<template>
    <div>
        <progress :max="props.max" :value="props.progress" class="progress"></progress>
    </div>
</template>

<style lang="scss" scoped>
.progress::-moz-progress-bar, .progress::-webkit-progress-bar {
    color: var(--theme-bg-2);
}
.progress::-webkit-progress-value {
    color: var(--theme-bg-4);
}
</style>
