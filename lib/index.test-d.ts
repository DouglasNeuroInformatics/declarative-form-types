// import _ from 'lodash';
import { expectAssignable, expectType } from 'tsd';

import type { FormContent, FormFields, FormFieldsGroup, UnknownFormField } from './index.d.ts';

type MockFormData = {
  booleanCheckbox: boolean;
  booleanRadio: boolean;
  composite: {
    compositeItem: any;
  }[];
  numberDefault: number;
  numberSlider: number;
  set: Set<'a' | 'b' | 'c'>;
  stringLong: string;
  stringPassword: string;
  stringSelect: 'a' | 'b' | 'c';
  stringShort: string;
};

const mockFormFields: FormFields<MockFormData> = {
  booleanCheckbox: {
    kind: 'boolean',
    label: 'Are the types working correctly?',
    variant: 'checkbox'
  },
  booleanRadio: {
    kind: 'boolean',
    label: 'Are the types working correctly?',
    variant: 'radio'
  },
  composite: {
    fieldset: {
      compositeItem: {
        kind: 'string',
        label: 'Are the types working correctly?',
        variant: 'short'
      }
    },
    kind: 'composite',
    label: 'Are the types working correctly?'
  },
  numberDefault: {
    kind: 'number',
    label: 'Are the types working correctly?',
    variant: 'default'
  },
  numberSlider: {
    kind: 'number',
    label: 'Are the types working correctly?',
    max: 10,
    min: 1,
    variant: 'slider'
  },
  set: {
    kind: 'set',
    label: 'Are the types working correctly?',
    options: {
      a: 'a',
      b: 'b',
      c: 'c'
    }
  },
  stringLong: {
    kind: 'string',
    label: 'Are the types working correctly?',
    variant: 'long'
  },
  stringPassword: {
    kind: 'string',
    label: 'Are the types working correctly?',
    variant: 'password'
  },
  stringSelect: {
    kind: 'string',
    label: 'Are the types working correctly?',
    options: {
      a: 'a',
      b: 'b',
      c: 'c'
    },
    variant: 'select'
  },
  stringShort: {
    kind: 'string',
    label: 'Are the types working correctly?',
    variant: 'short'
  }
};

const mockFormFieldsGroup: FormFieldsGroup<MockFormData> = {
  fields: mockFormFields,
  title: 'Mock Group'
};

// ScalarFormField
expectType<'boolean' | 'dynamic'>(mockFormFields.booleanCheckbox.kind);
expectType<'boolean' | 'dynamic'>(mockFormFields.booleanRadio.kind);
expectType<'composite' | 'dynamic'>(mockFormFields.composite.kind);
expectType<'dynamic' | 'number'>(mockFormFields.numberDefault.kind);
expectType<'dynamic' | 'number'>(mockFormFields.numberSlider.kind);
expectType<'dynamic' | 'set'>(mockFormFields.set.kind);
expectType<'dynamic' | 'string'>(mockFormFields.stringLong.kind);
expectType<'dynamic' | 'string'>(mockFormFields.stringPassword.kind);
expectType<'dynamic' | 'string'>(mockFormFields.stringShort.kind);

// UnknownFormField
expectAssignable<UnknownFormField>(mockFormFields.booleanCheckbox);
expectAssignable<UnknownFormField>(mockFormFields.booleanRadio);
expectAssignable<UnknownFormField>(mockFormFields.stringSelect);
expectAssignable<UnknownFormField>(mockFormFields.numberDefault);
expectAssignable<UnknownFormField>(mockFormFields.numberSlider);
expectAssignable<UnknownFormField>(mockFormFields.set);
expectAssignable<UnknownFormField>(mockFormFields.stringLong);
expectAssignable<UnknownFormField>(mockFormFields.stringPassword);
expectAssignable<UnknownFormField>(mockFormFields.stringShort);

// FormFields
expectType<FormFields<MockFormData>>(mockFormFields);

// FormFieldsGroup
expectType<FormFieldsGroup<MockFormData>>(mockFormFieldsGroup);

// FormContent
expectAssignable<FormContent<MockFormData>>(mockFormFields);
expectAssignable<FormContent<MockFormData>>([mockFormFieldsGroup]);
