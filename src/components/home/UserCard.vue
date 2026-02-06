<script setup lang="ts">
    import type {
        AnnotationSet
    } from '@/definitions/files';
    import auth from '@/scripts/auth/auth';
    import {
        computed
    } from 'vue';
    import router from '@/router';
    import {
        useStatusStore
    } from '@/stores/status';

    const status = useStatusStore();
    const props = defineProps<{
        'files': AnnotationSet[],
        'lastLogin': number
    }>();

    const openRecent = () => {
        let mostRecentIndex = 0;

        for ( let i = 0; i < props.files.length; i++ ) {
            if ( props.files[ mostRecentIndex ]!.progress!.uploaded < props.files[ i ]!.progress!.uploaded ) {
                mostRecentIndex = i;
            }
        }

        router.push( `/app/editor?file=${ props.files[ mostRecentIndex ]!.id }` );
    };

    const logout = () => {
        auth.logout();
    };


    const numberOfNewFilesAvailable = computed( () => {
        try {
            let count = 0;

            for ( let i = 0; i < props.files.length; i++ ) {
                if ( props.files[i]!.progress!.uploaded > props.lastLogin ) {
                    count++;
                }
            }

            return count;
        } catch ( error ) {
            console.warn( 'Error whilst computing number of new available files', error );

            return 0;
        }
    } );
</script>

<template>
    <div class="user-card">
        <h1>
            Welcome back,
            <div class="welcome-user">
                {{ status.username !== '' ? status.username : 'Unknown User' }}
            </div>
        </h1>
        <p v-if="numberOfNewFilesAvailable === 0" class="welcome-new-files">
            No new files have been uploaded for annotation
        </p>
        <p v-else class="welcome-new-files">
            {{ numberOfNewFilesAvailable }} new files have been uploaded for annotation
        </p>
        <div>
            <button :class="[ 'button', 'primary', $props.files.length === 0 ? 'disabled' : '' ]" @click="openRecent">
                Open Recent
            </button>
            <button class="button secondary" @click="logout">
                Log out
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/scss/components/home-boxes.scss' as *;

.user-card {
    @include home-boxes();
    border-radius: 20px 20px 0px 0px;

    .welcome-new-files {
        color: var(--theme-background-text-20);
    }

    >h1 {
        margin-top: 0;
        margin-bottom: 10px;
        color: var( --theme-foreground-text );
        display: flex;

        >.welcome-user {
            color: var( --theme-interactable-text );
            margin-left: 0.5rem;
        }
    }

    >p {
        margin-top: 0;
        margin-bottom: 40px;
        color: var( --theme-bg-3 );
    }

    >div {
        .button.primary {
            padding-left: 30px;
            padding-right: 30px;
        }
    }
}
</style>
