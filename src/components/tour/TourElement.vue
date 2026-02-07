<script setup lang="ts">
    const props = defineProps<{
        'id': number,
        'title': string,
        'description': string
    }>();
</script>

<template>
    <div>
        {{ props }}
    </div>
</template>
