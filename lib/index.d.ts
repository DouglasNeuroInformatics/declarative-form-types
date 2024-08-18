import type { IntRange, Simplify } from 'type-fest';

/** @public */
declare namespace FormTypes {
  // INTERNAL UTILITIES

  export type NonNullableRecord<T> =
    NonNullable<T> extends infer U extends { [key: string]: unknown }
      ? {
          [K in keyof U]-?: NonNullable<U[K]>;
        }
      : never;

  // FIELD KINDS (DISCRIMINATOR KEY)

  export type StaticCompositeFieldKind = 'number-record' | 'record-array';

  export type StaticScalarFieldKind = 'boolean' | 'date' | 'number' | 'set' | 'string';

  export type StaticFieldKind = Simplify<StaticCompositeFieldKind | StaticScalarFieldKind>;

  // BASE DATA TYPES

  export type ScalarFieldValue = Date | Set<string> | boolean | number | string | undefined;

  export type FieldsetValue = { [key: string]: ScalarFieldValue };

  export type RecordArrayFieldValue = FieldsetValue[] | undefined;

  export type NumberRecordFieldValue = Partial<{ [key: string]: number }> | undefined;

  export type CompositeFieldValue = NumberRecordFieldValue | RecordArrayFieldValue;

  export type FormFieldValue = CompositeFieldValue | ScalarFieldValue;

  /** The type of the data associated with the entire instrument (i.e., the values for all fields) */
  export type FormDataType = { [key: string]: FormFieldValue };

  // REQUIRED DATA TYPES

  export type RequiredFieldValue<TValue extends FormFieldValue = FormFieldValue> =
    TValue extends infer TScalarValue extends NonNullable<ScalarFieldValue>
      ? TScalarValue
      : TValue extends infer TCompositeValue extends NonNullable<CompositeFieldValue>
        ? TCompositeValue extends (infer TArrayItem)[]
          ? NonNullableRecord<TArrayItem>[]
          : NonNullableRecord<TCompositeValue>
        : never;

  export type OptionalFieldValue<
    TValue extends FormFieldValue = FormFieldValue,
    TNull extends null = never
  > = TValue extends infer TScalarValue extends NonNullable<ScalarFieldValue>
    ? TNull | TScalarValue | undefined
    : TValue extends infer TCompositeValue extends NonNullable<CompositeFieldValue>
      ? TCompositeValue extends (infer TArrayItem)[]
        ? Partial<TArrayItem>[] | TNull | undefined
        : Partial<TCompositeValue> | TNull | undefined
      : never;

  export type RequiredFormDataType<TData extends FormDataType = FormDataType> = {
    [K in keyof TData]-?: RequiredFieldValue<TData[K]>;
  };

  export type PartialFormDataType<TData extends FormDataType = FormDataType> = {
    [K in keyof TData]?: OptionalFieldValue<TData[K]>;
  };

  export type PartialNullableFormDataType<TData extends FormDataType = FormDataType> = {
    [K in keyof TData]?: OptionalFieldValue<TData[K], null>;
  };

  /** The basic properties common to all field kinds */
  export type BaseFormField = {
    /** An optional description of this field */
    description?: string;

    /** Discriminator key */
    kind: StaticFieldKind;

    /** The label to be displayed to the user */
    label: string;
  };

  /**
   * A helper type used to merge `BaseFormField` with `T`, where kind determines
   * the data type stored in the form and variant determines what will be rendered
   * to the user, if applicable
   */
  export type FormFieldMixin<TField extends { kind: StaticFieldKind }> = Simplify<BaseFormField & TField>;

  export type StringFormField<TValue extends string = string> = FormFieldMixin<
    | {
        calculateStrength?: (this: void, password: string) => IntRange<0, 5>;
        kind: 'string';
        variant: 'password';
      }
    | {
        kind: 'string';
        options: { [K in TValue]: string };
        variant: 'radio' | 'select';
      }
    | {
        kind: 'string';
        placeholder?: string;
        variant: 'input' | 'textarea';
      }
  >;

