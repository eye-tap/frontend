<script setup lang="ts">
    import Sidebar from '@/components/admin-new/SidebarPanel.vue';
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
        <Sidebar />
        <div class="content-wrapper">
            <router-view v-slot="{ Component, route }">
                <transition :name="route.meta.transition ? String( route.meta.transition ) : 'fade'" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content-wrapper {
    display: grid;
    grid-template-columns: max(30vw, 500px) auto;
}

.top-bar {
    height: 8vh;
    width: 100vw;
    top: 0;
    left: 0;
    position: fixed;
    background-color: var( --theme-bg-2 );
    box-shadow: 10px 10px 30px var(--theme-bg-1-shade);
}

.admin  {
    display: grid;
    grid-template-columns: 275px auto;
    height: 90vh;
    margin-top: 10vh;
}

</style>
