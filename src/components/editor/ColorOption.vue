<script setup lang="ts">
    import {
        ChromePicker
    } from 'vue-color';
    import {
        ref
    } from 'vue';

    const props = defineProps<{
        'text': string,
    }>();
    const color = defineModel<string>();
    const showColorPicker = ref( false );

    const openColorPicker = () => {
        showColorPicker.value = true;
    };

    const closeColorPicker = () => {
        showColorPicker.value = false;
    };
</script>

<template>
    <div>
        <label class="color-option">
            <div class="color-preview-wrapper">
                <span
                    :style="`background-color: ${ color };`"
                    class="color-preview"
                    @click="openColorPicker"
                ></span>
            </div>

            <ChromePicker
                v-if="showColorPicker"
                v-model="color"
                class="color-picker"
            />
            <p>{{ props.text }}</p>
        </label>
        <div
            v-if="showColorPicker"
            class="color-picker-dismiss"
            @click="closeColorPicker"
        ></div>
    </div>
</template>

<style scoped lang="scss">
    .color-picker-dismiss {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 19;
    }

    label {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
        padding-left: 20px;
        margin-bottom: 5px;
        height: 2rem;
        position: relative;

        p {
            color: var(--theme-bg-3-20);
        }

        .color-picker {
            position: absolute;
            z-index: 20;
            top: 100%;
        }

        .color-preview-wrapper {
            background-color: var(--theme-bg-3);
            padding: 4px;
            border-radius: 10px;
            margin-right: 10px;

            >.color-preview {
                display: block;
                width: 25px;
                height: 25px;
                border-radius: 8px;
                cursor: pointer;
            }
        }
    }
</style>
