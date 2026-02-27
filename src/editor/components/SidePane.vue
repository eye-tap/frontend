<script setup lang="ts">
    import editor, {
        redoAvailable,
        saveNeeded,
        undoAvailable
    } from '..';
    import {
        onMounted,
        onUnmounted,
        ref
    } from 'vue';
    import KeybindPane from './KeybindPane.vue';
    import OptionsPane from './OptionsPane.vue';
    import PreferencesPane from './PreferencesPane.vue';
    import {
        isSideBarCollapsed
    } from '../data';
    import {
        useNotification
    } from '@kyvg/vue3-notification';

    const showPreferences = ref( false );
    const showKeybinds = ref( false );
    const saving = ref( false );
    const notifications = useNotification();

    const toggleCollapse = () => {
        isSideBarCollapsed.value = !isSideBarCollapsed.value;
    };

    const togglePreferences = () => {
        showPreferences.value = true;
    };

    const toggleKeybinds = () => {
        showKeybinds.value = true;
    };

    const save = () => {
        if ( !saveNeeded.value ) return;

        saving.value = true;
        editor.save();
    };

    const saveSuccessHandler = () => {
        notifications.notify( {
            'text': 'Your progress was saved',
            'type': 'success',
            'title': 'Editor'
        } );
        saving.value = false;
    };

    const saveFailHandler = ( ev: CustomEvent ) => {
        console.log( ev.detail );
        notifications.notify( {
            'text': 'There was an error saving your progress',
            'type': 'error',
            'title': 'Editor'
        } );
        saving.value = false;
    };

    onMounted( () => {
        document.addEventListener( 'eyetap:save:success', saveSuccessHandler );
        document.addEventListener( 'eyetap:save:fail', saveFailHandler );
    } );
    onUnmounted( () => {
        document.removeEventListener( 'eyetap:save:success', saveSuccessHandler );
        document.removeEventListener( 'eyetap:save:fail', saveFailHandler );
    } );
</script>

<template>
    <PreferencesPane v-model="showPreferences" />
    <KeybindPane v-model="showKeybinds" />
    <div :class="[ 'side-pane', isSideBarCollapsed ? 'collapsed' : undefined ]">
        <!-- Non-collapsed -->
        <div id="tour-history" class="options-bar">
            <div v-if="!isSideBarCollapsed" title="Undo your last action" class="options-bar-left">
                <span class="clickable-icon" :class="undoAvailable ? '' : 'unavailable'" @click="editor.undo">
                    <i class="fa-lg fa-solid fa-rotate-left"></i>
                </span>
                <span
                    class="clickable-icon"
                    :class="redoAvailable ? '' : 'unavailable'"
                    title="Redo your last undone action"
                    @click="editor.redo"
                >
                    <i class="fa-lg fa-solid fa-rotate-right"></i>
                </span>
                <span
                    class="clickable-icon"
                    :class="saveNeeded ? '' : 'unavailable'"
                    title="Save"
                    @click="save"
                >
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
            <span class="clickable-icon" title="Undo your last action" @click="editor.undo">
                <i v-if="undoAvailable" class="fa-lg fa-solid fa-rotate-left"></i>
                <i v-else class="fa-lg fa-solid fa-rotate-left unavailable"></i>
            </span>
        </div>
        <div v-if="isSideBarCollapsed" class="options-bar">
            <span class="clickable-icon" title="Redo you last undone action" @click="editor.redo">
                <i v-if="redoAvailable" class="fa-lg fa-solid fa-rotate-right"></i>
                <i v-else class="fa-lg fa-solid fa-rotate-right unavailable"></i>
            </span>
        </div>
        <div v-if="isSideBarCollapsed" class="options-bar">
            <span class="clickable-icon" title="Save" @click="save">
                <i v-if="saveNeeded" class="fa-xl fa-solid fa-floppy-disk"></i>
                <i v-else class="fa-xl fa-solid fa-floppy-disk unavailable"></i>
            </span>
        </div>
        <!-- Content -->
        <div v-if="!isSideBarCollapsed">
            <div id="tour-options" class="options-bar-sm">
                <h2>Options</h2>
                <div>
                    <span
                        id="tour-keybinds"
                        class="clickable-icon"
                        title="Help"
                        @click="toggleKeybinds()"
                    >
                        <i class="fa-lg fa-regular fa-circle-question"></i>
                    </span>
                    <span
                        id="tour-preferences"
                        class="clickable-icon gear-icon"
                        title="Advanced options"
                        @click="togglePreferences()"
                    >
                        <i class="fa-lg fa-solid fa-gear"></i>
                    </span>
                </div>
            </div>
            <OptionsPane />
        </div>
        <div v-if="!isSideBarCollapsed" class="bottom-buttons">
            <!-- TODO: Unavailable class might need a bit of a better design -->
            <button class="button primary long-action" :class="saveNeeded ? '' : 'unavailable'" @click="save">
                Save
                <div v-if="saving">
                    <i class="fa-solid fa-lg fa-arrows-rotate"></i>
                </div>
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

        .button.unavailable {
            background-color: var(--theme-bg-1);
            color: gray;
            cursor: not-allowed;
        }
    }

    .options-bar-sm {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        >div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 60px;
        }

        .clickable-icon {
            cursor: pointer;
            height: 20px;
            i:hover {
                color: var(--theme-bg-4-20);
            }
        }

        .gear-icon {
            i{
                transition: rotate 0.1s;
            }
            i:hover {
                rotate: 40deg;
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

            &.unavailable {
                color:  var(--theme-bg-3-20);
                cursor: not-allowed;

                :hover {
                    color: var( --theme-bg-3-20 );
                }
            }

            :hover {
                color: var(--theme-bg-4-20);
            }
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
