<script setup lang="ts">
    import StatusBar from '@/components/StatusBar.vue';
</script>

<template>
    <div class="admin">
        <StatusBar
            class="top-bar"
            :show-account="true"
            :show-theme-picker="true"
            page-title="Admin Panel"
            logo-click-target="/app"
        />
        <div class="admin-wrapper">
            <h1>Admin Panel</h1>
        </div>
    </div>
</template>


<style scoped lang="scss">
    .admin {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;

        >.top-bar {
            height: 8vh;
            width: 100vw;
            top: 0;
            left: 0;
            position: fixed;
            background-color: var( --theme-bg-2 );
            box-shadow: 10px 10px 30px var(--theme-bg-1-shade);
        }

        >.admin-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            height: 90vh;
            margin-top: 10vh;
            width: 100vw;
        }
    }
</style>
