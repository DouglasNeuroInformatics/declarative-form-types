import { expectTypeOf } from 'expect-type';

import type {
  BooleanFormField,
  DateFormField,
  FieldsetValue,
  NumberRecordFieldValue,
  OptionalFieldValue,
  RecordArrayFieldValue,
  RequiredFieldValue,
  ScalarFieldValue,
  ScalarFormField,
  SetFormField,
  StringFormField,
  UnknownFormField
} from './index.d.ts';

/** RequiredFieldValue */
{
  expectTypeOf<Exclude<ScalarFieldValue, undefined>>().toMatchTypeOf<RequiredFieldValue<ScalarFieldValue>>();
  expectTypeOf<{ [key: string]: number }>().toMatchTypeOf<RequiredFieldValue<NumberRecordFieldValue>>();
  expectTypeOf<'a' | 'b'>().toMatchTypeOf<RequiredFieldValue<string>>();
  expectTypeOf<'a' | 'b'>().not.toEqualTypeOf<RequiredFieldValue<string>>();
  expectTypeOf<'a' | 'b'>().toEqualTypeOf<RequiredFieldValue<'a' | 'b'>>();
  expectTypeOf<'a' | 'b'>().not.toEqualTypeOf<RequiredFieldValue<'a' | 'b' | 'c'>>();
}

/** OptionalFieldValue */
{
  expectTypeOf<string | undefined>().toMatchTypeOf<OptionalFieldValue<string>>();
  expectTypeOf<RecordArrayFieldValue>().toMatchTypeOf<OptionalFieldValue<FieldsetValue[]>>();
}

/** StringFormField */
{
  expectTypeOf<StringFormField<'a' | 'b' | 'c'>>().toMatchTypeOf<StringFormField<'a' | 'b' | 'c'>>();
  expectTypeOf<StringFormField<'a' | 'b' | 'c'>>().not.toMatchTypeOf<StringFormField<'a' | 'b' | 'c' | 'd'>>();
}

/** ScalarFormField */
{
  expectTypeOf<ScalarFormField<Date>>().toEqualTypeOf<DateFormField>();
  expectTypeOf<ScalarFormField<Set<string>>>().toEqualTypeOf<SetFormField>();
  expectTypeOf<ScalarFormField<Set<string>>>().toEqualTypeOf<SetFormField<Set<string>>>();
  expectTypeOf<keyof ScalarFormField<Set<string>>['options']>().toEqualTypeOf<string>();
  expectTypeOf<ScalarFormField<Set<'a' | 'b'>>>().toEqualTypeOf<SetFormField<Set<'a' | 'b'>>>();
  expectTypeOf<keyof ScalarFormField<Set<'a' | 'b'>>['options']>().toEqualTypeOf<'a' | 'b'>();
  expectTypeOf<keyof Extract<ScalarFormField<string>, { options: object }>['options']>().toBeString();
  expectTypeOf<keyof Extract<ScalarFormField<'a' | 'b'>, { options: object }>['options']>().toEqualTypeOf<'a' | 'b'>();
  expectTypeOf<keyof Extract<ScalarFormField<number>, { options: object }>['options']>().toBeNumber();
  expectTypeOf<keyof Extract<ScalarFormField<1 | 2>, { options: object }>['options']>().toEqualTypeOf<1 | 2>();
  expectTypeOf<ScalarFormField<boolean>>().toEqualTypeOf<BooleanFormField>();
}

/** UnknownFormField */
{
  expectTypeOf<UnknownFormField<{ _: boolean }>['kind']>().toMatchTypeOf<'boolean' | 'dynamic'>();
  expectTypeOf<UnknownFormField<{ _: RecordArrayFieldValue }>['kind']>().toMatchTypeOf<'dynamic' | 'record-array'>();
  expectTypeOf<UnknownFormField<{ _: number }>['kind']>().toMatchTypeOf<'dynamic' | 'number'>();
  expectTypeOf<UnknownFormField<{ _: Set<string> }>['kind']>().toMatchTypeOf<'dynamic' | 'set'>();
  expectTypeOf<UnknownFormField<{ _: Set<'a' | 'b' | 'c'> }>['kind']>().toMatchTypeOf<'dynamic' | 'set'>();
  expectTypeOf<UnknownFormField<{ _: string }>['kind']>().toMatchTypeOf<'dynamic' | 'string'>();
  expectTypeOf<UnknownFormField<{ _: 'a' | 'b' | 'c' }>['kind']>().toMatchTypeOf<'dynamic' | 'string'>();
}
