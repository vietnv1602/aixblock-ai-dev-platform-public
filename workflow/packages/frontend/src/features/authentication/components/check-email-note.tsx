import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { MailCheck } from 'lucide-react';

import { INTERNAL_ERROR_TOAST, toast } from '@/components/ui/use-toast';
import { authenticationApi } from '@/lib/authentication-api';
import { CreateOtpRequestBody, OtpType } from 'workflow-axb-shared';

const CheckEmailNote = ({ email, type }: CreateOtpRequestBody) => {
  const { mutate: resendVerification } = useMutation({
    mutationFn: authenticationApi.sendOtpEmail,
    onSuccess: () => {
      toast({
        title: t('Success'),
        description:
          type === OtpType.EMAIL_VERIFICATION
            ? t('Verification resent')
            : t('Password reset link resent'),
      });
    },
    onError: (error) => {
      toast(INTERNAL_ERROR_TOAST);
      console.error(error);
    },
  });
  return (
    <div className="gap-2 w-full flex flex-col">
      <div className="gap-4 w-full flex flex-row items-center justify-center">
        <MailCheck className="w-16 h-16" />
        <span className="text-left w-fit">
          {type === OtpType.EMAIL_VERIFICATION
            ? t(
                'We sent you a link to complete your registration, check your email.',
              )
            : t('We sent you a link to reset your password, check your email of this account.')}
          <strong>{email}</strong>.
        </span>
      </div>
      <div className="flex flex-row gap-1">
        {t("Didn't receive an email?")}
        <button
          className="cursor-pointer text-primary underline"
          onClick={() =>
            resendVerification({
              email,
              type,
            })
          }
        >
          {t('Resend')}
        </button>
      </div>
    </div>
  );
};

CheckEmailNote.displayName = 'CheckEmailNote';
export { CheckEmailNote };
