import { expectTypeOf } from 'expect-type';

import type {
  FieldsetValue,
  FormFields,
  NumberRecordFieldValue,
  OptionalFieldValue,
  RecordArrayFieldValue,
  RequiredFieldValue,
  ScalarFieldValue,
  StringFormField,
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

type MockFormFields = FormFields<MockFormData>;

// RequiredFieldValue
expectTypeOf<Exclude<ScalarFieldValue, undefined>>().toMatchTypeOf<RequiredFieldValue<ScalarFieldValue>>();
expectTypeOf<{ [key: string]: number }>().toMatchTypeOf<RequiredFieldValue<NumberRecordFieldValue>>();

// OptionalFieldValue

expectTypeOf<string | undefined>().toMatchTypeOf<OptionalFieldValue<string>>();
expectTypeOf<NumberRecordFieldValue>();
expectTypeOf<RecordArrayFieldValue>().toMatchTypeOf<OptionalFieldValue<FieldsetValue[]>>();

// StringFormField
const stringFormField = {
  kind: 'string',
  label: '',
  options: {
    a: '',
    b: '',
    c: ''
  },
  variant: 'select'
} as const satisfies StringFormField<'a' | 'b' | 'c'>;
expectTypeOf(stringFormField).toMatchTypeOf<StringFormField<'a' | 'b' | 'c'>>();
expectTypeOf(stringFormField).not.toMatchTypeOf<StringFormField<'a' | 'b' | 'c' | 'd'>>();

// ScalarFormField
expectTypeOf<MockFormFields['booleanCheckbox']['kind']>().toMatchTypeOf<'boolean' | 'dynamic'>();
expectTypeOf<MockFormFields['booleanRadio']['kind']>().toMatchTypeOf<'boolean' | 'dynamic'>();
expectTypeOf<MockFormFields['recordArray']['kind']>().toMatchTypeOf<'dynamic' | 'record-array'>();
expectTypeOf<MockFormFields['numberInput']['kind']>().toMatchTypeOf<'dynamic' | 'number'>();
expectTypeOf<MockFormFields['numberSlider']['kind']>().toMatchTypeOf<'dynamic' | 'number'>();
expectTypeOf<MockFormFields['setRadio']['kind']>().toMatchTypeOf<'dynamic' | 'set'>();
expectTypeOf<MockFormFields['setSelect']['kind']>().toMatchTypeOf<'dynamic' | 'set'>();
expectTypeOf<MockFormFields['stringTextArea']['kind']>().toMatchTypeOf<'dynamic' | 'string'>();
expectTypeOf<MockFormFields['stringPassword']['kind']>().toMatchTypeOf<'dynamic' | 'string'>();
expectTypeOf<MockFormFields['stringInput']['kind']>().toMatchTypeOf<'dynamic' | 'string'>();

// UnknownFormField
expectTypeOf<MockFormFields['booleanCheckbox']>().toMatchTypeOf<UnknownFormField>();
expectTypeOf<MockFormFields['booleanRadio']>().toMatchTypeOf<UnknownFormField>();
expectTypeOf<MockFormFields['recordArray']>().toMatchTypeOf<UnknownFormField>();
expectTypeOf<MockFormFields['numberInput']>().toMatchTypeOf<UnknownFormField>();
expectTypeOf<MockFormFields['numberSlider']>().toMatchTypeOf<UnknownFormField>();
expectTypeOf<MockFormFields['setRadio']>().toMatchTypeOf<UnknownFormField>();
expectTypeOf<MockFormFields['setSelect']>().toMatchTypeOf<UnknownFormField>();
expectTypeOf<MockFormFields['stringTextArea']>().toMatchTypeOf<UnknownFormField>();
expectTypeOf<MockFormFields['stringPassword']>().toMatchTypeOf<UnknownFormField>();
expectTypeOf<MockFormFields['stringInput']>().toMatchTypeOf<UnknownFormField>();
