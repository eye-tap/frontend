<script setup lang="ts">
    import {
        adminBaseRoute,
        adminContent
    } from './adminConfig';
</script>

<template>
    <div class="wrapper">
        <div
            v-for="section, i in adminContent"
            :key="i"
            class="section"
        >
            <p class="title">
                {{ section.name.toUpperCase() }}
            </p>
            <div class="options">
                <RouterLink
                    v-for="option in section.content"
                    :key="option.id"
                    :to="adminBaseRoute + option.route"
                >
                    <p class="option">
                        {{ option.text }}
                    </p>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.wrapper {
    height: 85vh;

    margin-left: 2rem;
    padding-right: 2rem;
    margin-right: 2rem;

    border-style: solid;
    border-color: var(--theme-bg-3-shade);
    border-width: 0px 2px 0px 0px;

    overflow-y: auto;
    scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );

    a {
        text-decoration: none;
    }

    >.section {

        >.title {
            color: var(--theme-background-text);
            font-size: 0.85rem;
            font-weight: 700;
        }

        >.options {
            margin-left: 1rem;
            margin-bottom: 2rem;

            >.option {
                color: var(--theme-interactable-text);
                transition: color 0.1s;
                display: block;
                text-decoration: none;

                &.router-link-exact-active {
                    color: var(--theme-foreground-text);
                }

                &:hover {
                    color: var(--theme-interactable-text-20);
                    cursor: pointer;

                    &.router-link-exact-active {
                        color: var(--theme-foreground-text);
                        cursor: default;
                    }
                }
            }
        }
    }
}
</style>
