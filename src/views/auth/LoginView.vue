<script setup lang="ts">
    import {
        RouterLink, useRouter
    } from 'vue-router';
    import LogoRenderer from '@/components/LogoRenderer.vue';
    import StatusBar from '@/components/StatusBar.vue';
    import auth from '@/ts/auth';
    import magicLinks from '@/ts/auth/magic-links';
    import {
        ref
    } from 'vue';
    import {
        useStatusStore
    } from '@/ts/stores/status';

    const router = useRouter();
    const status = useStatusStore();
    const showPW = ref( false );
    const id = ref( '' );
    const password = ref( '' );
    const errMsg = auth.errMsg;
    const loggingIn = auth.loggingIn;
    // Simple validation flags
    const idError = ref( false );
    const pwError = ref( false );

    const checkPW = () => {
        if ( !password.value ) {
            pwError.value = true;
            errMsg.value = 'A password is required';
        } else {
            pwError.value = false;
            errMsg.value = '';
        }
    };

    const togglePW = () => {
        showPW.value = !showPW.value;
    };

    const login = async () => {
        checkPW();

        if ( idError.value || pwError.value ) return;

        try {
            await auth.login( id.value, password.value );
        } catch ( e ) {
            console.error( e );
            errMsg.value = auth.errMsg.value || 'Login failed';
        }
    };

    // Auto-redirect if already logged in
    auth.verify()
        .then( () => {
            if ( status.isAuth ) {
                const redir = '/app';

                router.push( redir );

                return;
            } else {
                magicLink();
            }
        } )
        .catch( () => {
            loggingIn.value = false; // user not logged in
            magicLink();
        } );

    const magicLink = () => {
        // login using magic link
        const user = magicLinks.getDecoded();

        if ( user ) {
            id.value = user.username;
            password.value = user.password;

            login();
        }
    };

    const keyHandler = ( ev: KeyboardEvent ) => {
        if ( ev.key === 'Enter' ) {
            login();
        } else {
            idError.value = false;
            pwError.value = false;
            errMsg.value = '';
        }
    };
</script>

<template>
    <div class="login">
        <div class="wrapper">
            <StatusBar
                class="top-bar"
                :show-account="false"
                :show-theme-picker="true"
                page-title=""
                logo-click-target=""
            />
            <div class="applet">
                <div class="logo-bar">
                    <LogoRenderer :kind="'full'" class="logo" />
                </div>
                <div class="inputs">
                    <!-- Email input -->
                    <input
                        v-model="id"
                        type="text"
                        placeholder="Your email or username"
                        :class="['input', idError ? 'error' : '']"
                    >

                    <!-- Password input -->
                    <div class="password-wrapper">
                        <input
                            v-model="password"
                            :type="showPW ? 'text' : 'password'"
                            placeholder="Your password"
                            autocomplete="on"
                            :class="['input', pwError ? 'error' : '']"
                            @keyup="keyHandler"
                        >
                        <div class="password-toggle" @click="togglePW">
                            <span v-if="showPW">
                                <i class="fa-solid fa-eye fa-lg"></i>
                            </span>
                            <span v-else>
                                <i class="fa-regular fa-eye fa-lg"></i>
                            </span>
                        </div>
                    </div>
                    <div class="errWrapper">
                        <p v-if="errMsg" class="error">
                            {{ errMsg }}
                        </p>
                    </div>
                </div>

                <!-- Login button -->
                <div class="buttons">
                    <button class="button primary" @click="login">
                        Log in
                        <div v-if="loggingIn">
                            <i class="fa-solid fa-lg fa-arrows-rotate"></i>
                        </div>
                    </button>
                    <RouterLink to="/signup">
                        <button class="button secondary">
                            Sign up
                        </button>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
@use '@/scss/components/floating-form.scss';

.login {
    @extend .floating-form;

    .logo {
        height: 100px;
        width: auto;
    }

    .password-toggle {

        >span {
            margin-top: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .errWrapper {
        width: 100%;

        >.error {
            color: var(--theme-warning);
            text-align: center;
            padding: 0;
            margin: 0;
        }
    }

    .top-bar {
        height: 8vh;
        width: 100vw;
        top: 0;
        left: 0;
        position: fixed;
        background-color: var( --theme-bg-2 );
        box-shadow: 10px 10px 30px var(--theme-bg-1-shade);
    }

    >.bottom-bar {
        position: fixed;
        width: 100vw;
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 0.8rem;
        display: flex;
        justify-content: flex-end;
        bottom: 0;
        background-color: var( --theme-bg-2 );

        >a {
            padding-right: 10px;
            padding-left: 10px;
            color: var(--theme-primary);

            &#tos {
                border-right: var(--theme-primary) 1px solid;
            }
        }
    }
}
</style>
