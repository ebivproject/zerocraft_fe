interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  steps,
}: StepIndicatorProps) {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index + 1 <= currentStep ? "active" : ""}`}
        >
          <span className="step-number">{index + 1}</span>
          <span className="step-label">{step}</span>
        </div>
      ))}
    </div>
  );
}
