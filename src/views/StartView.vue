<script setup lang="ts">
    import LogoRenderer from '@/components/LogoRenderer.vue';
    import StatusBar from '@/components/StatusBar.vue';
    import router from '@/ts/router';

    const login = () => {
        router.push( '/login' );
    };

    const signup = () => {
        router.push( '/signup' );
    };

    const create = () => {
        router.push( '/signup/admin' );
    };
</script>

<template>
    <div class="home">
        <StatusBar
            class="top-bar"
            :show-account="false"
            :show-theme-picker="true"
            page-title=""
            logo-click-target=""
        />
        <div class="home-wrapper">
            <div class="home-left">
                <div class="home-content">
                    <LogoRenderer :kind="'full'" class="logo" />
                    <p class="tagline">
                        Annotate effortlessly
                    </p>
                    <div class="home-buttons">
                        <div class="home-buttons-top">
                            <button class="button primary" @click="login()">
                                Log in
                            </button>
                            <button class="button secondary" @click="signup()">
                                Sign up
                            </button>
                        </div>
                        <button class="button secondary" @click="create()">
                            Create Survey
                        </button>
                    </div>
                </div>
            </div>
            <div class="home-right">
                <img class="preview-image" src="../../public/assets/editor-preview-image.png" alt="">
                <p class="preview-image-subtitle">Easily annotate using an intuitive interface.</p>
            </div>
        </div>
        <div class="home">
        </div>
    </div>
</template>


<style scoped lang="scss">
    .home {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;

        >.top-bar {
            height: 8vh;
            width: 100vw;
            top: 0;
            left: 0;
            position: fixed;
            background-color: var( --theme-bg-2 );
            box-shadow: 10px 10px 30px var(--theme-bg-1-shade);
        }

        >.home-wrapper {
            display: grid;
            grid-column: 1fr 1fr;
            grid-auto-flow: column;
            height: 90vh;
            margin-top: 10vh;
            width: 100vw;

            .home-left {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: row;

                .home-buttons {
                    display: flex;
                    flex-direction: column;
                    align-items: left;
                    justify-content: space-between;
                    width: 25rem;

                    >button {
                        margin-bottom: 1rem;
                        width: 12rem;
                        padding-left: 0px;
                        padding-right: 0px;
                    }

                    .home-buttons-top {
                        display: flex;
                        align-items: center;
                        justify-content: left;
                        margin-bottom: 1rem;

                        >button {
                            width: 12rem;
                        }
                    }
                }

                .tagline {
                    margin-top: 0px;
                    margin-bottom: 6vh;
                }

                .logo {
                    height: 15vh;
                    justify-content: left;
                }
            }

            .home-right {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                @media screen and (max-width: 1500px) {
                    display: none;
                }

                >img {
                    border-style: solid;
                    border-width: 15px;
                    border-radius: 20px;
                    border-color: var(--theme-bg-2);
                    user-select: none;
                    pointer-events: none;
                }

                >p {
                    color: var(--theme-bg-3);
                    font-weight: 600;
                    user-select: none;
                }
            }
        }
    }
</style>
