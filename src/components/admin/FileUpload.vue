<script setup lang="ts">
    import {
        type Ref,
        computed,
        ref
    } from 'vue';
    import {
        convertAnnotationsToCSV,
        convertBoundingBoxesToCSV
    } from '@/ts/files/annotationSave.ts';
    import {
        createAnnotationSet, uploadFile
    } from '@/ts/files/file';
    import {
        loadBoundingBoxes,
        loadGazePoints
    } from '@/ts/files/import.ts';
    import {
        loadFileFromDisk
    } from '@/ts/util/loadFileFromDisk';
    import {
        useNotification
    } from '@kyvg/vue3-notification';


    const baseName = ref( '' );
    const boundingBoxesInput: Ref<HTMLInputElement | null> = ref( null );
    const gazePointsInput: Ref<HTMLInputElement | null> = ref( null );
    const imageInput: Ref<HTMLInputElement | null> = ref( null );
    const index = ref( 0 );
    const textID = ref( null );
    const showError = ref( false );
    const errorMessage = ref( '' );
    const notifications = useNotification();
    const inputsValid = computed( () => {
        const bb = !!boundingBoxesInput.value && boundingBoxesInput.value.files && boundingBoxesInput.value.files.length !== 0;
        const gp = !!gazePointsInput.value && gazePointsInput.value.files && gazePointsInput.value.files.length !== 0;
        const img = !!imageInput.value && imageInput.value.files && imageInput.value.files.length !== 0;
        const test = index.value * 2;

        return bb && gp && img && textID.value !== null && test >= 0;
    } );


    const displayError = ( msg: string ) => {
        showError.value = true;
        errorMessage.value = msg;
    };

    // TODO: Make parsers more flexible
    const submit = async () => {
        if ( !baseName.value ) {
            displayError( 'Please set a name.' );

            return;
        }

        if ( !textID.value ) {
            displayError( 'Specify a text ID.' );

            return;
        }

        if ( !boundingBoxesInput.value || !boundingBoxesInput.value.files
            || !gazePointsInput.value || !gazePointsInput.value.files
            || !imageInput.value || !imageInput.value.files || !textID.value ) {
            displayError( 'Some files are missing.' );

            return;
        }

        const gazePointContent = await loadFileFromDisk( gazePointsInput.value );
        const loadedGazePoints = loadGazePoints( gazePointContent, Number( textID.value ) );
        const boundingBoxesContent = await loadFileFromDisk( boundingBoxesInput.value );
        const boxDetails = loadBoundingBoxes( boundingBoxesContent!, Number( textID.value ) );
        const annotationSet = await createAnnotationSet( baseName.value, boxDetails.wordCount, loadedGazePoints.gazePointCount );

        if ( !annotationSet ) return;

        if ( !annotationSet ) return;

        const id = annotationSet.id;

        await uploadFile( imageInput.value.files[ 0 ]!, id, 'text_image' );

        // Upload Bounding Boxes
        const bbFile = convertBoundingBoxesToCSV( boxDetails.boxes );
        const boundingBoxesFile = new File( [ bbFile ], 'boundinboxes.csv', {
            'type': 'text/csv'
        } );

        await uploadFile( boundingBoxesFile, id, 'bounding_boxes' );

        // Upload Gaze points
        const fileContent = convertAnnotationsToCSV( loadedGazePoints.points );
        const file = new File( [ fileContent ], 'annotations.csv', {
            'type': 'text/csv'
        } );

        await uploadFile( file, id, 'gaze_points' );

        console.log( 'Created annotationSet', id );

        notifications.notify( {
            'text': 'Created Annotation Set with ID ' + id,
            'type': 'success',
            'title': 'Annotation set creation'
        } );

        textID.value = null;
        baseName.value = '';
        boundingBoxesInput.value.value = '';
        gazePointsInput.value.value = '';
        imageInput.value.value = '';
    };

    const fileLoadTrigger = () => {
        index.value++;
    };
</script>

<template>
    <div class="file-upload">
        <p>Metadata</p>

        <label class="metadata">
            <input v-model="baseName" placeholder="Annotation set name" type="text">
            <input
                v-model.number="textID"
                placeholder="Text ID in file"
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
                ref="gazePointsInput"
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

        <label class="submit-label">
            <button
                class="button primary"
                :class="!inputsValid || baseName === '' ? 'disabled' : undefined"
                @click="submit"
            >
                <i class="fa-solid fa-file-arrow-up"></i>
                Create annotation set
            </button>

            <p :class="showError ? 'show' : undefined"> {{ errorMessage }}</p>
        </label>
    </div>
</template>

<style lang="scss" scoped>
.file-upload {
    display: flex;
    justify-content: center;
    align-items: stretch;
    flex-direction: column;
    margin-top: 2rem;
    margin-right: 2rem;
    margin-left: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 1rem;
    background-color: var(--theme-bg-1);

    .submit-label {
        margin-top: 2rem;
        margin-left: 0px;
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
</style>
