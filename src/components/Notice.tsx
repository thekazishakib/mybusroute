import React from 'react';
import { useT } from '../i18n/useT';

interface NoticeProps {
  children: React.ReactNode;
  langOverride?: 'bn' | 'en';
  testId?: string;
}

export const Notice: React.FC<NoticeProps> = ({
  children,
  langOverride,
  testId,
}) => {
  const { lang } = useT();
  return (
    <div
      className="notice-cream"
      lang={langOverride ?? lang}
      role="status"
      data-testid={testId}
    >
      {children}
    </div>
  );
};
