interface WizardFormProps {
  onSubmit: (data: Record<string, unknown>) => void;
  children: React.ReactNode;
}

export default function WizardForm({ onSubmit, children }: WizardFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 데이터 처리
  };

  return (
    <form className="wizard-form" onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
