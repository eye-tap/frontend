<script setup lang="ts">
    import SurveyBrowser from './surveys/SurveyBrowser.vue';
</script>

<template>
    <div class="survey-manager">
        <SurveyBrowser />
        <div>
            <router-view v-slot="{ Component, route }">
                <transition :name="route.meta.transition ? String( route.meta.transition ) : 'fade'" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.survey-manager {
    display: flex;
}
</style>
