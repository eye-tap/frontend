<script setup lang="ts">
    import {
        useStatusStore
    } from '@/ts/stores/status';

    const status = useStatusStore();
</script>

<template>
    <div class="user-card">
        <h1>
            Welcome back,
            <div class="welcome-user">
                {{ status.username !== '' ? status.username : 'Unknown User' }}
            </div>
        </h1>
    </div>
</template>

<style lang="scss" scoped>
@use '@/scss/components/home-boxes.scss' as *;

.user-card {
    @include home-boxes();
    border-radius: 20px 20px 0px 0px;
    margin-left: 10px;

    >h1 {
        margin: 0px;
        color: var( --theme-foreground-text );
        display: flex;

        >.welcome-user {
            color: var( --theme-interactable-text );
            margin-left: 0.5rem;
        }
    }
}
</style>
