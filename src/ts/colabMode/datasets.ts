import {
    type Ref,
    onMounted,
    ref
} from 'vue';
import type {
    ReadingSessionProgressDto
} from '@/types/dtos/ReadingSessionProgressDto';
import type {
    ShallowSurveyDto
} from '@/types/dtos/ShallowSurveyDto';
import type {
    SurveyDetails
} from '@/types/sessionDetails';
import {
    preprocessProgress
} from '../stats/loader';
import request from '../util/request';
import {
    useAnnotationSessionStore
} from '../stores/annotationSessionStore';
import {
    useNotification
} from '@kyvg/vue3-notification';
import {
    useStatusStore
} from '../stores/status';

export const useDatasets = () => {
    const datasets: Ref<SurveyDetails[]> = ref( [] );
    const store = useAnnotationSessionStore();
    const status = useStatusStore();
    const selected: Ref<ShallowSurveyDto> = ref( {
        'id': 1
    } );
    const loading = ref( false );
    const notifications = useNotification();

    const load = async () => {
        if ( status.devMode )
            return useTestData();

        loading.value = true;

        try {
            const data = JSON.parse( await request.get( '/survey/public' ) ) as ShallowSurveyDto[];
            const datasets: SurveyDetails[] = [];

            for ( let i = 0; i < data.length; i++ ) {
                const el = data[i]!;

                datasets.push( {
                    'description': el.description,
                    'id': el.id,
                    'title': el.title,
                    'surveyProgress': {
                        'sessions': el.surveyProgressDto ? processProgress( el.surveyProgressDto.progress as Record<string, ReadingSessionProgressDto> | undefined ) : undefined,
                        'statistics': el.surveyProgressDto?.statisticsDto
                    }
                } );
            }
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

    const processProgress = ( data?: Record<string, ReadingSessionProgressDto> ) => {
        if ( !data ) return undefined;

        try {
            preprocessProgress( data );
        } catch {
            return undefined;
        }
    };

    const useTestData = () => {
        datasets.value = [ {
            'description': 'Survey desc',
            'id': 1,
            'surveyProgress': {
                'sessions': [ {
                    'annotators': 5,
                    'averageAnnPerFix': 0.5,
                    'reader': 5,
                    'sortDescriptor': 10005,
                    'text': 'Text_1_en'
                } ],
                'statistics': {
                    'numberOfAnnotations': 2365,
                    'numberOfFixations': 13765,
                    'progressUntilEverythingIsAnnotatedOnce': 0.1,
                    'numberOfTexts': 3,
                    'numberOfSurveys': 1,
                    'numberOfReadingSessions': 10,
                    'numberOfUniqueAnnotators': 5
                }
            },
            'title': 'Test Survey'
        } ];
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
