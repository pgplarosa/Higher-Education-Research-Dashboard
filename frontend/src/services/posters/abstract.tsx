import { post } from '../http/post';
import { composeUrl, FEATURES, RESEARCH_FEATURES } from '../http/routes';

export const classifyAbstract = (abstract: string): Promise<any> => {
    return post(
        composeUrl(
            FEATURES.RESEARCH,
            RESEARCH_FEATURES.CUSTOM_ABSTRACT_CLASSIFICATION,
        ),
        { abstract },
    );
};
