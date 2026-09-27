import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import {
  defaultArticleState,
  fontFamilyOptions,
  fontSizeOptions,
  fontColors,
  backgroundColors,
  contentWidthArr,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import type { ArticleStateType } from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (settings: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState(defaultArticleState);
  const panelRef = useRef<HTMLElement>(null);
  const arrowWrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = (): void => {
    setIsOpen((previousIsOpen) => !previousIsOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent): void => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      const isInsidePanel = panelRef.current?.contains(target);
      const isInsideArrow = arrowWrapperRef.current?.contains(target);

      if (!isInsidePanel && !isInsideArrow) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return (): void => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
  };

  const handleReset = (): void => {
    setFormState(defaultArticleState);
    onApply(defaultArticleState);
  };
  return (
    <>
      <div ref={arrowWrapperRef}>
        <ArrowButton isOpen={isOpen} onClick={handleToggle} />
      </div>
      <aside
        ref={panelRef}
        className={clsx(styles.container, { [styles.container_open]: isOpen })}
      >
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h2" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>
          <Select
            title="Шрифт"
            options={fontFamilyOptions}
            selected={formState.fontFamilyOption}
            onChange={(selectedOption) => {
              setFormState((previousState) => ({
                ...previousState,
                fontFamilyOption: selectedOption,
              }));
            }}
          />
          <RadioGroup
            title="Размер шрифта"
            name="fontSize"
            options={fontSizeOptions}
            selected={formState.fontSizeOption}
            onChange={(selectedOption) => {
              setFormState((previousState) => ({
                ...previousState,
                fontSizeOption: selectedOption,
              }));
            }}
          />
          <Select
            title="Цвет шрифта"
            options={fontColors}
            selected={formState.fontColor}
            onChange={(selectedOption) => {
              setFormState((previousState) => ({
                ...previousState,
                fontColor: selectedOption,
              }));
            }}
          />
          <Separator />
          <Select
            title="Цвет фона"
            options={backgroundColors}
            selected={formState.backgroundColor}
            onChange={(selectedOption) => {
              setFormState((previousState) => ({
                ...previousState,
                backgroundColor: selectedOption,
              }));
            }}
          />
          <Select
            title="Ширина контента"
            options={contentWidthArr}
            selected={formState.contentWidth}
            onChange={(selectedOption) => {
              setFormState((previousState) => ({
                ...previousState,
                contentWidth: selectedOption,
              }));
            }}
          />
          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};
