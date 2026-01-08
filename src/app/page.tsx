"use client";

import React from 'react';
import { FormBuilder } from '../components/FormBuilder';
import { useFormStore } from '../store/formStore';
import { X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { showPreview, togglePreview, formData, resetForm } = useFormStore();

  const handleConfirm = () => {
    alert("Form successfully submitted! (Mock)");
    resetForm();
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dynamic Form Assignment
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Rendered from remote JSON schema with custom validation.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8">
          <FormBuilder />
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-blue-600 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Review Submission
                </h2>
                <button 
                  onClick={() => togglePreview(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <dl className="space-y-4">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="flex flex-col border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900 dark:text-white font-medium">
                        {String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3">
                <button
                  onClick={() => togglePreview(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Edit Information
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-lg"
                >
                  Confirm & Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
