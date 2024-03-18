import { expectType } from 'tsd';

import type { FormContent, FormFields } from './index.d.ts';

type MockFormData = {
  isWorkingCheck: boolean;
  isWorkingRadio: boolean;
};

const mockFormContent: FormContent<MockFormData> = {
  isWorkingCheck: {
    kind: 'boolean',
    label: 'Are the types working correctly?',
    variant: 'checkbox'
  },
  isWorkingRadio: {
    kind: 'boolean',
    label: 'Are the types working correctly?',
    variant: 'checkbox'
  }
};

expectType<FormFields<MockFormData>>(mockFormContent);
