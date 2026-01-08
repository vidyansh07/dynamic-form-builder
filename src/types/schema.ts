export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'date';

export interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface SchemaField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRules;
  options?: string[]; // For select fields
  dependsOn?: {
    field: string;
    value: string | number | boolean;
  };
}

export type FormData = Record<string, string | number | boolean>;
export type FormErrors = Record<string, string>; // Field ID -> Error Message
