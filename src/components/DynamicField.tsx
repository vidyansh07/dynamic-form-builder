import React from 'react';
import { SchemaField } from '../types/schema';
import { useFormStore } from '../store/formStore';
import { AlertCircle, Calendar, Check, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  field: SchemaField;
}

export const DynamicField: React.FC<Props> = ({ field }) => {
  const { formData, errors, setFieldValue } = useFormStore();
  
  // Handle conditional visibility
  if (field.dependsOn) {
    const dependencyValue = formData[field.dependsOn.field];
    if (dependencyValue !== field.dependsOn.value) {
      return null;
    }
  }

  const value = formData[field.id] ?? '';
  const error = errors[field.id];

  const baseInputStyles = clsx(
    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-200",
    "bg-white dark:bg-gray-800 dark:text-white",
    error
      ? "border-red-500 focus:ring-red-200"
      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900"
  );

  const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  const renderInput = () => {
    switch (field.type) {
      case 'select':
        return (
          <div className="relative">
            <select
              id={field.id}
              value={String(value)}
              onChange={(e) => setFieldValue(field.id, e.target.value)}
              className={clsx(baseInputStyles, "appearance-none cursor-pointer")}
              aria-invalid={!!error}
              aria-label={field.label}
            >
              <option value="" disabled>Select an option</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className={clsx(
              "w-5 h-5 border rounded flex items-center justify-center transition-colors",
              value ? "bg-blue-600 border-blue-600" : "border-gray-400 dark:border-gray-500",
              error && "border-red-500"
            )}>
              {value && <Check className="w-3 h-3 text-white" />}
            </div>
            <input
              type="checkbox"
              id={field.id}
              checked={Boolean(value)}
              onChange={(e) => setFieldValue(field.id, e.target.checked)}
              className="hidden"
              aria-invalid={!!error}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </span>
          </label>
        );

      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              id={field.id}
              value={String(value)}
              onChange={(e) => setFieldValue(field.id, e.target.value)}
              className={baseInputStyles}
              aria-invalid={!!error}
            />
            {!value && <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />}
          </div>
        );

      default: // text, number
        return (
          <input
            type={field.type}
            id={field.id}
            value={String(value)}
            onChange={(e) => setFieldValue(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={field.placeholder}
            className={baseInputStyles}
            aria-invalid={!!error}
            aria-label={field.label}
          />
        );
    }
  };

  return (
    <div className="flex flex-col">
      {field.type !== 'checkbox' && (
        <label htmlFor={field.id} className={labelStyles}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center mt-1 text-sm text-red-500"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
