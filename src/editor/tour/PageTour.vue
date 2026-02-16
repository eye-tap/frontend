<script setup lang="ts">
    const dismiss = () => {
        localStorage.setItem( 'welcomeTourViewed', 'true' );
        show.value = false;
    };

    const show = defineModel<boolean>();
    const emit = defineEmits<{
        ( e: 'launch-tour' ): void
    }>();

    const startFullTour = () => {
        emit( 'launch-tour' );
        dismiss();
    };
</script>

<template>
    <div v-if="show" class="page-tour">
        <div class="page-tour-box">
            <i class="fa-solid fa-close" @click="dismiss"></i>
            <div>
                <h1>Welcome to the <span>Editor</span></h1>
                <p>
                    You usually want to start by filtering readers.
                    Some readers may not contain any gaze points.
                </p>
                <div style="margin: 10px">
                    Start by selecting a point, then there are three ways to annotate:
                    <div class="ul-container">
                        <ul>
                            <li>Drag a line from the point to a box</li>
                            <li>Click a box</li>
                            <li>Press a key to connect the point to the closest box with this character</li>
                        </ul>
                    </div>
                    <span>Note:</span> if you press Backspace or Delete, your last annotation will be deleted.
                </div>
                <button class="button primary" @click="startFullTour">
                    Start Tour
                </button>
                <!-- TODO: Add button to start detailed tour -->
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
        padding: 30px;
        position: relative;
        background-color: var( --theme-bg-1 );
        border-radius: 20px;
        text-align: center;

        span {
            color: var(--theme-interactable-text);
        }

        h1 {
            font-size: 3rem;
        }

        .ul-container {
            background-color: var(--theme-bg-2);
            padding: 0.5rem;
            padding-right: 1.5rem;
            margin: 1rem;
            border-radius: 20px;
        }

        ul {
            text-align: left;
        }

        >.fa-solid {
            position: absolute;
            top: 30px;
            right: 30px;
            font-size: 1.5rem;
            cursor: pointer;
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
