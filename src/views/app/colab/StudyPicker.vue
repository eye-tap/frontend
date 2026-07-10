<script setup lang="ts">
    import DatasetsPanel from '@/components/collab/DatasetsPanel.vue';
    import {
        useDatasets
    } from '@/ts/colabMode/datasets';

    const handler = useDatasets();
    const datasets = handler.datasets;
</script>

<template>
    <div>
        <h1>Study picker</h1>
        <DatasetsPanel :files="datasets" :loading="false" :most-recently-edited="0" />
    </div>
</template>
