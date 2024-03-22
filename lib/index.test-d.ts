import { expectAssignable, expectType } from 'tsd';

import type {
  FieldsetValue,
  FormContent,
  FormFields,
  FormFieldsGroup,
  NumberRecordFieldValue,
  OptionalFieldValue,
  RecordArrayFieldValue,
  RequiredFieldValue,
  ScalarFieldValue,
  UnknownFormField
} from './index.d.ts';

type MockFormData = {
  booleanCheckbox: boolean;
  booleanRadio: boolean;
  numberInput: number;
  numberSlider: number;
  recordArray: {
    recordArrayItem: any;
  }[];
  setRadio: Set<'a' | 'b' | 'c'>;
  setSelect: Set<'a' | 'b' | 'c'>;
  stringInput: string;
  stringPassword: string;
  stringSelect: 'a' | 'b' | 'c';
  stringTextArea: string;
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
  numberInput: {
    kind: 'number',
    label: 'Are the types working correctly?',
    variant: 'input'
  },
  numberSlider: {
    kind: 'number',
    label: 'Are the types working correctly?',
    max: 10,
    min: 1,
    variant: 'slider'
  },
  recordArray: {
    fieldset: {
      recordArrayItem: {
        kind: 'string',
        label: 'Are the types working correctly?',
        variant: 'input'
      }
    },
    kind: 'record-array',
    label: 'Are the types working correctly?'
  },
  setRadio: {
    kind: 'set',
    label: 'Are the types working correctly?',
    options: {
      a: 'a',
      b: 'b',
      c: 'c'
    },
    variant: 'listbox'
  },
  setSelect: {
    kind: 'set',
    label: 'Are the types working correctly?',
    options: {
      a: 'a',
      b: 'b',
      c: 'c'
    },
    variant: 'select'
  },
  stringInput: {
    kind: 'string',
    label: 'Are the types working correctly?',
    variant: 'input'
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
  stringTextArea: {
    kind: 'string',
    label: 'Are the types working correctly?',
    variant: 'textarea'
  }
};

const mockFormFieldsGroup: FormFieldsGroup<MockFormData> = {
  fields: mockFormFields,
  title: 'Mock Group'
};

// RequiredFieldValue
expectType<Exclude<ScalarFieldValue, undefined>>(0 as RequiredFieldValue<ScalarFieldValue>);
expectType<{ [key: string]: number }>({} as RequiredFieldValue<NumberRecordFieldValue>);

// OptionalFieldValue
expectType<string | undefined>('' as OptionalFieldValue<string>);
expectType<NumberRecordFieldValue>({} as OptionalFieldValue<{ [key: string]: number }>);
expectType<RecordArrayFieldValue>([] as OptionalFieldValue<FieldsetValue[]>);

// ScalarFormField
expectType<'boolean' | 'dynamic'>(mockFormFields.booleanCheckbox.kind);
expectType<'boolean' | 'dynamic'>(mockFormFields.booleanRadio.kind);
expectType<'dynamic' | 'record-array'>(mockFormFields.recordArray.kind);
expectType<'dynamic' | 'number'>(mockFormFields.numberInput.kind);
expectType<'dynamic' | 'number'>(mockFormFields.numberSlider.kind);
expectType<'dynamic' | 'set'>(mockFormFields.setRadio.kind);
expectType<'dynamic' | 'set'>(mockFormFields.setSelect.kind);
expectType<'dynamic' | 'string'>(mockFormFields.stringTextArea.kind);
expectType<'dynamic' | 'string'>(mockFormFields.stringPassword.kind);
expectType<'dynamic' | 'string'>(mockFormFields.stringInput.kind);

// UnknownFormField
expectAssignable<UnknownFormField>(mockFormFields.booleanCheckbox);
expectAssignable<UnknownFormField>(mockFormFields.booleanRadio);
expectAssignable<UnknownFormField>(mockFormFields.stringSelect);
expectAssignable<UnknownFormField>(mockFormFields.numberInput);
expectAssignable<UnknownFormField>(mockFormFields.numberSlider);
expectAssignable<UnknownFormField>(mockFormFields.setRadio);
expectAssignable<UnknownFormField>(mockFormFields.setSelect);
expectAssignable<UnknownFormField>(mockFormFields.stringTextArea);
expectAssignable<UnknownFormField>(mockFormFields.stringPassword);
expectAssignable<UnknownFormField>(mockFormFields.stringInput);

// FormFields
expectType<FormFields<MockFormData>>(mockFormFields);

// FormFieldsGroup
expectType<FormFieldsGroup<MockFormData>>(mockFormFieldsGroup);

// FormContent
expectAssignable<FormContent<MockFormData>>(mockFormFields);
expectAssignable<FormContent<MockFormData>>([mockFormFieldsGroup]);
