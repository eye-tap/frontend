<script setup lang="ts">
    import {
        type Ref,
        ref
    } from 'vue';
    import type {
        AnnotationSet
    } from '@/types/files';
    import FilePicker from '@/components/home/FilePicker.vue';
    import PreviewProvider from '@/components/home/PreviewProvider.vue';
    import UserCard from '@/components/home/UserCard.vue';
    import {
        listAnnotationSets
    } from '@/ts/files/file';
    import router from '@/ts/router';
    import {
        startExport
    } from '@/ts/export';
    import testData from '@/ts/dev/test-data.json';
    import {
        useActiveFileStore
    } from '@/ts/stores/activeFileStore';
    import {
        useNotification
    } from '@kyvg/vue3-notification';

    const devMode = import.meta.env.VITE_DISABLE_LOGIN_CHECK;
    const file: Ref<AnnotationSet> = ref( {
        'id': 0,
        'baseName': 'No file selected',
        'files': {},
        'size': 0,
        'uploader': 'N/A',
        'progress': {
            'uploaded': new Date().getTime(),
            'id': 0,
            'assigned': 100,
            'wordCount': 200,
            'gazePoints': 175,
            'modified': new Date().getTime()
        }
    } );
const activeFile = useActiveFileStore();
    const files: Ref<AnnotationSet[]> = ref( [] );
    const loading = ref( true );
    const lastLogin = ref( new Date().getTime() - 10000 );
    const notifications = useNotification();

    const reloadFromServer = () => {
        if ( devMode ) return useTestData();

        loading.value = true;
        listAnnotationSets()
            .then( list => {
                files.value = list;
                let last = 0;

                // Determine last login date
                for ( let i = 0; i < files.value.length; i++ ) {
                    const file = files.value[ i ]!;

                    if ( file.progress && file.progress.modified > last )
                        last = file.progress.modified;
                }

                lastLogin.value = last;

                loading.value = false;
            } )
            .catch( e => {
                console.error( e );
                loading.value = false;
                notifications.notify( {
                    'text': 'Failed to retrieve annotation sets from the backend',
                    'type': 'error',
                    'title': 'Annotation set listing'
                } );
            } );
    };

    /**
     * Use dummy data to populate files. Doesn't link to any actual files.
     */
    const useTestData = () => {
        loading.value = true;
        const list: AnnotationSet[] = testData.list;

        files.value = list!;
        notifications.notify( {
            'text': 'Populated file list using testing data for frontend dev.',
            'type': 'warn',
            'title': 'Loaded Testing Data'
        } );
        loading.value = false;
    };

    reloadFromServer();

    const fileSelect = ( selectedFile: AnnotationSet ) => {
        file.value = selectedFile;
        activeFile.setActiveFile( selectedFile );
    };

    const editFile = () => {
        if ( activeFile.fileSelected )
            router.push( '/app/editor' );
    };

    const exportFile = () => {
        if ( activeFile.fileSelected )
            startExport( {
                'image': true,
                'boundingBoxes': true,
                'localAnnotations': false,
                'annotations': true
            } );
    };
</script>

<template>
    <div class="app-home">
        <div class="app-home-main">
            <div>
                <FilePicker
                    class="file-picker"
                    :files="files"
                    :loading="loading"
                    :last-login="lastLogin"
                    @file-select="file => fileSelect( file )"
                    @reload-files="reloadFromServer"
                />
            </div>
            <div class="right">
                <UserCard class="user-card" :files="files" :last-login="lastLogin" />
                <PreviewProvider class="preview-provider" :file="file" />
                <div class="file-actions">
                    <button
                        :class="activeFile.fileSelected ? undefined : 'disabled' "
                        class="button primary has-icon edit-button"
                        @click="editFile()"
                    >
                        <i class="fa-lg fa-regular fa-pen-to-square"></i>
                        Edit
                    </button>
                    <button
                        :class="activeFile.fileSelected ? undefined : 'disabled' "
                        class="button primary has-icon"
                        @click="exportFile()"
                    >
                        <i class="fa-lg fa-solid fa-file-arrow-down"></i>
                        Export
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/scss/components/home-boxes.scss' as *;

.app-home {
    margin-top: 10vh;
    min-height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;

    >.app-home-main {
        display: grid;
        grid-template-areas: "left right";
        grid-template-columns: 1.25fr 1fr;

        >.left {
            grid-area: left;
        }

        >.right > .file-actions {
            @include home-boxes($pos: 'right');
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
            border-radius: 0px 0px 20px 20px;
            box-shadow: var(--theme-bg-1-shade) 10px 10px 10px;
            display: flex;
            align-items: center;

            >.edit-button {
                margin-right: 15px;
                width: 7rem;
            }
        }

        >.preview-provider {
            grid-area: right;
        }
    }
}
</style>
