<script setup lang="ts">
    import {
        RouterLink
    } from 'vue-router';
    import StatusBar from '@/components/StatusBar.vue';

</script>

<template>
    <div class="page-not-found">
        <StatusBar
            class="top-bar"
            :show-account="true"
            :show-theme-picker="true"
            page-title=""
            logo-click-target=""
        />
        <h1>404</h1>
        <p>Page not found</p>
        <RouterLink to="/" class="button primary">
            Home
        </RouterLink>
    </div>
</template>

<style lang="scss" scoped>
.page-not-found {
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    >.top-bar {
        height: 8vh;
        width: 100vw;
        top: 0;
        left: 0;
        position: fixed;
        background-color: var( --theme-bg-2 );
    }

    >h1 {
        margin: 15px;
        font-size: min(15vh, 15vw);
    }

    >p {
        margin: 5px;
    }

    >.button {
        margin-top: 50px;
    }
}
</style>
