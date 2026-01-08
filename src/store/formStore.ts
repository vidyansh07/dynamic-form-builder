import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SchemaField, FormData, FormErrors } from '../types/schema';
import { validateField } from '../utils/validation';

interface FormState {
  schema: SchemaField[];
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  showPreview: boolean;
  fetchError: string | null;

  // Actions
  fetchSchema: () => Promise<void>;
  setFieldValue: (fieldId: string, value: any) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  togglePreview: (show: boolean) => void;
}

const API_URL = 'https://mocki.io/v1/785fb08b-0435-4ba4-8dd4-17bb658262cd';

// Fallback schema in case API fails (since the provided Mocki link 404s)
const FALLBACK_SCHEMA: SchemaField[] = [
  {
    id: 'fullName',
    type: 'text',
    label: 'Full Name',
    placeholder: 'John Doe',
    required: true,
    validation: { minLength: 2, maxLength: 50 }
  },
  {
    id: 'email',
    type: 'text',
    label: 'Email Address',
    placeholder: 'john@example.com',
    required: true,
    validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
  },
  {
    id: 'role',
    type: 'select',
    label: 'Job Role',
    required: true,
    options: ['Developer', 'Designer', 'Product Manager', 'Lawyer']
  },
  {
    id: 'specialization',
    type: 'text',
    label: 'Law Specification',
    placeholder: 'e.g. Corporate, Criminal',
    required: true,
    dependsOn: { field: 'role', value: 'Lawyer' }
  },
  {
    id: 'experience',
    type: 'number',
    label: 'Years of Experience',
    placeholder: '0',
    validation: { min: 0, max: 50 }
  },
  {
    id: 'availableStart',
    type: 'date',
    label: 'Available Start Date',
    required: true
  },
  {
    id: 'terms',
    type: 'checkbox',
    label: 'I accept the terms and conditions',
    required: true
  }
];

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      schema: [],
      formData: {},
      errors: {},
      isLoading: false,
      isSubmitting: false,
      showPreview: false,
      fetchError: null,

      fetchSchema: async () => {
        set({ isLoading: true, fetchError: null });
        try {
          // Simulate API delay to show loading state
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Use mock data directly as requested for the assignment
          set({ schema: FALLBACK_SCHEMA, isLoading: false });
        } catch (error) {
          console.error('Failed to load schema:', error);
          set({ 
            schema: FALLBACK_SCHEMA, 
            isLoading: false,
            fetchError: null
          });
        }
      },

      setFieldValue: (id, value) => {
        const { formData, errors, schema } = get();
        // Clear error for this field when modifying
        const newErrors = { ...errors };
        delete newErrors[id];

        // Bonus: Conditional field logic could be handled here
        // e.g. if field is "role" and data is "Other", add "otherRole" to schema (not impl in this simple version)

        set({
          formData: { ...formData, [id]: value },
          errors: newErrors,
        });
      },

      validateForm: () => {
        const { schema, formData } = get();
        const newErrors: FormErrors = {};
        
        schema.forEach((field) => {
          // Check visibility
          if (field.dependsOn) {
            const dependencyValue = formData[field.dependsOn.field];
            if (dependencyValue !== field.dependsOn.value) {
              return; // Skip validation for hidden fields
            }
          }

          const value = formData[field.id];
          const error = validateField(value, { 
            ...field.validation, 
            required: field.required 
          });
          if (error) {
            newErrors[field.id] = error;
          }
        });

        set({ errors: newErrors });
        return Object.keys(newErrors).length === 0;
      },

      resetForm: () => set({ formData: {}, errors: {}, showPreview: false }),
      togglePreview: (show) => set({ showPreview: show }),
    }),
    {
      name: 'form-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ formData: state.formData }), // only save formData
    }
  )
);
