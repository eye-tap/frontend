<script setup lang="ts">
    import {
        formatDate,
        formatDateTime
    } from '@/ts/util/date';
    import type {
        ShallowAnnotationSessionDto
    } from '@/types/dtos/ShallowAnnotationSessionDto';
    import {
        useAnnotationSessionStore
    } from '@/ts/stores/annotationSessionStore';

    const props = defineProps<{
        'session': ShallowAnnotationSessionDto
    }>();
    const annotationSessionStore = useAnnotationSessionStore();
</script>

<template>
    <div class="preview-provider">
        <table v-if="annotationSessionStore.selected">
            <tbody>
                <tr>
                    <td>
                        <p class="title">
                            Uploaded on
                        </p>
                        <p class="content">
                            {{ props.session.readingSession?.uploadedAt
                                ? formatDate(new Date($props.session.readingSession?.uploadedAt!)) : 'N/A' }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Word count
                        </p>
                        <p class="content">
                            {{ 'N/A' }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Fixations
                        </p>
                        <p class="content">
                            {{ props.session.annotationsMetaData?.total ? props.session.annotationsMetaData.total : 'N/A' }}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="title">
                            Last modified on
                        </p>
                        <p class="content">
                            {{ $props.session.lastEdited ? formatDateTime(new Date($props.session.lastEdited)) : 'N/A' }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Assigned
                        </p>
                        <p class="content">
                            {{ props.session.annotationsMetaData ? $props.session.annotationsMetaData?.done : 'N/A' }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Unassigned
                        </p>
                        <!-- TODO: Set color class depending on value. (success on 0, warning > 0) -->
                        <!-- Using v-if on props currently crashes after reload -->
                        <p
                            class="content information"
                        >
                            {{ $props.session.annotationsMetaData
                                ? $props.session.annotationsMetaData.total! - $props.session.annotationsMetaData.done! : 'N/A' }}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else>
            <p> Please select a file </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/scss/components/home-boxes.scss' as *;

.preview-provider {
  @include home-boxes($pos: 'right');
  box-shadow: var(--theme-bg-1-shade) 10px 10px 10px;
  padding-top: 2rem;
  padding-bottom: 2rem;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: var(--theme-bg-1);

    > p {
      color: var(--theme-background-text-20);
    }
  }

  > span {
    width: 100%;
    display: block;
    aspect-ratio: 16 / 9;
    background-position: center;
    background-size: cover;
  }

  > table {
    width: 100%;
    background-color: var(--theme-bg-1);
    padding: 15px;
    display: flex;
    flex-direction: column;

    > tbody > tr > td {
      width: 100%;

      > p {
        padding: 0;
        padding-left: 3px;
        padding-right: 2px;
        margin: 0;
        width: max-content;

        &.title {
          color: var(--theme-background-text-20);
          font-size: 0.8rem;
          padding-bottom: 5px;
        }

        &.content {
          font-size: 1.25rem;
        }

        &.warning {
          color: var(--theme-warning);
        }

        &.information {
          color: var(--theme-information);
        }

        &.successs {
          color: var(--theme-success);
        }
      }
    }
  }
}
</style>
