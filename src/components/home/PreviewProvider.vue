<script setup lang="ts">
    import {
        type Ref,
        onMounted,
        ref,
        watch
    } from 'vue';
    import type {
        AnnotationSet
    } from '@/types/files';
    import {
        downloadFileAsBlob
    } from '@/ts/files/file';
    import {
        formatDate
    } from '@/ts/util/date';
    import {
        useActiveFileStore
    } from '@/ts/stores/activeFileStore';

    const props = defineProps<{
        'file': AnnotationSet
    }>();
    const imageURL: Ref<string> = ref( '/assets/favicon-logo.jpg' );
    const activeFile = useActiveFileStore();

    watch( props, () => {
        getImage();
    } );

    const getImage = async () => {
        if ( !props.file.files[ 'text_image' ] ) return;

        try {
            const imgBlob = await downloadFileAsBlob( props.file.files[ 'text_image' ]!.id );

            if ( !imgBlob ) return;

            imageURL.value = URL.createObjectURL( imgBlob );
        } catch ( e ) {
            imageURL.value = '/assets/favicon-logo.jpg';

            console.error( 'failed to load image with error', e );
        }
    };

    onMounted( () => {
        getImage();
    } );
</script>

<template>
    <div class="preview-provider">
        <span :style="`background-color: white; background-image: url('${ imageURL ? imageURL : '' }');`" alt="Preview of text"></span>
        <h1 v-if="activeFile.fileSelected">
            {{ $props.file.baseName }}
        </h1>
        <h1 v-else>
            No file selected
        </h1>

        <table v-if="activeFile.fileSelected">
            <tbody>
                <tr>
                    <td>
                        <p class="title">
                            Uploaded on
                        </p>
                        <p class="content">
                            {{ $props.file.progress ? formatDate( new Date( $props.file.progress.uploaded ) ) : 'N/A' }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Word count
                        </p>
                        <p class="content">
                            {{ $props.file.progress ? $props.file.progress.wordCount : 'N/A' }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Gaze points
                        </p>
                        <p class="content">
                            {{ $props.file.progress ? $props.file.progress.gazePoints : 'N/A' }}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="title">
                            Last modified on
                        </p>
                        <p class="content">
                            {{ $props.file.progress ? formatDate( new Date( $props.file.progress.modified ) ) : 'N/A' }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Assigned
                        </p>
                        <p class="content">
                            {{ $props.file.progress ? $props.file.progress.assigned : 'N/A' }}
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
                            {{ $props.file.progress ? $props.file.progress.gazePoints - $props.file.progress.assigned : 'N/A' }}
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
    padding-top: 3rem;
    border-radius: 20px 20px 0px 0px;
    box-shadow: var(--theme-bg-1-shade) 10px 10px 10px;

    >div {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background-color: var(--theme-bg-1);
        >p {
            color: var(--theme-background-text-20);
        }
    }

    >span {
        width: 100%;
        display: block;
        aspect-ratio: 16 / 9;
        background-position: center;
        background-size: cover;
    }

    >table {
        margin-top: 20px;
        width: 100%;
        background-color: var( --theme-bg-1 );
        padding: 15px;
        display: flex;
        flex-direction: column;

        > tbody > tr > td {
            width: 100%;
            >p {
                padding: 0;
                padding-left: 3px;
                padding-right: 2px;
                margin: 0;
                width: max-content;

                &.title {
                    color: var( --theme-background-text-20 );
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
