<script setup lang="ts">
    import {
        ImportError,
        importDatasetFromCSV
    } from '@/ts/dataImport';
    import {
        InvalidIndexNameError,
        MissingFilesError,
        MultipleTextIDsWithoutSpecifiedTextIDError
    } from '@/ts/dataImport/util/errors';
    import {
        type Ref,
        computed,
        ref
    } from 'vue';
    import {
        adminBaseRoute
    } from '../adminConfig';
    import router from '@/ts/router';
    import {
        useNotification
    } from '@kyvg/vue3-notification';
    import {
        useStatusStore
    } from '@/ts/stores/status';


    const baseName = ref( '' );
    const boundingBoxesInput: Ref<HTMLInputElement | null> = ref( null );
    const fixationsInput: Ref<HTMLInputElement | null> = ref( null );
    const imageInput: Ref<HTMLInputElement | null> = ref( null );
    const annotationsInput: Ref<HTMLInputElement | null> = ref( null );
    const index = ref( 0 );
    const textID = ref( '' );
    const showError = ref( false );
    const errorMessage = ref( '' );
    const notifications = useNotification();
    const status = useStatusStore();
    const inputsValid = computed( () => {
        const bb = !!boundingBoxesInput.value && boundingBoxesInput.value.files && boundingBoxesInput.value.files.length !== 0;
        const gp = !!fixationsInput.value && fixationsInput.value.files && fixationsInput.value.files.length !== 0;
        const img = !!imageInput.value && imageInput.value.files && imageInput.value.files.length !== 0;
        const test = index.value * 2;

        return bb && gp && img && textID.value !== '' && test >= 0;
    } );
    const uploading = ref( false );

    const displayError = ( msg: string ) => {
        showError.value = true;
        errorMessage.value = msg;
    };

    const submit = async () => {
        if ( !inputsValid.value || baseName.value === '' ) return;

        if ( !baseName.value ) {
            displayError( 'Please set a name.' );

            return;
        }

        if ( !textID.value ) {
            displayError( 'Specify a text ID.' );

            return;
        }

        if ( !boundingBoxesInput.value || !boundingBoxesInput.value.files
            || !fixationsInput.value || !fixationsInput.value.files
            || !imageInput.value || !imageInput.value.files || !textID.value
            || !annotationsInput.value ) {
            displayError( 'Some files are missing.' );

            return;
        }

        uploading.value = true;

        try {
            await importDatasetFromCSV(
                boundingBoxesInput.value,
                fixationsInput.value,
                annotationsInput.value,
                imageInput.value,
                textID.value,
                baseName.value
            );
        } catch ( error ) {
            if ( status.devMode )
                console.error( error );

            if ( error instanceof InvalidIndexNameError )
                notifications.notify( {
                    'text': `CSV Column name for ${ error.message } is invalid`,
                    'type': 'error',
                    'title': 'File Upload'
                } );
            else if ( error instanceof MultipleTextIDsWithoutSpecifiedTextIDError )
                notifications.notify( {
                    'text': 'No Text ID specified, but multiple text IDs in given data',
                    'type': 'error',
                    'title': 'File Upload'
                } );
            else if ( error instanceof ImportError )
                notifications.notify( {
                    'text': `Import failed with error "${ error.message }"`,
                    'type': 'error',
                    'title': 'File Upload'
                } );
            else if ( error instanceof MissingFilesError )
                notifications.notify( {
                    'text': 'A required file was not uploaded',
                    'type': 'error',
                    'title': 'File Upload'
                } );
            else {
                console.error( error );
                notifications.notify( {
                    'text': 'An unknown error occurred. See console for more information',
                    'type': 'error',
                    'title': 'File Upload'
                } );
            }

            uploading.value = false;

            return;
        }

        notifications.notify( {
            'text': 'Text uploaded',
            'type': 'success',
            'title': 'File Upload'
        } );

        textID.value = '';
        baseName.value = '';
        boundingBoxesInput.value.value = '';
        fixationsInput.value.value = '';
        imageInput.value.value = '';
        uploading.value = false;
    };

    const fileLoadTrigger = () => {
        index.value++;
    };

    const goToOptions = () => {
        router.push( adminBaseRoute + 'texts-options' );
    };

    const annotationsLoadTrigger = () => {
        // TODO import
        notifications.notify( {
            'text': 'Machine generated annotations successfuly imported.',
            'type': 'success',
            'title': 'Annotations imported'
        } );
    };
</script>

<template>
    <div class="content">
        <div class="top-bar">
            <h2 class="title">
                Upload new Text
            </h2>
        </div>

        <div class="file-upload-container">
            <p class="subtitle">
                METADATA
            </p>

            <label class="metadata">
                <input
                    v-model="baseName"
                    placeholder="Set Name"
                    type="text"
                >
            </label>
            <label class="metadata">
                <input
                    v-model="textID"
                    placeholder="Text ID"
                    type="text"
                >
            </label>

            <p class="subtitle">
                FILES
            </p>

            <label class="file-upload">
                <span>Bounding boxes</span>
                <input
                    ref="boundingBoxesInput"
                    type="file"
                    accept="text/csv"
                    @change="fileLoadTrigger"
                >
            </label>

            <label class="file-upload">
                <span>Fixations</span>
                <input
                    ref="fixationsInput"
                    type="file"
                    accept="text/csv"
                    @change="fileLoadTrigger"
                >
            </label>

            <label class="file-upload">
                <span>Text image</span>
                <input
                    ref="imageInput"
                    type="file"
                    accept="image/*"
                    @change="fileLoadTrigger"
                >
            </label>

            <p class="subtitle">
                OPTIONAL
            </p>

            <label class="file-upload">
                <span>Annotations</span>
                <input
                    ref="annotationsInput"
                    type="file"
                    accept="text/csv"
                    multiple
                    @change="annotationsLoadTrigger"
                >
            </label>
        </div>

        <label class="submit-label">
            <button
                class="button primary long-action"
                :class="!inputsValid || baseName === '' ? 'disabled' : undefined"
                @click="submit"
            >
                <i class="fa-solid fa-file-arrow-up"></i>
                Upload Text
                <div v-if="uploading">
                    <i class="fa-solid fa-lg fa-arrows-rotate"></i>
                </div>
            </button>

            <p :class="showError ? 'show' : undefined"> {{ errorMessage }}</p>
        </label>
    </div>
</template>

<style scoped lang="scss">
@use '@/scss/admin/general';
@use '@/scss/admin/top-bar';

.content {
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );

    height: 85vh;

    padding-right: 1rem;
    margin-right: 2rem;

    border-style: solid;
    border-color: var(--theme-bg-3-shade);
    border-width: 0px 2px 0px 0px;

    .bar-buttons {
        width: 50px;
    }

    label>button {
        margin-left: 1rem;
        margin-top: 1rem;
    }

    .file-upload-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;

        >label {
            margin-left: 1rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            >input {
                margin-left: 0px;
                margin-right: 1rem;
            }

            >span {
                font-size: 0.85rem;
                font-weight: 500;
                color: var(--theme-background-text-20);
            }

            &.metadata {
                justify-content: left;
            }

            &.file-upload {
                width: 400px;
                margin-bottom: 1rem;
            }
        }
    }
}
</style>
