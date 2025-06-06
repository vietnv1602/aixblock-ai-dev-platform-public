import {
  createAction,
  PieceAuth,
  Property,
} from 'workflow-blocks-framework';
import { z } from 'zod';
import { propsValidation } from 'workflow-blocks-common';

export const division = createAction({
  name: 'division_math',
  auth: PieceAuth.None(),
  displayName: 'Division',
  description: 'Divide first number by the second number',
  errorHandlingOptions: {
    continueOnFailure: {
      hide: true,
    },
    retryOnFailure: {
      hide: true,
    },
  },
  props: {
    first_number: Property.Number({
      displayName: 'First Number',
      description: undefined,
      required: true,
    }),
    second_number: Property.Number({
      displayName: 'Second Number',
      description: undefined,
      required: true,
    }),
  },
  async run(context) {
    await propsValidation.validateZod(context.propsValue, {
      second_number: z.number().refine(val => val !== 0, {
        message: "Second number cannot be zero"
      }),
    });
    return (
      context.propsValue['first_number'] / context.propsValue['second_number']
    );
  },
});
