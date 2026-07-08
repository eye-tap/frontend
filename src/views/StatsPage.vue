<script setup lang="ts">
    import StatsView from '@/components/StatsView.vue';
    import StatusBar from '@/components/StatusBar.vue';

</script>

<template>
    <div class="stats-page">
        <StatusBar
            class="top-bar"
            :show-account="false"
            :show-theme-picker="true"
            page-title=""
            logo-click-target="/"
        />
        <div class="stats-wrapper">
            <h1>Statistics</h1>
            <StatsView />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .stats-page {
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        overflow: hidden;

        >.top-bar {
            height: 8vh;
            width: 100vw;
            top: 0;
            left: 0;
            position: fixed;
            background-color: var( --theme-bg-2 );
            box-shadow: 10px 10px 30px var(--theme-bg-1-shade);
        }

        >.stats-wrapper {
            display: flex;
            flex-direction: column;
            position: relative;
            height: 100%;
            width: 80%;
            overflow-y: scroll;
            overflow-x: hidden;
        }
    }
</style>
