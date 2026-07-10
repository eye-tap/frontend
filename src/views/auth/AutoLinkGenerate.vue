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
    <div class="wrapper">
        <StatusBar
            class="top-bar"
            :show-account="false"
            :show-theme-picker="true"
            page-title=""
            logo-click-target="/"
        />
        <div class="content">
            <h1>Generating login credentials</h1>
            <p v-if="errMsg !== ''" class="err">
                {{ errMsg }}
            </p>
            <i v-else class="fa-xl fa-solid fa-circle-notch loading-spinner"></i>
        </div>
    </div>
</template>

<style scoped lang="scss">

.wrapper {
    >.top-bar {
        height: 8vh;
        width: 100vw;
        top: 0;
        left: 0;
        position: fixed;
        background-color: var( --theme-bg-2 );
        box-shadow: 10px 10px 30px var(--theme-bg-1-shade);
    }
    >.content {
        display: flex;
        flex-direction: column;
        align-items: center;

        margin-top: 8vh;

        >h1 {
            padding-top: 2rem;
        }

        >p.err {
            color: var(--theme-warning);
            background-color: var(--theme-bg-1-shade);
            padding: 1rem;
            border-radius: 1rem;
        }

        @keyframes rotating {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        >i.loading-spinner {
            color: var(--theme-bg-4);
            animation: rotating 2s linear infinite;
            margin-top: 2rem;
        }
    }
}
</style>