import type {
    CreateSurveyDto
} from '@/types/dtos/CreateSurveyDto';
import type {
    ShallowReadingSessionDto
} from '@/types/dtos/ShallowReadingSessionDto';
import type {
    SurveyCreatedDto
} from '@/types/dtos/SurveyCreatedDto';
import type {
    SurveyDto
} from '@/types/dtos/SurveyDto';
import magicLinks from '../auth/magic-links';
import request from '../util/request';


export const listReadingSessions = async (): Promise<ShallowReadingSessionDto[]> => {
    return await (await request.getRequest('/reading-session')).json() as ShallowReadingSessionDto[];
};

export const listSurveys = async (): Promise<SurveyDto[]> => {
    return await (await request.getRequest('/survey')).json() as SurveyDto[];
};

export const createSurvey = async (
    userCount: number,
    title: string,
    description: string,
    readingSessionIds: number[]
): Promise<string[]> => {
    const config: CreateSurveyDto = {
        'users': userCount,
        'title': title,
        'description': description,
        'readingSessionIds': readingSessionIds
    };
    const surveyUsers = (await (await request.post('/survey', config)).json() as SurveyCreatedDto).users!;
    const links: string[] = [];

    for (const username in surveyUsers) {
        links.push(magicLinks.generate(username, surveyUsers[username] as string));
    }

    return links;
};

export const deleteSurvey = async (
    id: number
): Promise<boolean> => {
    return (await request.deleteRequest('/survey/' + id)).status === 200;
};

export const exportSurvey = async (id: number): Promise<boolean> => {
    try {
        const response = await request.getRequest('/export/survey/' + id);

        const blob = await response.blob();
        const link = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = link;
        a.download = 'survey' + id + '.csv';
        a.click();

        URL.revokeObjectURL(link);

        return true;

    } catch (e) {
        console.log(e)
        return false;
    }
};
