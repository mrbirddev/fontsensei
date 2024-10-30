import React, { useEffect, useRef} from "react";
import {useI18n, useScopedI18n} from "@nextutils/locales";
import {useForm} from "react-hook-form";
import {
  isValidEmail,
  ModalButtons,
  ModalInlineRadio,
  ModalInput,
  ModalTextarea,
  ModalTitle
} from "@fontsensei/components/modal/commonComponents";
import {type Emotion, emotionEmoji, emotionList} from "../../shared/emotion";
import useFeedbackStore from "./useFeedbackStore";

type Inputs = {
  email: string
  content: string
  emotion: Emotion | undefined
};

const FeedbackModal = (props: {
  initialContent: string;
  isOpen: boolean,
  setOpen: (o: boolean) => void,
  next: (data: Inputs) => void,
}) => {
  const tFeedback = useScopedI18n('feedback');
  const t = useI18n();

  const options = useFeedbackStore(s => s.options);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: {errors, isValidating},
  } = useForm<Inputs>({
    defaultValues: {
      email: undefined,
      content: props.initialContent,
      emotion: undefined,
    }
  });

  // remove the ref https://stackoverflow.com/a/68818397/1922857
  const {ref: _, ...regEmotion} = register('emotion');

  const {ref: emailRefFn, ...regEmail} = register("email", { validate: (value, formValues) => {
      if (!value) {
        return t("form.Please enter a valid email address");
      }
      if (!isValidEmail(value)) {
        return t("form.Please enter a valid email address");
      }
      return true;
  }});

  const {ref: contentRefFn, ...regContent} = register("content", {
    validate: async (value, formValues) => {
      if (!value) {
        return t("form.This field cannot be empty");
      }
      return true;
    }
  });

  const emailInputRef = useRef(null as HTMLInputElement | null);
  const contentInputRef = useRef(null as HTMLTextAreaElement | null);
  useEffect(() => {
    if (!props.isOpen) {
      return;
    }

    if (emailInputRef.current) {
      emailInputRef.current.focus();
      return;
    }
    
    if (contentInputRef.current) {
      contentInputRef.current.focus();
      return;
    }
  }, [props.isOpen]);

  return (
    <dialog id="my_modal_1" className={"modal " + (props.isOpen ? 'modal-open' : '')}>
      <div className="modal-box text-grey-700">
        <ModalTitle>{options?.title ?? tFeedback('Feedback')}</ModalTitle>

        <ModalInput
          inputProps={{
            ...regEmail,
            ref: (el) => {
              emailInputRef.current = el;
              return emailRefFn(el);
            },
            placeholder: tFeedback("Your email"),
          }}
        />

        <ModalTextarea
          label={options?.desc}
          textareaProps={{
            ...regContent,
            ref: (el) => {
              contentInputRef.current = el;
              return contentRefFn(el);
            },
            placeholder: options?.placeholder ?? tFeedback("Your feedback"),
            rows: 5,
            className: "outline-none text-lg block flex-1 border-0 bg-transparent p-2 text-grey-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6",
          }}
          error={errors.content}
        />

        <ModalButtons
          linePrefix={
          <div className="flex-1">
            <ModalInlineRadio
              options={emotionList.map(emo => {
                return {
                  label: <span className="text-2xl">{emotionEmoji[emo]}</span>,
                  value: emo,
                };
              })}

              controllerProps={{
                control,
                ...regEmotion
              }}
            />
          </div>}

          onConfirm={() => {
            void handleSubmit((data) => {
              props.next(data);
            })();
          }}
          confirmChildren={isValidating ? <span className="loading loading-bars loading-xs" /> : undefined}
          confirmProps={{
            disabled: isValidating,
          }}
          onCancel={() => {
            props.setOpen(false);
          }}/>
      </div>
    </dialog>
  );
}

export default FeedbackModal;
