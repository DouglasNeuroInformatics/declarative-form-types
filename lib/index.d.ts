import type { Simplify } from 'type-fest';

/** Discriminator key to determine the structure of a specific form field */
export type FormFieldKind = 'boolean' | 'composite' | 'date' | 'enum' | 'number' | 'set' | 'text';

// BASE DATA TYPES

export type ScalarFieldValue = Date | Set<string> | boolean | number | string | undefined;

export type CompositeFieldsetValue = Record<string, ScalarFieldValue>;

export type CompositeFieldValue = CompositeFieldsetValue[] | undefined;

export type FormFieldValue = CompositeFieldValue | ScalarFieldValue;

/** The type of the data associated with the entire instrument (i.e., the values for all fields) */
export type FormDataType = Record<string, FormFieldValue>;

// REQUIRED DATA TYPES

export type RequiredScalarFieldValue<T extends ScalarFieldValue = ScalarFieldValue> = NonNullable<T>;

export type RequiredCompositeFieldsetValue<T extends CompositeFieldsetValue = CompositeFieldsetValue> = {
  [K in keyof T]: RequiredScalarFieldValue<T[K]>;
};

export type RequiredCompositeFieldValue<T extends CompositeFieldValue = CompositeFieldValue> =
  RequiredCompositeFieldsetValue<NonNullable<T>[number]>[];

export type RequiredFormFieldValue<T extends FormFieldValue = FormFieldValue> =
  T extends NonNullable<ScalarFieldValue>
    ? RequiredScalarFieldValue<T>
    : T extends NonNullable<CompositeFieldValue>
      ? RequiredCompositeFieldValue
      : T;

export type RequiredFormDataType<T extends FormDataType = FormDataType> = {
  [K in keyof T]-?: NonNullable<T[K]> extends (infer U extends CompositeFieldsetValue)[]
    ? {
        [P in keyof U]-?: NonNullable<U[P]> extends RequiredScalarFieldValue ? NonNullable<U[P]> : never;
      }[]
    : NonNullable<T[K]> extends RequiredScalarFieldValue
      ? NonNullable<T[K]>
      : RequiredCompositeFieldValue | RequiredScalarFieldValue;
};

/** The `FormDataType` with all `FormFieldValues` set to be optional */
export type PartialFormDataType<T extends FormDataType = FormDataType> = {
  [K in keyof T]?: NonNullable<T[K]> extends (infer U extends CompositeFieldsetValue)[]
    ?
        | {
            [P in keyof U]?: U[P];
          }[]
        | undefined
    : NonNullable<T[K]> extends FormFieldValue
      ? T[K]
      : never;
};

export type PartialNullableFormDataType<T extends FormDataType = FormDataType> = {
  [K in keyof T]?: NonNullable<T[K]> extends (infer U extends CompositeFieldsetValue)[]
    ?
        | {
            [P in keyof U]?: U[P] | null | undefined;
          }[]
        | null
        | undefined
    : NonNullable<T[K]> extends FormFieldValue
      ? T[K] | null | undefined
      : never;
};

/** The basic properties common to all field kinds */
export type BaseFormField = {
  /** An optional description of this field */
  description?: string;

  /** Discriminator key */
  kind: FormFieldKind;

  /** The label to be displayed to the user */
  label: string;
};

/**
 * A helper type used to merge `BaseFormField` with `T`, where kind determines
 * the data type stored in the form and variant determines what will be rendered
 * to the user, if applicable
 */
export type FormFieldMixin<T extends { kind: FormFieldKind }> = Simplify<BaseFormField & T>;

export type TextFormField = FormFieldMixin<{
  kind: 'text';
  variant: 'long' | 'password' | 'short';
}>;

export type NumberFormField = FormFieldMixin<
  | {
      kind: 'number';
      max: number;
      min: number;
      variant: 'slider';
    }
  | {
      kind: 'number';
      max?: number;
      min?: number;
      variant: 'default';
    }
>;

/**
 * Here, TValue is a string and options is a map of the actual values (i.e., what will be sent to backend)
 * to the labels. Thus, only one key will be sent to the backend.
 */
export type EnumFormField<TValue extends string = string> = FormFieldMixin<{
  kind: 'enum';
  options: Record<TValue, string>;
}>;

export type DateFormField = FormFieldMixin<{
  kind: 'date';
}>;

export type BooleanFormField = FormFieldMixin<
  | {
      kind: 'boolean';
      options?: {
        f: string;
        t: string;
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
  options: Record<TValue extends Set<infer TItem extends string> ? TItem : never, string>;
}>;

/** A field where the underlying value of the field data is of type FormFieldValue */
export type ScalarFormField<TValue extends RequiredScalarFieldValue = RequiredScalarFieldValue> = TValue extends object
  ? TValue extends Date
    ? DateFormField
    : TValue extends Set<string>
      ? SetFormField<TValue>
      : never
  : TValue extends string
    ? EnumFormField<TValue> | TextFormField
    : TValue extends number
      ? NumberFormField
      : TValue extends boolean
        ? BooleanFormField
        : never;

export type DynamicFieldsetField<T extends CompositeFieldsetValue, TValue extends RequiredScalarFieldValue> = {
  kind: 'dynamic';
  render: (fieldset: Partial<T>) => ScalarFormField<TValue> | null;
};

export type CompositeFieldset<T extends RequiredCompositeFieldsetValue> = {
  [K in keyof T]: DynamicFieldsetField<T, T[K]> | ScalarFormField<T[K]>;
};

export type CompositeFormField<TValue extends RequiredCompositeFieldValue = RequiredCompositeFieldValue> =
  FormFieldMixin<{
    fieldset: CompositeFieldset<TValue[number]>;
    kind: 'composite';
  }>;

export type StaticFormField<TValue extends RequiredFormFieldValue> = TValue extends RequiredScalarFieldValue
  ? ScalarFormField<TValue>
  : TValue extends RequiredCompositeFieldValue
    ? CompositeFormField<TValue>
    : CompositeFormField | ScalarFormField;

export type StaticFormFields<
  TData extends FormDataType,
  TRequiredData extends RequiredFormDataType<TData> = RequiredFormDataType<TData>
> = {
  [K in keyof TRequiredData]: StaticFormField<TRequiredData[K]>;
};

export type DynamicFormField<
  TData extends FormDataType,
  TValue extends RequiredFormFieldValue = RequiredFormFieldValue
> = {
  deps: readonly Extract<keyof TData, string>[];
  kind: 'dynamic';
  render: (data: PartialFormDataType<TData> | null) => StaticFormField<TValue> | null;
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
  title: string;
};

export type FormContent<TData extends FormDataType = FormDataType> = FormFields<TData> | FormFieldsGroup<TData>[];
