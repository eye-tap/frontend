<script setup lang="ts">
    import {
        type Ref, ref
    } from 'vue';
    import {
        RouterLink, useRouter
    } from 'vue-router';
    import pwRating, {
        PWStrength
    } from '@/ts/auth/pw-rating';
    import LogoRenderer from '@/components/LogoRenderer.vue';
    import StatusBar from '@/components/StatusBar.vue';
    import auth from '@/ts/auth';
    import emailCheck from '@/ts/auth/email-check';
    import {
        useNotification
    } from '@kyvg/vue3-notification';
    import {
        useStatusStore
    } from '@/ts/stores/status';

    const status = useStatusStore();

    auth.verify()
        .then( () => {
            if ( status.isAuth ) {
                const redir = '/app';

                router.push( redir );

                return;
            }
        } )
        .catch( () => {
            loggingIn.value = false; // user not logged in
        } );

    const router = useRouter();
    const notification = useNotification();
    const username = ref( '' );
    const email = ref( '' );
    const password = ref( '' );
    const showPW = ref( false );
    const usernameError = ref( false );
    const emailError = ref( false );
    const pwError = ref( false );
    const passwordRating: Ref<string> = ref( '' );
    const numericalPWRating = ref( 0 );
    const errMsg = auth.errMsg;
    const loggingIn = auth.loggingIn;

    const togglePW = () => {
        showPW.value = !showPW.value;
    };

    const checkUsername = () => {
        if ( username.value.length < 4 ) {
            usernameError.value = true;
            errMsg.value = 'Username must be at least 4 characters';
        } else {
            usernameError.value = false;
            errMsg.value = '';
        }
    };

    const checkEmail = () => {
        if ( !email.value ) {
            emailError.value = true;
            errMsg.value = 'Email is required';
        } else if ( !emailCheck.checkEmail( email.value ) ) {
            emailError.value = true;
            errMsg.value = 'Invalid email address';
        } else {
            emailError.value = false;
            errMsg.value = '';
        }
    };

    const ratePW = () => {
        if ( !password.value ) {
            pwError.value = true;
            passwordRating.value = '';
            numericalPWRating.value = 0;
            errMsg.value = 'A password is required';

            return;
        }

        if ( password.value.length < 6 ) {
            pwError.value = true;
            passwordRating.value = '';
            numericalPWRating.value = 0;
            errMsg.value = 'Password must be at least 6 characters';

            return;
        }

        const rating = pwRating.ratePW( password.value );

        pwError.value = rating.value === PWStrength.BelowReq;
        errMsg.value = pwError.value ? 'Password does not meet requirements' : '';
        passwordRating.value = pwRating.getTranslation( rating.value );
        numericalPWRating.value = rating.id + 1;
    };

    const signup = () => {
        checkUsername();
        checkEmail();
        ratePW();

        if ( usernameError.value || emailError.value || pwError.value ) return;

        loggingIn.value = true;
        auth.signup( username.value, email.value, password.value, 'SURVEY_ADMIN' )
            .then( success => {
                loggingIn.value = false;

                if ( success ) {
                    notification.notify( {
                        'title': 'Signup',
                        'text': 'Signed up successfully! Please log in.',
                        'type': 'success'
                    } );
                    router.push( '/login' );
                } else {
                    errMsg.value = 'User already exists.';
                }
            } )
            .catch( e => {
                loggingIn.value = false;
                console.error( e );
                errMsg.value = 'Network error.';
            } );
    };

    const handlePW = ( key: KeyboardEvent ) => {
        if ( key.key === 'Enter' ) signup();
        else ratePW();
    };
</script>

<template>
    <div class="signup">
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
                <p class="title">
                    <span class="highlight">
                        Admin
                    </span>
                    Sign up
                </p>
                <div class="inputs">
                    <div class="err-wrapper">
                        <p v-if="errMsg" class="error-msg">
                            {{ errMsg }}
                        </p>
                        <div
                            v-if="loggingIn"
                            class="spinner-wrapper"
                        >
                            <i class="fa-solid fa-lg fa-arrows-rotate"></i>
                        </div>
                    </div>
                    <p class="desc">
                        Username
                    </p>
                    <input
                        v-model="username"
                        type="text"
                        placeholder="Choose a username"
                        :class="[ 'input', usernameError ? 'error' : undefined ]"
                        @keyup="checkUsername()"
                    >
                    <p class="desc">
                        Email address
                    </p>
                    <input
                        v-model="email"
                        type="email"
                        placeholder="Enter an email address"
                        :class="[ 'input', emailError ? 'error' : undefined ]"
                        @keyup="checkEmail()"
                    >
                    <p class="desc">
                        Password
                    </p>
                    <div class="password-wrapper">
                        <input
                            v-if="!showPW"
                            v-model="password"
                            type="password"
                            placeholder="Choose a password"
                            autocomplete="on"
                            :class="[ 'input', pwError ? 'error' : undefined ]"
                            @keyup="key => handlePW( key )"
                        >
                        <input
                            v-else
                            v-model="password"
                            type="text"
                            placeholder="Choose a password"
                            autocomplete="on"
                            :class="[ 'input', pwError ? 'error' : undefined ]"
                            @keyup="key => handlePW( key )"
                        >
                        <div class="password-toggle" @click="togglePW()">
                            <span v-if="showPW">
                                <i class="fa-solid fa-eye fa-lg"></i>
                            </span>
                            <span v-else>
                                <i class="fa-regular fa-eye fa-lg"></i>
                            </span>
                        </div>
                    </div>
                    <div v-if="passwordRating" class="pw-rating">
                        <progress :value="1 / 6 * numericalPWRating"></progress>
                        <p>{{ passwordRating }}</p>
                    </div>
                </div>
                <div class="buttons">
                    <button class="button primary" @click="signup">
                        Sign up
                    </button>
                    <RouterLink to="/">
                        <button class="button secondary">
                            Back
                        </button>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/scss/components/floating-form.scss';
.signup {
    @extend .floating-form;

    .logo {
        height: 100px;
        width: auto;
    }

    .title {
        color: var(--theme-bg-3-20);
        text-align: left;
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0px;

        >.highlight {
            color: var(--theme-bg-4);
        }
    }

    .err-wrapper {
        height: 3rem;
        display: flex;
        justify-items: center;
        align-items: center;

        .error-msg {
            color: var( --theme-warning );
            text-align: center !important;
            width: 100%;
        }

        >.spinner-wrapper {
            text-align: center;
            width: 100%;

            >i {
                color: var(--theme-interactable-text);
                animation: rotating 1.5s infinite;
            }

            @keyframes rotating {
                0% {
                    rotate: 0deg;
                    color: var(--theme-bg-4);
                }
                50% {
                    rotate: 180deg;
                    color: var(--theme-bg-5);
                }
                100% {
                    rotate: 360deg;
                    color: var(--theme-bg-4);
                }
            }
        }
    }

    .inputs {
        >.desc {
            color: var(--theme-bg-3-20);
            font-size: 0.85rem;

            padding: 0px;
            margin: 0px;
            margin-top: 0.5rem;
        }
    }

    .password-toggle {
        >span {
            margin-top: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .top-bar {
        height: 8vh;
        width: 100vw;
        top: 0;
        left: 0;
        position: fixed;
        background-color: var( --theme-bg-2 );
        box-shadow: 10px 10px 30px var( --theme-bg-1-shade );
    }
}
</style>
