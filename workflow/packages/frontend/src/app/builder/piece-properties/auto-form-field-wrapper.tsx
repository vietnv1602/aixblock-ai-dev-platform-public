import {
  DropdownProperty,
  PieceProperty,
  PropertyType,
} from 'workflow-blocks-framework';
import { Action, Trigger } from 'workflow-shared';
import { t } from 'i18next';
import { Calendar, File, SquareFunction } from 'lucide-react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { ArrayPiecePropertyInInlineItemMode } from './array-property-in-inline-item-mode';
import { TextInputWithMentions } from './text-input-with-mentions';

import TrainLinkToMarket from '@/app/components/train-link-to-market';
import { useEmbedding } from '@/components/embed-provider';
import { FormItem, FormLabel } from '@/components/ui/form';
import { ReadMoreDescription } from '@/components/ui/read-more-description';
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type inputNameLiteral = `settings.input.${string}`;

const isInputNameLiteral = (
  inputName: string,
): inputName is inputNameLiteral => {
  return inputName.match(/settings\.input\./) !== null;
};

type AutoFormFieldWrapperProps = {
  children: React.ReactNode;
  allowDynamicValues: boolean;
  propertyName: string;
  property: PieceProperty;
  hideDescription?: boolean;
  placeBeforeLabelText?: boolean;
  disabled: boolean;
  field: ControllerRenderProps;
  inputName: string;
};

const AutoFormFieldWrapper = ({
  placeBeforeLabelText = false,
  children,
  hideDescription,
  allowDynamicValues,
  propertyName,
  inputName,
  property,
  disabled,
  field,
}: AutoFormFieldWrapperProps) => {
  const { embedState } = useEmbedding();
  const params = useParams();
  const form = useFormContext<Action | Trigger>();
  const dynamicInputModeToggled =
    form.getValues().settings?.inputUiInfo?.customizedInputs?.[propertyName] ===
    true;

  function handleChange(mode: boolean) {
    const newCustomizedInputs = {
      ...form.getValues().settings?.inputUiInfo?.customizedInputs,
      [propertyName]: mode,
    };
    form.setValue(
      `settings.inputUiInfo.customizedInputs`,
      newCustomizedInputs,
      {
        shouldValidate: true,
      },
    );
    if (isInputNameLiteral(inputName)) {
      form.setValue(inputName, property.defaultValue ?? null, {
        shouldValidate: true,
      });
    } else {
      throw new Error(
        'inputName is not a member of step settings input, you might be using dynamic properties where you should not',
      );
    }
  }
  const isArrayProperty = property.type === PropertyType.ARRAY;
  const linkToModelMarketplace = (property as DropdownProperty<any, boolean>)
    ?.linkToModelMarketplace;

  return (
    <FormItem className="flex flex-col gap-1">
      <FormLabel className="flex items-center gap-1 ">
        {placeBeforeLabelText && !dynamicInputModeToggled && children}
        {(property.type === PropertyType.FILE ||
          property.type === PropertyType.DATE_TIME) && (
          <Tooltip>
            <TooltipTrigger asChild>
              {property.type === PropertyType.FILE ? (
                <File className="w-4 h-4 stroke-foreground/55"></File>
              ) : (
                property.type === PropertyType.DATE_TIME && (
                  <Calendar className="w-4 h-4 stroke-foreground/55"></Calendar>
                )
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <>
                {property.type === PropertyType.FILE && t('File Input')}
                {property.type === PropertyType.DATE_TIME && t('Date Input')}
              </>
            </TooltipContent>
          </Tooltip>
        )}
        <div className="pt-1">
          <span>{t(property.displayName)}</span>{' '}
          {property.required && <span className="text-destructive">*</span>}
        </div>

        <span className="grow"></span>
        {allowDynamicValues && (
          <div className="flex gap-2 items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={dynamicInputModeToggled}
                  onPressedChange={(e) => handleChange(e)}
                  disabled={disabled}
                >
                  <SquareFunction
                    className={cn('size-5', {
                      'text-foreground': dynamicInputModeToggled,
                      'text-muted-foreground': !dynamicInputModeToggled,
                    })}
                  />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-background">
                {t('Dynamic value')}
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </FormLabel>

      {dynamicInputModeToggled && !isArrayProperty && (
        <TextInputWithMentions
          disabled={disabled}
          onChange={field.onChange}
          initialValue={field.value ?? property.defaultValue ?? null}
        />
      )}

      {isArrayProperty && dynamicInputModeToggled && (
        <ArrayPiecePropertyInInlineItemMode
          disabled={disabled}
          arrayProperties={property.properties}
          inputName={inputName}
          onChange={field.onChange}
          value={field.value ?? property.defaultValue ?? null}
        />
      )}

      {!placeBeforeLabelText && !dynamicInputModeToggled && (
        <div>{children}</div>
      )}
      {property.description && !hideDescription && (
        <ReadMoreDescription text={t(property.description)} />
      )}
      {linkToModelMarketplace && <TrainLinkToMarket property={property} />}
    </FormItem>
  );
};

AutoFormFieldWrapper.displayName = 'AutoFormFieldWrapper';

export { AutoFormFieldWrapper };