  export type NumberFormField<TValue extends number = number> = FormFieldMixin<
    | {
        disableAutoPrefix?: boolean;
        kind: 'number';
        options: { [K in TValue]: string };
        variant: 'radio' | 'select';
      }
    | {
        kind: 'number';
        /** @deprecated - this should be defined in the validationSchema for better use feedback  */
        max?: number;
        /** @deprecated - this should be defined in the validationSchema for better use feedback  */
        min?: number;
        variant: 'input';
      }
    | {
        kind: 'number';
        max: number;
        min: number;
        variant: 'slider';
      }
  >;

  export type DateFormField = FormFieldMixin<{
    kind: 'date';
  }>;

  export type BooleanFormField = FormFieldMixin<
    | {
        kind: 'boolean';
        options?: {
          false: string;
          true: string;
        };
        variant: 'radio';
      }
    | {
        kind: 'boolean';
        variant: 'checkbox';
      }
  >;

  export type SetFormField<TValue extends Set<string> = Set<string>> = FormFieldMixin<{
    kind: 'set';
    options: TValue extends Set<infer TItem extends string>
      ? {
          [K in TItem]: string;
        }
      : never;
    variant: 'listbox' | 'select';
  }>;

  export type AnyScalarFormField = BooleanFormField | DateFormField | NumberFormField | SetFormField | StringFormField;

  /** A field where the underlying value of the field data is of type FormFieldValue */
  export type ScalarFormField<
    TValue extends RequiredFieldValue<ScalarFieldValue> = RequiredFieldValue<ScalarFieldValue>
  > = [TValue] extends [object]
    ? [TValue] extends [Date]
      ? DateFormField
      : [TValue] extends [Set<string>]
        ? SetFormField<TValue>
        : never
    : [TValue] extends [string]
      ? StringFormField<TValue>
      : [TValue] extends [number]
        ? NumberFormField<TValue>
        : [TValue] extends [boolean]
          ? BooleanFormField
          : AnyScalarFormField;

  export type DynamicFieldsetField<
    TFieldsetValue extends FieldsetValue,
    TValue extends RequiredFieldValue<ScalarFieldValue>
  > = {
    kind: 'dynamic';
    render: (this: void, fieldset: Partial<TFieldsetValue>) => ScalarFormField<TValue> | null;
  };

  export type Fieldset<TFieldsetValue extends NonNullableRecord<FieldsetValue>> = {
    [K in keyof TFieldsetValue]:
      | DynamicFieldsetField<TFieldsetValue, TFieldsetValue[K]>
      | ScalarFormField<TFieldsetValue[K]>;
  };

  export type RecordArrayFormField<
    TValue extends RequiredFieldValue<RecordArrayFieldValue> = RequiredFieldValue<RecordArrayFieldValue>
  > = FormFieldMixin<{
    fieldset: Fieldset<TValue[number]>;
    kind: 'record-array';
  }>;

  export type NumberRecordFormField<
    TValue extends RequiredFieldValue<NumberRecordFieldValue> = RequiredFieldValue<NumberRecordFieldValue>
  > = FormFieldMixin<{
    items: {
      [K in keyof TValue]: {
        description?: string;
        label: string;
      };
    };
    kind: 'number-record';
    options: { [key: number]: string };
    variant: 'likert';
  }>;

  export type CompositeFormField<TValue extends RequiredFieldValue<CompositeFieldValue>> =
    TValue extends RequiredFieldValue<RecordArrayFieldValue>
      ? RecordArrayFormField<TValue>
      : TValue extends RequiredFieldValue<NumberRecordFieldValue>
        ? NumberRecordFormField<TValue>
        : never;

  export type AnyStaticFormField =
    | BooleanFormField
    | DateFormField
    | NumberFormField
    | NumberRecordFormField
    | RecordArrayFormField
    | SetFormField
    | StringFormField;

  export type StaticFormField<TValue extends RequiredFieldValue = RequiredFieldValue> = [TValue] extends [
    RequiredFieldValue<ScalarFieldValue>
  ]
    ? ScalarFormField<TValue>
    : [TValue] extends [RequiredFieldValue<CompositeFieldValue>]
      ? [TValue] extends [RequiredFieldValue<RecordArrayFieldValue>]
        ? RecordArrayFormField<TValue>
        : [TValue] extends [RequiredFieldValue<NumberRecordFieldValue>]
          ? NumberRecordFormField<TValue>
          : never
      : AnyStaticFormField;

