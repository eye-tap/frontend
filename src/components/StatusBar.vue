<script setup lang="ts">
    import {
        computed,
        ref
    } from 'vue';
    import {
        selectedTheme,
        themes
    } from '@/ts/util/theme';
    import LogoRenderer from './LogoRenderer.vue';
    import auth from '@/ts/auth/auth';
    import router from '@/ts/router';

    const showUserMenu = ref( false );
    const showThemePickerMenu = ref( false );

    const toggleMenu = () => {
        showUserMenu.value = !showUserMenu.value;

        if ( showUserMenu.value ) showThemePickerMenu.value = false;
    };

    const setThemePickerMenu = ( kind: 'open' | 'close' | 'toggle' ) => {
        if ( kind === 'open' ) showThemePickerMenu.value = true;
        else if ( kind === 'close' ) showThemePickerMenu.value = false;
        else showThemePickerMenu.value = !showThemePickerMenu.value;

        if ( showThemePickerMenu.value ) showUserMenu.value = false;
    };

    const logoClick = () => {
        if ( props.logoClickTarget != '' && props.logoClickTarget !== router.currentRoute.value.path )
            router.push( props.logoClickTarget );
    };

    const logoRedirectable = computed( () => {
        return props.logoClickTarget != '' && props.logoClickTarget !== router.currentRoute.value.path;
    } );
    const props = defineProps<{
        'showAccount': boolean,
        'showThemePicker': boolean,
        'pageTitle': string,
        'logoClickTarget': string,
    }>();
</script>

<template>
    <div class="status-bar">
        <LogoRenderer
            :kind="'eye'"
            class="logo"
            :class="[ logoRedirectable ? 'clickable' : undefined, props.pageTitle ? 'page-title-visible' : undefined ]"
            @click="logoClick"
        />
        <div v-if="props.pageTitle" class="page-title">
            {{ $props.pageTitle }}
        </div>

        <div v-if="$props.showThemePicker" class="user-menu-wrapper">
            <button
                v-if="$props.showThemePicker"
                id="theme-select"
                class="user-button"
                title="Change Theme"
                @click="setThemePickerMenu( 'toggle' )"
            >
                <i v-if="!showThemePickerMenu" class="fa-2xl fa-regular fa-moon theme-icon"></i>
                <i v-else class="fa-2xl fa-solid fa-moon theme-icon"></i>
            </button>
            <div :class="[ 'theme-menu', showThemePickerMenu ? 'shown' : undefined , props.showAccount ? 'theme-menu-alt' : 'theme-menu' ]">
                <h2>Themes</h2>
                <p>Select a Theme</p>
                <button
                    v-for="theme, idx in themes"
                    :key="idx"
                    :class="{ alternative : theme !== selectedTheme }"
                    class="button primary theme-button"
                    @click="() => selectedTheme = theme"
                >
                    {{ theme }}
                </button>

                <!-- For user-made themes, color pickers etc. could be added here -->
            </div>
        </div>
        <div v-if="props.showAccount" class="user-menu-wrapper">
            <button class="user-button" @click="toggleMenu()">
                <i v-if="showUserMenu" class="fa-xl fa-solid fa-user"></i>
                <i v-else class="fa-xl fa-regular fa-user"></i>
            </button>

            <div :class="[ 'user-menu', showUserMenu ? 'shown' : undefined ]">
                <h2>Username</h2>
                <p>Logged in</p>
                <button class="button primary" @click="auth.logout">
                    Log out
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.status-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;

    >.logo {
        width: auto;
        height: 50%;
        margin-left: 30px;
        margin-right: auto;

        &.clickable {
            cursor: pointer;
        }

        &.page-title-visible {
            margin-right: 20px;
            padding-right: 20px;
            border-right: 1px solid var( --theme-foreground-text );
        }
    }

    .page-title {
        margin-right: auto;
        font-weight: bold;
        font-size: 1.3rem;
    }

    >.user-menu-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 3;

        >.user-button {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 20px;
            gap: 3px;
            background: none;
            color: var( --theme-foreground-text );
            font-size: 1rem;
            border: none;
            cursor: pointer;
        }

        >.theme-menu {
            position: absolute;
            top: 6vh;
            right: 0vw;
            padding-top: 1rem;
            padding-bottom: 20px;
            padding-left: 25px;
            padding-right: 10px;
            display: block;
            width: 150px;
            height: full;
            background-color: var( --theme-bg-2 );
            z-index: -1;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            box-shadow: 5px 5px 20px var(--theme-bg-1);

            transform: translateX(60vw);
            transform-origin: top right;
            transition: transform 0.25s linear;
            overflow: hidden;

            &.theme-menu-alt {
                right: -3vw;
            }

            &.shown {
                transform: translateX(0);
            }

            h2 {
                font-size: 1.5rem;
                font-weight: 300;
                margin-top: 0px;
                margin-bottom: 0px;
            }

            p {
                color: var(--theme-bg-3-20);
                margin-top: 0px;
                margin-bottom: 20px;
            }
        }

        >.user-menu {
            position: absolute;
            top: 6vh;
            right: 0px;
            padding-top: 1rem;
            padding-bottom: 10px;
            padding-left: 25px;
            padding-right: 10px;
            display: block;
            width: 200px;
            height: 135px;
            background-color: var( --theme-bg-2 );
            z-index: -1;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            box-shadow: 5px 5px 20px var(--theme-bg-1);

            transform: translateX(60vw);
            transform-origin: top right;
            transition: transform 0.25s linear;
            overflow: hidden;

            &.shown {
                transform: translateX(0);
            }

            h2 {
                font-size: 1.5rem;
                font-weight: 300;
                margin-top: 0px;
                margin-bottom: 0px;
            }

            p {
                color: var(--theme-bg-3-20);
                margin-top: 0px;
                margin-bottom: 20px;
            }
        }
    }

    >#theme-select {
        margin-right: 30px;
        height: 50%;
        width: auto;
        background: none;
        border: none;
        color: var(--theme-primary);
        cursor: pointer;
    }
}
</style>
