import type {
    ShallowReadingSessionDto
} from '@/types/dtos/ShallowReadingSessionDto';
import type {
    SurveyDto
} from '@/types/dtos/SurveyDto';
import {
    defineStore
} from 'pinia';

interface Text {
    'sessions': ShallowReadingSessionDto[];
    'id': number;
    'title': string;
    /**
     * Each element corresponds to an ID in the sessions
     */
    'selected': boolean[];
}

interface SurveyStore {
    'surveys': SurveyDto[],
    'selectedSurveyIndex': number,
    'links': string[],
    'texts': Text[],
    'selectedTextIndex': number,
}

/**
 * Store for data displayed in the Admin Panel.
 * -1 indicates that nothing is selected, can also be used as fallback for invalid values.
 */
export const useSurveyStore = defineStore( 'surveys', {
    'state': (): SurveyStore => ( {
        'surveys': [],
        'selectedSurveyIndex': -1,
        'links': [],
        'texts': [],
        'selectedTextIndex': -1
    } ),

    'getters': {
        'getSurveys': state => state.surveys,
        'getSelectedIndex': state => state.selectedSurveyIndex,
        'getSelectedSurveyID': state => state.surveys[state.selectedSurveyIndex]?.id,
        'getSelectedSurvey': state => state.surveys[state.selectedSurveyIndex],
        'getLinks': state => state.links,
        'getTexts': state => state.texts,
        'getSelectedTextIndex': state => state.selectedTextIndex,
        'getSelectedText': state => state.texts[state.selectedTextIndex]
    },

    'actions': {
        setSurveyIndex ( index: number ) {
            this.selectedSurveyIndex = index;
        },
        setSurveys ( surveys: SurveyDto[] ) {
            this.surveys = surveys;
        },
        setLinks ( links: string[] ) {
            this.links = links;
        },
        setTexts ( texts: Text[] ) {
            this.texts = texts;
        },
        setTextIndex ( index: number ) {
            this.selectedTextIndex = index;
        },
        findSurveyIndex ( id: number ) {
            for ( let i = 0; i < this.surveys.length; i++ )
                if ( this.surveys[i]?.id === id )
                    return i;

            return -1;
        },
        setSurveyIndexById ( id: number ) {
            this.setSurveyIndex( this.findSurveyIndex( id ) );
        },
        unselectSurvey () {
            this.selectedSurveyIndex = -1;
        }
    }
} );