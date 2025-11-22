import type { Step } from '@chef-assistant/shared';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

type RecipeStepsTabProps = {
  steps: Step[];
};

export function RecipeStepsTab({ steps }: RecipeStepsTabProps) {
  const { t } = useTranslation();
  const [doneStepIds, setDoneStepIds] = useState<Set<string>>(() => new Set());

  const toggleStepDone = useCallback((stepId: string) => {
    setDoneStepIds((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  }, []);

  if (steps.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">{t('noRecipes')}</p>;
  }

  return (
    <ol className="space-y-5 py-5">
      {steps.map((step) => {
        const isDone = doneStepIds.has(step.id);
        return (
          <li
            key={step.id}
            role="button"
            tabIndex={0}
            onClick={() => toggleStepDone(step.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleStepDone(step.id);
              }
            }}
            className="flex gap-4 cursor-pointer select-none rounded-lg py-1 -mx-1 hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm transition-opacity ${
                isDone ? 'bg-muted-foreground/30 text-muted-foreground line-through' : 'bg-primary text-primary-foreground'
              }`}
            >
              {step.order}
            </span>
            <p className={`text-sm leading-relaxed pt-1 flex-1 ${isDone ? 'line-through text-muted-foreground' : 'text-foreground/90'}`}>
              {step.text}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
