import type {
    ProgressDto
} from '@/types/dtos/ProgressDto';
import {
    backend
} from '../util/url';

export const getStats = async (): Promise<ProgressDto> => {
    const res = await fetch( backend.url + '/progress' );

    return await res.json();
};
