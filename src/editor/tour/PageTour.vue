
<script setup lang="ts">
import { isSideBarCollapsed } from '../data';

    const dismiss = () => {
        localStorage.setItem( 'welcomeTourViewed', 'true' );
        show.value = false;
    };

    const show = defineModel<boolean>();

    show.value = true;
    const emit = defineEmits<{
        ( e: 'launch-tour' ): void
    }>();

    const startFullTour = () => {
        isSideBarCollapsed.value = false;
        emit( 'launch-tour' );
        dismiss();
    };
</script>

<template>
    <div id="tour-finale">
    </div>
    <div v-if="show" class="page-tour">
        <div class="page-tour-box">
            <i class="fa-solid fa-close" @click="dismiss"></i>
            <div>
                <h1>Welcome to the <span>Editor</span></h1>
                <div class="box-content">
                    <p class="desc">
                        Start by selecting a point, then there are three ways to annotate:
                    </p>
                    <div class="ul-container">
                        <ul>
                            <li><span>Press</span> a key on your keyboard to connect the point to the closest box with this character</li>
                            <li><span>Click</span> a box</li>
                            <li><span>Drag</span> a line from the point to a box</li>
                        </ul>
                    </div>
                    <p class="desc">
                        First time? Try the Editor Tour.
                    </p>
                </div>
                <div class="buttons">
                    <button class="button primary" @click="startFullTour">
                        Start Tour
                    </button>
                    <button class="button secondary" @click="dismiss">
                        Skip Tour
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.page-tour {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: var( --theme-overlay );
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;

    >.page-tour-box {
        width: max-content;
        height: max-content;
        padding: 3rem;
        position: relative;
        background-color: var( --theme-bg-1 );
        border-radius: 20px;
        text-align: center;

        >div>.box-content {
            margin-bottom: 2rem;
        }

        span {
            color: var(--theme-interactable-text);
        }

        h1 {
            font-size: 3rem;
        }

        .desc {
            color: var(--theme-bg-3-20);
        }

        .ul-container {
            padding: 0.5rem;
            padding-right: 1.5rem;
            border-radius: 20px;

            >ul>li {
                background-color: var(--theme-bg-2);
                padding: 1rem;
                margin-bottom: 1rem;
                border-radius: 10px;
            }
        }

        ul {
            text-align: left;
            list-style-type: none;
        }

        >.fa-solid {
            position: absolute;
            top: 30px;
            right: 30px;
            font-size: 1.5rem;
            cursor: pointer;
        }

        >.fa-solid:hover {
            color: var(--theme-bg-4);
        }

        >div {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100%;
        }
    }
}
</style>
