import type { Mode } from '@/ts/stores/admin';

type SidebarOption = {
    'text': string,
    'mode': Mode,
    'id': number
};

type sidebarSection = {
    'name': string,
    'content': Array<SidebarOption>
};

/**
 * Populates the admin sidebar. IDs should be unique.
 */
export const content: Array<sidebarSection> = [
    {
        'name': 'surveys',
        'content': [
            {
                'text': 'View Survey',
                'mode': 'surveys',
                'id': 0
            },
            {
                'text': 'Create Survey',
                'mode': 'surveys-create',
                'id': 1
            }
        ]
    },
    {
        'name': 'texts',
        'content': [
            {
                'text': 'View Texts',
                'mode': 'texts',
                'id': 2
            }
        ]
    }
];