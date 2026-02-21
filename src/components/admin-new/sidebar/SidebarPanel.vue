<script setup lang="ts">
    import { ref, type Ref } from 'vue';
    import { 
        content
    } from './SidebarConfig';
    import { useSurveyStore } from '@/ts/stores/admin';
    import type { Mode } from '@/ts/stores/admin';

    const surveyStore = useSurveyStore();
    const selectedOption: Ref<number> = ref( -1 );

    const selectOption = ( id: number, mode: Mode ) => {
        selectedOption.value = id;
        surveyStore.setPanelMode( mode );

        switch (mode) {
            case ('surveys-create'):
                surveyStore.setSurveyID( -1 );
                break;
            case ('surveys'):
                surveyStore.setSurveyID( -2 );
                break;
        }
    };
</script>

<template>
    <div class="wrapper">
        <div
            v-for="section, i in content"
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
                    @click="selectOption( option.id, option.mode )"
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