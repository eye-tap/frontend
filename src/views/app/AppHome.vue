<script setup lang="ts">
    import {
        type Ref,
        ref
    } from 'vue';
    import FilePicker from '@/components/home/FilePicker.vue';
    import IncompatibleDeviceNotice from '@/components/IncompatibleDeviceNotice.vue';
    import PreviewProvider from '@/components/home/PreviewProvider.vue';
    import type {
        ShallowAnnotationSessionDto
    } from '@/types/dtos/ShallowAnnotationSessionDto';
    import UserCard from '@/components/home/UserCard.vue';
    import annotations from '@/ts/annotations';
    import router from '@/ts/router';
    import {
        startExport
    } from '@/ts/export';
    import testData from '@/ts/dev/ShallowAnotationSessionDtoTestData.json';
    import {
        useActiveFileStore
    } from '@/ts/stores/activeFileStore';
    import {
        useNotification
    } from '@kyvg/vue3-notification';
    import {
        useStatusStore
    } from '@/ts/stores/status';

    const session: Ref<ShallowAnnotationSessionDto> = ref( {
        'id': 0
    } );
    const activeFile = useActiveFileStore();
    const sessions: Ref<ShallowAnnotationSessionDto[]> = ref( [] );
    const loading = ref( true );
    const notifications = useNotification();
    const status = useStatusStore();

    const reloadFromServer = () => {
        if ( status.devMode ) return useTestData();

        loading.value = true;
        annotations.list()
            .then( list => {
                sessions.value = list;
                activeFile.setIds(
                    list.map(value => value.id!)
                )
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
        const list: ShallowAnnotationSessionDto[] = testData.list;

        sessions.value = list!;
        notifications.notify( {
            'text': 'Populated file list using testing data for frontend dev.',
            'type': 'warn',
            'title': 'Loaded Testing Data'
        } );
        loading.value = false;
    };

    reloadFromServer();

    const fileSelect = ( selectedFile: ShallowAnnotationSessionDto ) => {
        session.value = selectedFile;
        activeFile.setActive( activeFile.indexOf(selectedFile.id!) );
    };

    const editFile = () => {
        if ( activeFile.selected )
            router.push( '/app/editor' );
    };

    const exportFile = () => {
        if ( activeFile.selected )
            startExport( activeFile.sessionIds[ activeFile.sessionIdx ]! );
    };
</script>

<template>
    <div class="app-home">
        <div class="app-home-main">
            <div>
                <FilePicker
                    class="file-picker"
                    :files="sessions"
                    :loading="loading"
                    @file-select="file => fileSelect( file )"
                    @reload-files="reloadFromServer"
                />
            </div>
            <div class="right">
                <UserCard class="user-card" :files="sessions" />
                <PreviewProvider class="preview-provider" :session="session" />
                <div class="file-actions">
                    <button
                        :class="activeFile.selected ? undefined : 'disabled' "
                        class="button primary has-icon edit-button"
                        @click="editFile()"
                    >
                        <i class="fa-lg fa-regular fa-pen-to-square"></i>
                        Edit
                    </button>
                    <button
                        :class="activeFile.selected ? undefined : 'disabled' "
                        class="button primary has-icon"
                        @click="exportFile()"
                    >
                        <i class="fa-lg fa-solid fa-file-arrow-down"></i>
                        Export
                    </button>
                </div>
            </div>
        </div>
        <IncompatibleDeviceNotice />
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

  > .app-home-main {
    display: grid;
    grid-template-areas: "left right";
    grid-template-columns: 1.25fr 1fr;

    > .left {
      grid-area: left;
    }

    > .right > .file-actions {
      @include home-boxes($pos: 'right');
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
      border-radius: 0px 0px 20px 20px;
      box-shadow: var(--theme-bg-1-shade) 10px 10px 10px;
      display: flex;
      align-items: center;

      > .edit-button {
        margin-right: 15px;
        width: 7rem;
      }
    }

    > .preview-provider {
      grid-area: right;
    }
  }
}
</style>
