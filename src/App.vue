<template>
    <!-- <div @contextmenu="e => e.preventDefault()"> -->
    <div>
        <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition ? String( route.meta.transition ) : 'fade'" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
        <notifications
            position="top center"
            :duration="5000"
            class="notifications"
            style="top: 20px;"
            width="400px"
            :max="3"
        />
    </div>
</template>

<script setup lang="ts">
    import {
        RouterView
    } from 'vue-router';
</script>

<style lang="scss">
/* generate the theme classes from scss */
@include gen-theme('.theme-red', $theme-red);
@include gen-theme('.theme-blue', $theme-blue);
@include gen-theme('.theme-black', $theme-black);
@include gen-theme('.theme-purple', $theme-purple);
// NOTE: Simply add a new one like above to the list here, template is theme-<theme-name here> for the first arg,
// second arg simply has to correspond to scss var in src/scss/_theme.scss

.notifications {
    .vue-notification {
        padding: 20px;
        .notification-title {
            font-size: 1rem;
        }
        .notification-text {
            font-size: 0.75rem;
        }
    }
}

::selection {
    background-color: #7c8cec;
    color: white;
}
</style>
