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
            <div>
                <!-- <img src="/assets/eyetap-logo.png" class="logo"> -->
                <LogoRenderer :kind="'full'" class="logo" />
                <p class="tagline">
                    Annotate effortlessly
                </p>
                <button class="button primary" @click="login()">
                    Log in
                </button>
                <button class="button secondary" @click="signup()">
                    Sign up
                </button>
                <button class="button secondary" @click="create()">
                    Create Survey
                </button>
            </div>
            <!-- <img src="/assets/logo.jpg" class="logo"> -->
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
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            height: 90vh;
            margin-top: 10vh;
            width: 100vw;

            .tagline {
                margin-top: 0px;
                margin-bottom: 6vh;
            }

            .logo {
                height: 15vh;
                border-radius: 20px;
            }
        }
    }
</style>
