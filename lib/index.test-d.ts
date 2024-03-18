// import _ from 'lodash';
import { expectAssignable, expectType } from 'tsd';

import type { FormContent, FormFields, FormFieldsGroup, UnknownFormField } from './index.d.ts';

type MockFormData = {
  booleanCheckbox: boolean;
  booleanRadio: boolean;
  composite: {
    compositeItem: any;
  }[];
  enum: 'a' | 'b' | 'c';
  numberDefault: number;
  numberSlider: number;
  set: Set<'a' | 'b' | 'c'>;
  textLong: string;
  textPassword: string;
  textShort: string;
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
        kind: 'text',
        label: 'Are the types working correctly?',
        variant: 'short'
      }
    },
    kind: 'composite',
    label: 'Are the types working correctly?'
  },
  enum: {
    kind: 'enum',
    label: 'Are the types working correctly?',
    options: {
      a: 'a',
      b: 'b',
      c: 'c'
    }
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
  textLong: {
    kind: 'text',
    label: 'Are the types working correctly?',
    variant: 'long'
  },
  textPassword: {
    kind: 'text',
    label: 'Are the types working correctly?',
    variant: 'password'
  },
  textShort: {
    kind: 'text',
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
expectType<'dynamic' | 'enum' | 'text'>(mockFormFields.enum.kind);
expectType<'dynamic' | 'number'>(mockFormFields.numberDefault.kind);
expectType<'dynamic' | 'number'>(mockFormFields.numberSlider.kind);
expectType<'dynamic' | 'set'>(mockFormFields.set.kind);
expectType<'dynamic' | 'enum' | 'text'>(mockFormFields.textLong.kind);
expectType<'dynamic' | 'enum' | 'text'>(mockFormFields.textPassword.kind);
expectType<'dynamic' | 'enum' | 'text'>(mockFormFields.textShort.kind);

// UnknownFormField
expectAssignable<UnknownFormField>(mockFormFields.booleanCheckbox);
expectAssignable<UnknownFormField>(mockFormFields.booleanRadio);
expectAssignable<UnknownFormField>(mockFormFields.enum);
expectAssignable<UnknownFormField>(mockFormFields.numberDefault);
expectAssignable<UnknownFormField>(mockFormFields.numberSlider);
expectAssignable<UnknownFormField>(mockFormFields.set);
expectAssignable<UnknownFormField>(mockFormFields.textLong);
expectAssignable<UnknownFormField>(mockFormFields.textPassword);
expectAssignable<UnknownFormField>(mockFormFields.textShort);

// FormFields
expectType<FormFields<MockFormData>>(mockFormFields);

// FormFieldsGroup
expectType<FormFieldsGroup<MockFormData>>(mockFormFieldsGroup);

// FormContent
expectAssignable<FormContent<MockFormData>>(mockFormFields);
expectAssignable<FormContent<MockFormData>>([mockFormFieldsGroup]);
