<script setup lang="ts">
    const props = defineProps<{
        'text': string
    }>();
    const state = defineModel<boolean>();
</script>

<template>
    <label>
        <label class="switch">
            <input v-model="state" type="checkbox">
            <span class="slider round"></span>
        </label>
        <p>{{ props.text }}</p>
    </label>
</template>

<style scoped lang="scss">
    @use '@/scss/util/_toggles.scss';

    label {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 1.75rem;
        margin-left: 10px;

        >label {
            margin-right: 10px;
        }

        >p {
            font-weight: 400;
            color: var(--theme-bg-3-20);
        }
    }
</style>