  export type StaticFormFields<
    TData extends FormDataType,
    TRequiredData extends RequiredFormDataType<TData> = RequiredFormDataType<TData>
  > = {
    [K in keyof TRequiredData]: StaticFormField<TRequiredData[K]>;
  };

  export type DynamicFormField<TData extends FormDataType, TValue extends RequiredFieldValue = RequiredFieldValue> = {
    deps: readonly Extract<keyof TData, string>[];
    kind: 'dynamic';
    render: (this: void, data: PartialFormDataType<TData>) => StaticFormField<TValue> | null;
  };

  export type UnknownFormField<
    TData extends FormDataType = FormDataType,
    TKey extends keyof TData = keyof TData,
    TRequiredData extends RequiredFormDataType<TData> = RequiredFormDataType<TData>
  > = DynamicFormField<TData, TRequiredData[TKey]> | StaticFormField<TRequiredData[TKey]>;

  export type FormFields<TData extends FormDataType = FormDataType> = {
    [K in keyof TData]-?: UnknownFormField<TData, K>;
  };

  export type FormFieldsGroup<TData extends FormDataType> = {
    description?: string;
    fields: {
      [K in keyof TData]?: UnknownFormField<RequiredFormDataType<TData>, K>;
    };
    title?: string;
  };

  export type FormContent<TData extends FormDataType = FormDataType> = FormFields<TData> | FormFieldsGroup<TData>[];
}

export import NonNullableRecord = FormTypes.NonNullableRecord;
export import StaticCompositeFieldKind = FormTypes.StaticCompositeFieldKind;
export import StaticScalarFieldKind = FormTypes.StaticScalarFieldKind;
export import StaticFieldKind = FormTypes.StaticFieldKind;
export import ScalarFieldValue = FormTypes.ScalarFieldValue;
export import FieldsetValue = FormTypes.FieldsetValue;
export import RecordArrayFieldValue = FormTypes.RecordArrayFieldValue;
export import NumberRecordFieldValue = FormTypes.NumberRecordFieldValue;
export import CompositeFieldValue = FormTypes.CompositeFieldValue;
export import FormFieldValue = FormTypes.FormFieldValue;
export import FormDataType = FormTypes.FormDataType;
export import RequiredFieldValue = FormTypes.RequiredFieldValue;
export import OptionalFieldValue = FormTypes.OptionalFieldValue;
export import RequiredFormDataType = FormTypes.RequiredFormDataType;
export import PartialFormDataType = FormTypes.PartialFormDataType;
export import PartialNullableFormDataType = FormTypes.PartialNullableFormDataType;
export import BaseFormField = FormTypes.BaseFormField;
export import FormFieldMixin = FormTypes.FormFieldMixin;
export import StringFormField = FormTypes.StringFormField;
export import NumberFormField = FormTypes.NumberFormField;
export import DateFormField = FormTypes.DateFormField;
export import BooleanFormField = FormTypes.BooleanFormField;
export import SetFormField = FormTypes.SetFormField;
export import AnyScalarFormField = FormTypes.AnyScalarFormField;
export import ScalarFormField = FormTypes.ScalarFormField;
export import DynamicFieldsetField = FormTypes.DynamicFieldsetField;
export import Fieldset = FormTypes.Fieldset;
export import RecordArrayFormField = FormTypes.RecordArrayFormField;
export import NumberRecordFormField = FormTypes.NumberRecordFormField;
export import CompositeFormField = FormTypes.CompositeFormField;
export import AnyStaticFormField = FormTypes.AnyStaticFormField;
export import StaticFormField = FormTypes.StaticFormField;
export import StaticFormFields = FormTypes.StaticFormFields;
export import DynamicFormField = FormTypes.DynamicFormField;
export import UnknownFormField = FormTypes.UnknownFormField;
export import FormFields = FormTypes.FormFields;
export import FormFieldsGroup = FormTypes.FormFieldsGroup;
export import FormContent = FormTypes.FormContent;

export default FormTypes;
