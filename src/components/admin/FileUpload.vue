<script setup lang="ts">
    import {
        InvalidIndexNameError,
        MultipleTextIDsWithoutSpecifiedTextIDError
    } from '@/ts/dataImport/parsers/errors';
    import {
        type Ref,
        computed,
        ref
    } from 'vue';
    import AdvancedFileUploadOptions from './AdvancedFileUploadOptions.vue';
    import {
        importDatasetFromCSV
    } from '@/ts/dataImport';
    import {
        useNotification
    } from '@kyvg/vue3-notification';


    const baseName = ref( '' );
    const boundingBoxesInput: Ref<HTMLInputElement | null> = ref( null );
    const fixationsInput: Ref<HTMLInputElement | null> = ref( null );
    const imageInput: Ref<HTMLInputElement | null> = ref( null );
    const index = ref( 0 );
    const textID = ref( '' );
    const showError = ref( false );
    const errorMessage = ref( '' );
    const notifications = useNotification();
    const inputsValid = computed( () => {
        const bb = !!boundingBoxesInput.value && boundingBoxesInput.value.files && boundingBoxesInput.value.files.length !== 0;
        const gp = !!fixationsInput.value && fixationsInput.value.files && fixationsInput.value.files.length !== 0;
        const img = !!imageInput.value && imageInput.value.files && imageInput.value.files.length !== 0;
        const test = index.value * 2;

        return bb && gp && img && textID.value !== '' && test >= 0;
    } );
    const showOpts = ref( false );
    const uploading = ref( false );

    const toggleOpts = () => {
        showOpts.value = !showOpts.value;
    };

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
            || !imageInput.value || !imageInput.value.files || !textID.value ) {
            displayError( 'Some files are missing.' );

            return;
        }

        uploading.value = true;

        try {
            await importDatasetFromCSV( boundingBoxesInput.value, fixationsInput.value, imageInput.value, textID.value, baseName.value );
        } catch ( error ) {
            console.log( 'error caught in caller' );

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
            else console.log( error );

            return;
        }

        notifications.notify( {
            'text': 'Created Annotation Set',
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
</script>

<template>
    <div class="file-upload">
        <div class="file-upload-bar">
            <div>
                <i class="fa-xl fa-solid fa-file"></i>
                <p>Upload Annotation Set</p>
            </div>
            <span class="clickable-icon" @click="toggleOpts()">
                <i class="fa-lg fa-solid fa-gear"></i>
            </span>
        </div>

        <div class="file-upload-container">
            <p>Metadata</p>

            <label class="metadata">
                <input v-model="baseName" placeholder="Set Name" type="text">
                <input
                    v-model="textID"
                    placeholder="Text ID"
                    type="text"
                    class="short"
                >
            </label>

            <p>Files</p>

            <label>
                <span>Bounding boxes</span>
                <input
                    ref="boundingBoxesInput"
                    type="file"
                    accept="text/csv"
                    @change="fileLoadTrigger"
                >
            </label>

            <label>
                <span>Gaze points</span>
                <input
                    ref="fixationsInput"
                    type="file"
                    accept="text/csv"
                    @change="fileLoadTrigger"
                >
            </label>

            <label>
                <span>Text image</span>
                <input
                    ref="imageInput"
                    type="file"
                    accept="image/*"
                    @change="fileLoadTrigger"
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
                Create annotation set
                <div v-if="uploading">
                    <i class="fa-solid fa-lg fa-arrows-rotate"></i>
                </div>
            </button>

            <p :class="showError ? 'show' : undefined"> {{ errorMessage }}</p>
        </label>
        <AdvancedFileUploadOptions v-model="showOpts" />
    </div>
</template>

<style lang="scss" scoped>
.file-upload {
    margin-top: 2rem;
    margin-right: 2rem;
    margin-left: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 1rem;
    background-color: var(--theme-bg-2);
    border-radius: 20px;

    .file-upload-bar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-left: 2rem;
        margin-right: 2rem;

        >div {
            display: flex;
            align-items: center;
            justify-content: center;
            >p {
                font-size: 1.25rem;
                margin-left: 1rem;
            }
        }

        >span {
            color: var(--theme-bg-4);
            cursor: pointer;

            >i {
                transition: rotate 0.1s;
            }
            >i:hover {
                rotate: 45deg;
                color: var(--theme-bg-4-20);
            }
        }
    }

    .file-upload-container {
        display: flex;
        justify-content: center;
        align-items: stretch;
        flex-direction: column;
        margin-right: 2rem;
        margin-left: 2rem;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-bottom: 1rem;
        background-color: var(--theme-bg-1); 

         >p {
            color: var(--theme-background-text);
            margin: 0px;
            margin-bottom: 15px;
            margin-top: 15px;
            font-size: 0.8rem;
        }

        >label {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            margin-left: 1rem;
            cursor: pointer;

            &.metadata {
                justify-content: left;
            }

            >span {
                color: var(--theme-background-text-20);
            }

            >input[type=text] {
                all: unset;
                background-color: var(--theme-bg-3);
                width: 12.5rem;
                padding: 5px;
                padding-left: 10px;
                margin-right: 1rem;
                border-style: none;
                cursor: pointer;
                &.short {
                    width: 6rem;
                }
            }

            >input[type=file] {
                all: unset;
                width: 13rem;
                font-size: small;
                color: var(--theme-background-text-20);

                &::file-selector-button {
                    text-decoration: none;
                    color: var(--theme-foreground-text);
                    background-color: var(--theme-bg-4);
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-left: 20px;
                    padding-right: 20px;
                    font-size: 1rem;
                    cursor: pointer;
                    border: none;
                    border-radius: 10px;
                    transition: background-color, 0.2s;
                    transition: color, 0.2s;

                    &:hover {
                        background-color: var(--theme-bg-4-20);
                    }
                }
            }
        }
    }

    .submit-label {
        margin: 1rem;
        margin-left: 2rem;
        display: flex;
        justify-content: left;

        >button {
            width: 275px;
            padding-left: 0px;
            padding-right: 0px;
        }

        .show {
            display: block;
        }

        >p {
            display: none;
            margin-left: 2rem;
            margin-top: 0px;
            margin-bottom: 0px;
            color: var(--theme-warning);
        }
    }
}
</style>
