import {
    type Ref,
    onMounted,
    ref
} from 'vue';
import type {
    ShallowSurveyDto
} from '@/types/dtos/ShallowSurveyDto';
import request from '../util/request';
import {
    useAnnotationSessionStore
} from '../stores/annotationSessionStore';
import {
    useNotification
} from '@kyvg/vue3-notification';

export const useDatasets = () => {
    const datasets: Ref<ShallowSurveyDto[]> = ref( [] );
    const store = useAnnotationSessionStore();
    const selected: Ref<ShallowSurveyDto> = ref( {
        'id': 1
    } );
    const loading = ref( false );
    const notifications = useNotification();

    const load = async () => {
        loading.value = true;

        try {
            datasets.value = JSON.parse( await request.get( '/survey/public' ) ) as ShallowSurveyDto[];
        } catch ( error ) {
            console.error( error );
            notifications.notify( {
                'text': 'Failed to retrieve datasets from the backend',
                'type': 'error',
                'title': 'Dataset listing'
            } );
        }

        loading.value = false;
    };

    const select = ( survey: ShallowSurveyDto ) => {
        selected.value = survey;
        store.surveyId = survey.id!;
    };

    onMounted( () => {
        load();
    } );

    return {
        load,
        datasets,
        select
    };
};
