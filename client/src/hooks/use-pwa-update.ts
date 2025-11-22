import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePwaUpdate() {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (needRefresh) {
      toast(t('updateAvailable'), {
        action: {
          label: t('update'),
          onClick: () => updateServiceWorker(true),
        },
        duration: Number.POSITIVE_INFINITY,
      });
    }
  }, [needRefresh, updateServiceWorker, t]);
}
