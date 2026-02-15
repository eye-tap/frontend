<script setup lang="ts">
    const dismiss = () => {
        show.value = false;
    };

    const keybindDescriptors = [
        {
            'keybind': 'CTRL + A',
            'function': 'Some function'
        },
        {
            'keybind': 'CTRL + A',
            'function': 'Some function'
        },
        {
            'keybind': 'CTRL + A',
            'function': 'Some function'
        },
        {
            'keybind': 'CTRL + A',
            'function': 'Some function'
        },
        {
            'keybind': 'CTRL + A',
            'function': 'Some function'
        }
    ];
    const show = defineModel<boolean>();
</script>

<template>
    <div v-if="show" class="wrapper">
        <div class="box">
            <div class="top-bar">
                <h1>Help</h1>
                <i class="fa-solid fa-close" @click="dismiss"></i>
            </div>
            <div>
                <div class="options-container">
                    <div class="options-section">
                        <p>Keybinds</p>
                        <div 
                            v-for="descriptor, index in keybindDescriptors"
                            :key="index"
                            class="keybinds"
                        >
                            <div class="keybind-wrapper">
                                <p class="keybind">
                                    {{ descriptor.keybind }}
                                </p>
                                <p class="keybind-desc">
                                    {{ descriptor.function }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    position: fixed;
    top: 0;
    left: 0;
    background-color: var( --theme-overlay );
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    z-index: 1;     // To properly black out all of the Editor

    >.box {
        >.top-bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            >i {
                color: var(--theme-foreground-text);
                font-size: 1.5rem;
                cursor: pointer;
            }

            >i:hover {
                color: var(--theme-bg-4-20);
            }

            >h1 {
                font-size: 2rem;
            }

        }

        width: 25vw;
        height: max-content;
        padding: 1px 1.5rem 1.5rem 1.5rem;
        position: relative;
        background-color: var( --theme-bg-2 );
        border-radius: 20px;

        .options-container {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            height: 60vh;
            padding: 1rem;
            background-color: var(--theme-bg-1);

            .options-section {
                >p {
                    color: var( --theme-bg-3 );
                    font-weight: 400;
                    font-size: 1rem;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }

                >div.keybinds {
                    margin-left: 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: left;
                    justify-content: center;

                    >div.keybind-wrapper {
                        display: flex;
                        align-items: center;
                        justify-content: left;
                        >p.keybind {
                            width:fit-content;
                            padding: 5px;
                            border-radius: 5px;

                            color: var(--theme-interactable-text);
                            background-color: var(--theme-bg-1-shade);

                            border-style: solid;
                            border-color: var(--theme-bg-1-shade);
                            border-width: 4px;

                            margin: 0px;
                            margin-right: 1rem;
                        }
                        >p.keybind-desc {
                            color: var( --theme-bg-3-20 );
                            font-weight: 400;
                            font-size: 1rem;
                        }
                    }
                }
            }
        }
    }
}
</style>
