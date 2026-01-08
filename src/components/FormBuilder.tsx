import React, { useEffect } from 'react';
import { useFormStore } from '../store/formStore';
import { DynamicField } from './DynamicField';
import { Loader2, Send, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export const FormBuilder = () => {
  const { 
    schema, 
    isLoading, 
    fetchSchema, 
    validateForm, 
    togglePreview, 
    errors 
  } = useFormStore();

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      togglePreview(true);
    } else {
      // Find first error and scroll validation
      // We use a timeout to let UI update with error states
      setTimeout(() => {
        const firstErrorId = Object.keys(errors)[0]; // Note: errors state might not be updated in this closure if not using refs, but zustand triggers re-render, so let's rely on finding DOM element with aria-invalid="true"
        const errorElement = document.querySelector('[aria-invalid="true"]');
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500">Loading form configuration...</p>
      </div>
    );
  }

  if (schema.length === 0) {
    return <div className="text-center p-8 text-red-500">Failed to load form schema.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-1">
        {schema.map((field) => (
          <motion.div 
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DynamicField field={field} />
          </motion.div>
        ))}
      </div>

      <div className="pt-6 border-t dark:border-gray-700 flex justify-end space-x-4">
        <button
          type="submit"
          className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-blue-200"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Application
        </button>
      </div>
    </form>
  );
};
