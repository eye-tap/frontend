<script setup lang="ts">
    import FilePicker from '@/components/home/FilePicker.vue';
    import IncompatibleDeviceNotice from '@/components/IncompatibleDeviceNotice.vue';
    import PreviewProvider from '@/components/home/PreviewProvider.vue';
    import UserCard from '@/components/home/UserCard.vue';
    import {
        useAnnotationSessionManager
    } from '@/ts/annotations/manager';
    import {
        useAnnotationSessionStore
    } from '@/ts/stores/annotationSessionStore';

    const store = useAnnotationSessionStore();
    const manager = useAnnotationSessionManager( false );
    const sessions = manager.sessions;
    const mostRecentlyEditedIdx = manager.mostRecentlyEditedIdx;
    const loading = manager.loading;
    const session = manager.selected;
</script>

<template>
    <div class="app-home">
        <div class="app-home-main">
            <div>
                <FilePicker
                    class="file-picker"
                    :files="sessions"
                    :loading="loading"
                    :most-recently-edited="mostRecentlyEditedIdx"
                    @file-select="file => manager.select( file )"
                    @reload-files="manager.load"
                />
            </div>
            <div class="right">
                <UserCard class="user-card" />
                <PreviewProvider class="preview-provider" :session="session" />
                <div class="file-actions">
                    <button
                        :class="store.selected ? undefined : 'disabled' "
                        class="button primary has-icon edit-button"
                        @click="manager.edit()"
                    >
                        <i class="fa-lg fa-regular fa-pen-to-square"></i>
                        Edit
                    </button>
                    <!-- TODO: Improve design -->
                    <button
                        class="button has-icon"
                        @click="manager.openRecent()"
                    >
                        <i class="fa-lg fa-regular fa-pen-to-square"></i>
                        Open Recent
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
