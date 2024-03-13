import type { Simplify } from 'type-fest';

/** Discriminator key to determine the structure of a specific form field */
export type FormFieldKind = 'array' | 'binary' | 'date' | 'numeric' | 'options' | 'text';

// BASE DATA TYPES

export type PrimitiveFieldValue = Date | boolean | number | string | undefined;

export type ArrayFieldsetValue = Record<string, PrimitiveFieldValue>;

export type ArrayFieldValue = ArrayFieldsetValue[] | undefined;

export type FormFieldValue = ArrayFieldValue | PrimitiveFieldValue;

/** The type of the data associated with the entire instrument (i.e., the values for all fields) */
export type FormDataType = Record<string, FormFieldValue>;

// REQUIRED DATA TYPES

export type RequiredPrimitiveFieldValue<T extends PrimitiveFieldValue = PrimitiveFieldValue> = NonNullable<T>;

export type RequiredArrayFieldsetValue<T extends ArrayFieldsetValue = ArrayFieldsetValue> = {
  [K in keyof T]: RequiredPrimitiveFieldValue<T[K]>;
};

export type RequiredArrayFieldValue<T extends ArrayFieldValue = ArrayFieldValue> = RequiredArrayFieldsetValue<
  NonNullable<T>[number]
>[];

export type RequiredFormFieldValue<T extends FormFieldValue = FormFieldValue> =
  T extends NonNullable<PrimitiveFieldValue>
    ? RequiredPrimitiveFieldValue<T>
    : T extends NonNullable<ArrayFieldValue>
      ? RequiredArrayFieldValue
      : T;

export type RequiredFormDataType<T extends FormDataType = FormDataType> = {
  [K in keyof T]-?: NonNullable<T[K]> extends (infer U extends ArrayFieldsetValue)[]
    ? {
        [P in keyof U]-?: NonNullable<U[P]> extends RequiredPrimitiveFieldValue ? NonNullable<U[P]> : never;
      }[]
    : NonNullable<T[K]> extends RequiredPrimitiveFieldValue
      ? NonNullable<T[K]>
      : RequiredArrayFieldValue | RequiredPrimitiveFieldValue;
};

/** The `FormDataType` with all `FormFieldValues` set to be optional */
export type PartialFormDataType<T extends FormDataType = FormDataType> = {
  [K in keyof T]?: NonNullable<T[K]> extends (infer U extends ArrayFieldsetValue)[]
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
  [K in keyof T]?: NonNullable<T[K]> extends (infer U extends ArrayFieldsetValue)[]
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

export type NumericFormField = FormFieldMixin<
  | {
      kind: 'numeric';
      max: number;
      min: number;
      variant: 'slider';
    }
  | {
      kind: 'numeric';
      max?: number;
      min?: number;
      variant: 'default';
    }
>;

/**
 * Here, TValue is a string and options is a map of the actual values (i.e., what will be sent to backend)
 * to the labels. Thus, only one key will be sent to the backend.
 */
export type OptionsFormField<TValue extends string = string> = FormFieldMixin<{
  kind: 'options';
  options: Record<TValue, string>;
}>;

export type DateFormField = FormFieldMixin<{
  kind: 'date';
}>;

export type BinaryFormField = FormFieldMixin<
  | {
      kind: 'binary';
      options?: {
        f: string;
        t: string;
      };
      variant: 'radio';
    }
  | {
      kind: 'binary';
      variant: 'checkbox';
    }
>;

/** A field where the underlying value of the field data is of type FormFieldValue */
export type PrimitiveFormField<TValue extends RequiredPrimitiveFieldValue = RequiredPrimitiveFieldValue> =
  TValue extends Date
    ? DateFormField
    : TValue extends string
      ? OptionsFormField<TValue> | TextFormField
      : TValue extends number
        ? NumericFormField
        : TValue extends boolean
          ? BinaryFormField
          : BinaryFormField | DateFormField | NumericFormField | OptionsFormField;

export type DynamicFieldsetField<T extends ArrayFieldsetValue, TValue extends RequiredPrimitiveFieldValue> = {
  kind: 'dynamic-fieldset';
  render: (fieldset: Partial<T>) => PrimitiveFormField<TValue> | null;
};

export type ArrayFieldset<T extends RequiredArrayFieldsetValue> = {
  [K in keyof T]: DynamicFieldsetField<T, T[K]> | PrimitiveFormField<T[K]>;
};

export type ArrayFormField<TValue extends RequiredArrayFieldValue = RequiredArrayFieldValue> = FormFieldMixin<{
  fieldset: ArrayFieldset<TValue[number]>;
  kind: 'array';
}>;

export type StaticFormField<TValue extends RequiredFormFieldValue> = TValue extends RequiredPrimitiveFieldValue
  ? PrimitiveFormField<TValue>
  : TValue extends RequiredArrayFieldValue
    ? ArrayFormField<TValue>
    : ArrayFormField | PrimitiveFormField;

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
