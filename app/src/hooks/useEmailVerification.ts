
import { EmailService } from 'mdp/lib/email/service';
import { useState, useCallback } from 'react';

interface UseEmailVerificationProps {
  onVerificationSuccess: () => void;
  onVerificationFailure?: () => void;
}

export function useEmailVerification({ onVerificationSuccess, onVerificationFailure }: UseEmailVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const startVerification = useCallback((email: string) => {
    setVerificationEmail(email);
    setIsVerifying(true);
  }, []);

  const handleVerificationComplete = useCallback((success: boolean) => {
    setIsVerifying(false);
    if (success) {
      onVerificationSuccess();
    } else {
      onVerificationFailure?.();
    }
  }, [onVerificationSuccess, onVerificationFailure]);

  const handleSendCode = useCallback(async (): Promise<number> => {
    try {
        const code = Math.floor(1000000 + Math.random() * 9000000);

        await EmailService.sendGeneralEmail(
            {
                name: "Usuário",
                email: verificationEmail
            },
            {
                title: "Código de verificação",
                message: code.toString(),
            }
        )

        return code
    } catch (error) {
      console.error('Erro ao reenviar código:', error);
      return 0
    }
  }, [verificationEmail]);

  return {
    isVerifying,
    verificationEmail,
    startVerification,
    handleVerificationComplete,
    handleSendCode
  };
}