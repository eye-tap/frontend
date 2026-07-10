<script setup lang="ts">
    import {
        onMounted,
        ref
    } from 'vue';
    import StatusBar from '@/components/StatusBar.vue';
    import auth from '@/ts/auth';
    import {
        generateCredentials
    } from '@/ts/auth/credential-generator';
    import {
        useStatusStore
    } from '@/ts/stores/status';

    const errMsg = ref( '' );
    const status = useStatusStore();
    const errMsgMap: {
        [key: string]: string
    } = {
        'ERR_PARSE': 'Failed to parse the link',
        'ERR_NO_STUDIES': 'No studies were provided in the link. Please ensure you have copied the entire link!',
        'ERR_NO_CREDS': 'Failed to get new credentials',
        'ERR_NO_SESSIONS': 'No sessions were provided in the link. Please ensure you have copied the entire link!'
    };

    const getCredsAndLogin = async () => {
        status.prolificId = auth.parseProlificId();

        // Get credentials
        try {
            const user = await generateCredentials();

            try {
                await auth.login( user.username, user.password );
            } catch ( e ) {
                console.error( e );
                errMsg.value = auth.errMsg.value || 'Login failed';
            }
        } catch ( error ) {
            if ( error instanceof Error ) {
                console.error( error.message );
                errMsg.value = errMsgMap[String( error.message )] || 'Login failed (reason unknown)';
            } else {
                console.error( error );
                errMsg.value = errMsgMap[String( error )] || 'Login failed (reason unknown)';
            }
        }
    };

    onMounted( () => {
        getCredsAndLogin();
    } );
</script>

<template>
    <div>
        <div class="wrapper">
            <StatusBar
                class="top-bar"
                :show-account="false"
                :show-theme-picker="true"
                page-title=""
                logo-click-target="/"
            />
            <h1>Generating login credentials for you</h1>
            {{ errMsg }}
        </div>
    </div>
</template>
