
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, RotateCcw, MailCheck } from 'lucide-react';
import { Spinner } from './ui/spinner';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: (success: boolean) => void;
  onResendCode: () => Promise<number>;
  className?: string;
}

export default function EmailVerification({
  email,
  onVerificationComplete,
  onResendCode,
  className = ''
}: EmailVerificationProps) {
  const [code, setCode] = useState<string[]>(Array(5).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [generatedCode, setGeneratedCode] = useState<number | null>(null);

    useEffect(() => {
    const fetchCode = async () => {
        const code = await onResendCode();
        setGeneratedCode(code);
    };

    fetchCode();
    }, []);

  // Countdown para reenvio
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // Iniciar countdown de 30 segundos
  const startCountdown = useCallback(() => {
    setCanResend(false);
    setCountdown(30);
  }, []);

  // Focar próximo input
  const focusNextInput = (index: number) => {
    if (index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Focar input anterior
  const focusPrevInput = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // handle mudança de input
  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 4) {
      focusNextInput(index);
    }

    // Verificar se todos os dígitos foram preenchidos
    if (newCode.every(digit => digit !== '') && index === 4) {
      verifyCode(newCode.join(''));
    }
  };

  // handle teclas
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      focusPrevInput(index);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusPrevInput(index);
    } else if (e.key === 'ArrowRight' && index < 4) {
      focusNextInput(index);
    }
  };

  // Colar código
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 5);
    
    if (/^\d{5}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      setError('');
      verifyCode(pastedData);
    }
  };

  // Verificar código
  const verifyCode = async (enteredCode: string) => {
    if (enteredCode !== generatedCode?.toString()) {
      setError('Código inválido. Tente novamente.');
      setCode(Array(5).fill(''));
      inputRefs.current[0]?.focus();
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      onVerificationComplete(true);
    } catch (err) {
      setError('Erro na verificação. Tente novamente.');
      onVerificationComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError('');
    setCode(Array(5).fill(''));
    
    try {
      const code = await onResendCode();
      if (code !== 0) {
        setGeneratedCode(code)
        startCountdown()
        setError('')
        inputRefs.current[0]?.focus()
      } else {
        setError('Erro ao reenviar código. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao reenviar código.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resetar verificação
  const handleReset = async () => {
    setCode(Array(5).fill(''));
    setError('');
    setSuccess(false);
    const newCode = await onResendCode()
    
    if(newCode !== 0) {
        setGeneratedCode(newCode)
        startCountdown()
        inputRefs.current[0]?.focus()
    }
  };

  useEffect(() => {
    startCountdown();
    inputRefs.current[0]?.focus();
  }, [startCountdown]);

  if (success) {
    return (
      <div className={`bg-transparent border border-green-600 rounded-xl p-6 text-center ${className}`}>
        <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <MailCheck className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-400 mb-2">
          Email Verificado!
        </h3>
        <p className="text-green-300">
          Seu email {email} foi verificado com sucesso.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <MailCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
          Verificação de Email
        </h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Um código de 5 dígitos foi enviado para <strong>{email}</strong>
        </p>
      </div>

      <div className="bg-transparent border border-yellow-600 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <X className="w-5 h-5 text-yellow-400 mt-0.5" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-500">
              <strong>Não recarregue a página!</strong> O código não será salvo e você precisará começar novamente.
            </p>
          </div>
        </div>
      </div>

      {/* inputs */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-3">
          Digite o código de 5 dígitos:
        </label>
        <div className="flex justify-center space-x-2" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className="w-12 h-12 text-center text-xl font-semibold border border-[hal(var(--border))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))]  disabled:opacity-50 disabled:cursor-not-allowed"
            />
          ))}
        </div>
      </div>

      {/* msg erro */}
      {error && (
        <div className="bg-transparent border border-red-400 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* btn reenvio */}
      <div className="text-center">
        <button
          onClick={handleResendCode}
          disabled={!canResend || isLoading}
          className="inline-flex items-center text-sm text-[hsl(var(--mured--foreground))] hover:text-[hsl(var(--primary))] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          {canResend ? 'Reenviar código' : `Reenviar em ${countdown}s`}
        </button>
      </div>

      {isLoading && (
        <Spinner />
      )}
    </div>
  );
}
