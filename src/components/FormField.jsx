import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FormField = ({ label, required, error, children, className = '' }) => {
    return (
        <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
            <label className="field-label">
                {label} {required && <span className="required-star">*</span>}
            </label>
            <div className="field-input-container">
                {children}
            </div>
            {error && (
                <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};
