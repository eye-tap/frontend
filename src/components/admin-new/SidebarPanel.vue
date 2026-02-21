<script setup lang="ts">
    import {
        type Ref, ref
    } from 'vue';
    import {
        adminBaseRoute,
        adminContent
    } from './adminConfig';
    import {
        useRouter
    } from 'vue-router';

    const router = useRouter();
    const selectedOption: Ref<number> = ref( -1 );

    const selectOption = ( id: number, route: string ) => {
        selectedOption.value = id;
        router.push( adminBaseRoute + route );
    };
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
                <p
                    v-for="option in section.content"
                    :key="option.id"
                    :class="selectedOption === option.id ? 'selected' : undefined"
                    class="option"
                    @click="selectOption( option.id, option.route )"
                >
                    {{ option.text }}
                </p>
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

                &.selected {
                    color: var(--theme-foreground-text);
                }
            }
            >.option:hover {
                color: var(--theme-interactable-text-20);
                cursor: pointer;

                &.selected {
                    color: var(--theme-foreground-text);
                    cursor: default;
                }
            }
        }
    }
}
</style>
