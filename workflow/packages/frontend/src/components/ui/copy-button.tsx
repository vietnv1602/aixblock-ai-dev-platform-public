import { TooltipContentProps } from '@radix-ui/react-tooltip';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

interface CopyButtonProps extends ButtonProps {
  textToCopy: string;
  tooltipSide?: TooltipContentProps['side'];
  withoutTooltip?: boolean;
  tooltipContent?: string | React.ReactNode;
}

export const CopyButton = ({
  textToCopy,
  className,
  tooltipSide,
  withoutTooltip = false,
  tooltipContent,
  ...props
}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const { mutate: copyToClipboard } = useMutation({
    mutationFn: async () => {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    },
    onError: () => {
      toast({
        title: t('Failed to copy to clipboard'),
        duration: 3000,
      });
    },
  });

  if (withoutTooltip) {
    return (
      <Button
        variant="outline"
        size="icon"
        type="button"
        className={className}
        onClick={() => copyToClipboard()}
        {...props}
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className={className}
          onClick={() => copyToClipboard()}
          {...props}
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{tooltipContent ? tooltipContent : t('Copy')}</TooltipContent>
    </Tooltip>
  );
};
