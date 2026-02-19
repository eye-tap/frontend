import type { ShallowReadingSessionDto } from '@/types/dtos/ShallowReadingSessionDto';
import type { SurveyDto } from '@/types/dtos/SurveyDto';
import { defineStore } from 'pinia';

interface Text {
    'sessions': ShallowReadingSessionDto[];
    'id': number;
    'title': string;
    /**
     * Each element corresponds to an ID in the sessions
     */
    'selected': boolean[];
}

export type Mode = 'surveys' | 'surveys-create' | 'texts';

interface SurveyStore {
    'surveys': SurveyDto[],
    'selectedSurveyID': number,
    'links': string[],
    'texts': Text[],
    'selectedTextID': number,
    'panelMode': Mode
}

/**
 * Store for data displayed in the Admin Panel.
 */
export const useSurveyStore = defineStore('surveys', {
    'state': (): SurveyStore => ( {
        'surveys': [],
        'selectedSurveyID': -1,
        'links': [],
        'texts': [],
        'selectedTextID': -1,
        'panelMode': 'surveys'
    } ),

    'getters': {
        'getSurveys': state => state.surveys,
        'getSelectedID': state => state.selectedSurveyID,
        'getSelectedSurvey': state => state.surveys[state.selectedSurveyID],
        'getLinks': state => state.links,
        'getTexts': state => state.texts,
        'getSelectedTextID': state => state.selectedTextID,
        'getSelectedText': state => state.texts[state.selectedTextID]
    },

    'actions': {
        setSurveyID ( id: number ) {
            this.selectedSurveyID = id;
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
        setTextID ( id: number ) {
            this.selectedTextID = id;
        },
        setPanelMode ( mode: Mode ) {
            this.panelMode = mode;
        }
    }
})