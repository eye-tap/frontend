<script setup lang="ts">
    import editor, {
        redo,
        redoAvailable,
        undo,
        undoAvailable
    } from '..';
    import ExportOptions from './ExportOptions.vue';
    import OptionsPane from './OptionsPane.vue';
    import PreferencesPane from './PreferencesPane.vue';
    import {
        ref
    } from 'vue';

    const isSideBarCollapsed = ref( false );
    const showPreferences = ref( false );
    const showExportOptions = ref( false );

    const toggleCollapse = () => {
        isSideBarCollapsed.value = !isSideBarCollapsed.value;
    };

    const togglePreferences = () => {
        showPreferences.value = true;
    };

</script>
<!-- TODO: The sidebar (un)collapse animation doesn't look good right now. Ideally: Content is hidden but sidebar height preserved. -->

<template>
    <PreferencesPane v-model="showPreferences" />
    <div :class="[ 'side-pane', isSideBarCollapsed ? 'collapsed' : undefined ]">
        <!-- Non-collapsed -->
        <div id="tour-history" class="options-bar">
            <div v-if="!isSideBarCollapsed" title="Undo your last action" class="options-bar-left">
                <span class="clickable-icon" @click="undo">
                    <i v-if="undoAvailable" class="fa-lg fa-solid fa-rotate-left"></i>
                    <i v-else class="fa-lg fa-solid fa-rotate-left unavailable"></i>
                </span>
                <span class="clickable-icon" title="Redo your last undone action" @click="redo">
                    <i v-if="redoAvailable" class="fa-lg fa-solid fa-rotate-right"></i>
                    <i v-else class="fa-lg fa-solid fa-rotate-right unavailable"></i>
                </span>
                <span class="clickable-icon" title="Save" @click="editor.save">
                    <i class="fa-xl fa-solid fa-floppy-disk"></i>
                </span>
            </div>
            <div class="options-bar-right">
                <span class="clickable-icon" @click="toggleCollapse()">
                    <i class="fa-xl fa-solid fa-bars"></i>
                </span>
            </div>
        </div>
        <!-- Collapsed -->
        <div v-if="isSideBarCollapsed" class="options-bar">
            <span class="clickable-icon" title="Undo your last action" @click="undo">
                <i v-if="undoAvailable" class="fa-lg fa-solid fa-rotate-left"></i>
                <i v-else class="fa-lg fa-solid fa-rotate-left unavailable"></i>
            </span>
        </div>
        <div v-if="isSideBarCollapsed" class="options-bar">
            <span class="clickable-icon" title="Redo you last undone action" @click="redo">
                <i v-if="redoAvailable" class="fa-lg fa-solid fa-rotate-right"></i>
                <i v-else class="fa-lg fa-solid fa-rotate-right unavailable"></i>
            </span>
        </div>
        <div v-if="isSideBarCollapsed" class="options-bar">
            <span class="clickable-icon" title="Save" @click="editor.save">
                <i class="fa-xl fa-solid fa-floppy-disk"></i>
            </span>
        </div>
        <!-- Content -->
        <div v-if="!isSideBarCollapsed">
            <div class="options-bar-sm">
                <h2>Options</h2>
                <span class="clickable-icon" title="Advanced options" @click="togglePreferences()">
                    <i class="fa-lg fa-solid fa-gear"></i>
                </span>
            </div>
            <OptionsPane />
        </div>
        <div v-if="!isSideBarCollapsed && showExportOptions">
            <h2>Export</h2>
            <ExportOptions />
        </div>
        <div v-if="!isSideBarCollapsed" class="bottom-buttons">
            <button class="button primary" @click="editor.save">
                Save
            </button>
            <RouterLink to="/app" class="button secondary">
                Back
            </RouterLink>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.side-pane {
    width: 400px;       // Hardcoded, scalable sidebar (that looks good) is much work
    min-width: 400px;
    max-width: 22vw;
    display: block;
    overflow-x: hidden;
    transition: width 0.25s, min-width 0.25s;

    .export-button {
        margin-top: 1rem;
    }

    .bottom-buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .options-bar-sm {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        .clickable-icon {
            cursor: pointer;
            height: 20px;
            i{
                transition: rotate 0.1s;
            }
            i:hover {
                rotate: 40deg;
                color: var(--theme-bg-4-20);
            }
        }

        >h2 {
            margin: 0px;
        }
    }

    .options-bar {
        display: flex;
        align-items: center;
        justify-content: right;

        .clickable-icon {
            cursor: pointer;

            :hover {
                color: var(--theme-bg-4-20);
            }
        }

        .unavailable {
            color:  var(--theme-bg-3-20);
            cursor: not-allowed;
        }

        .options-bar-left {
            display: flex;
            align-items: center;
            justify-content: left;
            width: 100%;
        }

        .options-bar-right {
            display: flex;
            align-items: center;
        }
    }

    &.collapsed {
        width: 100px;
        min-width: 0;
    }

    >div {
        background-color: var( --theme-bg-2 );
        margin-top: 10px;
        margin-left: 10px;
        margin-right: 20px;
        margin-bottom: 10px;
        padding: 20px;

        >h2 {
            margin: 0;
            margin-bottom: 10px;
        }
    }
}
</style>
