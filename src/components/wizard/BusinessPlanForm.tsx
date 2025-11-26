"use client";

import { useState, useEffect } from "react";
import {
  BusinessPlanInput,
  INPUT_FIELDS,
  INPUT_SECTIONS,
  INITIAL_INPUT,
} from "@/types/businessPlan";
import styles from "./BusinessPlanForm.module.css";

export interface BusinessPlanFormProps {
  onComplete: (data: BusinessPlanInput) => void;
  initialData?: BusinessPlanInput;
}

export default function BusinessPlanForm({
  onComplete,
  initialData,
}: BusinessPlanFormProps) {
  const [formData, setFormData] = useState<BusinessPlanInput>(
    initialData || INITIAL_INPUT
  );
  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BusinessPlanInput, string>>
  >({});

  // initialData가 변경되면 formData 업데이트
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const currentSectionName = INPUT_SECTIONS[currentSection];
  const currentFields = INPUT_FIELDS.filter(
    (f) => f.section === currentSectionName
  );

  const handleChange = (key: keyof BusinessPlanInput, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateCurrentSection = () => {
    const newErrors: Partial<Record<keyof BusinessPlanInput, string>> = {};
    let isValid = true;

    currentFields.forEach((field) => {
      if (field.required && !formData[field.key].trim()) {
        newErrors[field.key] = `${field.label}을(를) 입력해주세요.`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      if (currentSection < INPUT_SECTIONS.length - 1) {
        setCurrentSection((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    if (validateCurrentSection()) {
      onComplete(formData);
    }
  };

  const getProgress = () => {
    const totalFields = INPUT_FIELDS.filter((f) => f.required).length;
    const filledFields = INPUT_FIELDS.filter(
      (f) => f.required && formData[f.key].trim()
    ).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <div className={styles.formContainer}>
      {/* Progress Header */}
      <div className={styles.progressHeader}>
        <div className={styles.progressInfo}>
          <span className={styles.progressText}>
            {currentSection + 1} / {INPUT_SECTIONS.length} 단계
          </span>
          <span className={styles.progressPercent}>{getProgress()}% 완료</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${((currentSection + 1) / INPUT_SECTIONS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Section Navigation */}
      <div className={styles.sectionNav}>
        {INPUT_SECTIONS.map((section, index) => (
          <button
            key={section}
            className={`${styles.sectionTab} ${
              index === currentSection ? styles.active : ""
            } ${index < currentSection ? styles.completed : ""}`}
            onClick={() => index <= currentSection && setCurrentSection(index)}
            disabled={index > currentSection}
          >
            <span className={styles.sectionNumber}>{index + 1}</span>
            <span className={styles.sectionName}>{section}</span>
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>{currentSectionName}</h2>

        <div className={styles.fieldsGrid}>
          {currentFields.map((field) => (
            <div
              key={field.key}
              className={`${styles.fieldWrapper} ${
                field.multiline ? styles.fullWidth : ""
              }`}
            >
              <label className={styles.label}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </label>
              {field.multiline ? (
                <textarea
                  className={`${styles.textarea} ${
                    errors[field.key] ? styles.error : ""
                  }`}
                  placeholder={field.placeholder}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={5}
                />
              ) : (
                <input
                  type="text"
                  className={`${styles.input} ${
                    errors[field.key] ? styles.error : ""
                  }`}
                  placeholder={field.placeholder}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
              {errors[field.key] && (
                <span className={styles.errorMessage}>{errors[field.key]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigation}>
        <button
          className={styles.prevButton}
          onClick={handlePrev}
          disabled={currentSection === 0}
        >
          <ArrowLeftIcon />
          이전
        </button>

        {currentSection < INPUT_SECTIONS.length - 1 ? (
          <button className={styles.nextButton} onClick={handleNext}>
            다음
            <ArrowRightIcon />
          </button>
        ) : (
          <button className={styles.submitButton} onClick={handleSubmit}>
            <DocumentIcon />
            미리보기 확인
          </button>
        )}
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className={styles.spinner}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
