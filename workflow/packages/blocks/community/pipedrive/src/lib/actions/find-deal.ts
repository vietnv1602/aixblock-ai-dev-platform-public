import { HttpMethod } from 'workflow-blocks-common';
import { createAction } from 'workflow-blocks-framework';
import { isNil } from 'workflow-shared';
import { pipedriveAuth } from '../../index';
import {
    pipedriveApiCall,
    pipedrivePaginatedApiCall,
    pipedriveTransformCustomFields,
} from '../common';
import { searchFieldProp, searchFieldValueProp } from '../common/props';
import { GetField } from '../common/types';

export const findDealAction = createAction({
    auth: pipedriveAuth,
    name: 'find-deal',
    displayName: 'Find Deal',
    description: 'Finds a deal by any field.',
    props: {
        searchField: searchFieldProp('deal'),
        searchFieldValue: searchFieldValueProp('deal'),
    },
    async run(context) {
        const { searchField } = context.propsValue;
        const fieldValue = context.propsValue.searchFieldValue['field_value'];

        if (isNil(fieldValue)) {
            throw new Error('Please enter a value for the field');
        }

        // create Filter
        const filter = await pipedriveApiCall<{ data: { id: number } }>({
            accessToken: context.auth.access_token,
            apiDomain: context.auth.data['api_domain'],
            method: HttpMethod.POST,
            resourceUri: '/filters',
            body: {
                name: 'Activepieces Find Deal Filter',
                type: 'deals',
                conditions: {
                    glue: 'and',
                    conditions: [
                        {
                            glue: 'and',
                            conditions: [
                                {
                                    object: 'deal',
                                    field_id: searchField,
                                    operator: '=',
                                    value: fieldValue,
                                },
                            ],
                        },
                        {
                            glue: 'or',
                            conditions: [
                                {
                                    object: 'deal',
                                    field_id: searchField,
                                    operator: 'IS NOT NULL',
                                    value: null,
                                },
                            ],
                        },
                    ],
                },
            },
        });

        // search for deals using the filter
        const deals = await pipedriveApiCall<{ data: { id: number }[] }>({
            accessToken: context.auth.access_token,
            apiDomain: context.auth.data['api_domain'],
            method: HttpMethod.GET,
            resourceUri: '/deals',
            query: {
                filter_id: filter.data.id,
                limit: 1,
                sort: 'update_time DESC',
            },
        });

        // delete the filter
        await pipedriveApiCall({
            accessToken: context.auth.access_token,
            apiDomain: context.auth.data['api_domain'],
            method: HttpMethod.DELETE,
            resourceUri: `/filters/${filter.data.id}`,
        });

        if (isNil(deals.data) || deals.data.length === 0) {
            return {
                found: false,
                data: [],
            };
        }

        const customFieldsResponse = await pipedrivePaginatedApiCall<GetField>({
            accessToken: context.auth.access_token,
            apiDomain: context.auth.data['api_domain'],
            method: HttpMethod.GET,
            resourceUri: '/dealFields',
        });

        const updatedDealProperties = pipedriveTransformCustomFields(
            customFieldsResponse,
            deals.data[0],
        );

        return {
            found: true,
            data: [updatedDealProperties],
        };
    },
});
