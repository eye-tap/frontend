<script setup lang="ts">
    import {
        onMounted,
        ref
    } from 'vue';
    import StatusBar from '@/components/StatusBar.vue';
    import auth from '@/ts/auth';
    import magicLinks from '@/ts/auth/magic-links';
    import router from '@/ts/router';
    import {
        useStatusStore
    } from '@/ts/stores/status';

    const status = useStatusStore();
    const errMsg = ref( '' );

    const magicLink = async () => {
        // login using magic link
        const user = magicLinks.getDecoded();

        if ( user ) {
            const prolificIdIdx = location.search.indexOf( 'PROLIFIC_PID=' );

            if ( prolificIdIdx > 0 ) {
                console.log( '[AUTH] Prolific ID found in query params' );
                const prolificIdSubstring = location.search.substring( prolificIdIdx + 13 );
                const prolificIdEnd = prolificIdSubstring.indexOf( '&' );

                if ( prolificIdEnd > 0 ) {
                    status.prolificId = prolificIdSubstring.slice( 0, prolificIdEnd );
                } else {
                    status.prolificId = prolificIdSubstring;
                }
            }

            try {
                await auth.login( user.username, user.password );
            } catch ( e ) {
                console.error( e );
                errMsg.value = auth.errMsg.value || 'Login failed';
            }
        } else {
            router.push( '/auth/login' );
        }
    };

    onMounted( () => {
        magicLink();
    } );
</script>

<template>
    <div>
        <StatusBar
            class="top-bar"
            :show-account="false"
            :show-theme-picker="true"
            page-title=""
            logo-click-target="/"
        />
        <h1>Magic Link</h1>
        <p v-if="errMsg">
            {{ errMsg }}
        </p>
    </div>
</template>
