import {
    type Ref,
    onMounted,
    ref
} from 'vue';
import request from '../util/request';
import {
    useAnnotationSessionStore
} from '../stores/annotationSessionStore';

export const useDatasets = () => {
    const datasets: Ref<object> = ref( {} );
    const store = useAnnotationSessionStore();

    const loadDatasets = async () => {
        datasets.value = JSON.parse( await request.get( '/annotation/session' ) ) as object[];
    };

    const selectDataset = ( id: number ) => {
        store.surveyId = id;
    };

    onMounted( () => {
        loadDatasets();
    } );

    return {
        loadDatasets,
        datasets,
        selectDataset
    };
};
