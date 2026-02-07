<script setup lang="ts">
    import {
        useTourStore
    } from '@/stores/tourStore';

    const props = defineProps<{
        'tourId': number,
        'title': string,
        'description': string,
        'positionX': 'left' | 'center' | 'right',
        'positionY': 'top' | 'center' | 'bottom',
    }>();
    const tourStore = useTourStore();

    // TODO: Use JS instead (it makes it more flexible)
</script>

<template>
    <div
        v-if="props.tourId === tourStore.getCurrentIndex && tourStore.getShown"
        :class="[ 'page-tour-box', props.positionX + '-x', props.positionY ]"
    >
        <h3>{{ props.title }}</h3>
        <p>{{ props.description }}</p>
    </div>
</template>

<style lang="scss" scoped>
.page-tour-box {
    position: absolute;
    background-color: white;
    color: black;
    z-index: 1000;
    width: 200px;

    /* TODO: Add little arrows */
    &.left-x {
        left: 0;
    }

    &.center-x {
        left: 0;
    }

    &.right-x {
        left: 100%;
    }

    &.top {
        top: 0;
    }

    &.center {
        top: 50%;
    }

    &.bottom {
        top: 0;
    }
}
</style>
