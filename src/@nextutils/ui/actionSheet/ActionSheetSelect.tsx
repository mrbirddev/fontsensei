import ReactSelect, {type ActionMeta} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useIsMobileWidth from "@nextutils/ui/useIsMobileWidth";
import useActionSheetStore from "@nextutils/ui/actionSheet/useActionSheetStore";
import ActionSheetWrapper from "@nextutils/ui/actionSheet/ActionSheetWrapper";
import {cx} from "@emotion/css";
import React, {CSSProperties, HTMLAttributes, ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {FaXmark} from "react-icons/fa6";
import AsyncSelect from "react-select/async";
import {produce} from "immer";
import invariant from "tiny-invariant";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {useResizeObserver} from "usehooks-ts";

const FormattedOption = (props: {
  parentProps: Parameters<typeof CreatableSelect>[0],
  data: {
    label?: string, value: string,
  } | null,
  context: "menu" | "value" | "create",
  inputValue?: string,
}) => {
  const {components, formatCreateLabel, formatOptionLabel, placeholder} = props.parentProps;
  const Option = components?.Option;

  if (!props.data) {
    return <span className="text-slate-400">{placeholder ?? "(None)"}</span>;
  }

  const { context, inputValue, data } = props;
  const { value, label } = data;
  let labelNode: ReactNode;
  if (context === "create") {
    labelNode = formatCreateLabel
      ? formatCreateLabel(inputValue ?? "")
      : `Create ${inputValue}`;
  } else {
    labelNode = formatOptionLabel
      ? formatOptionLabel(data, {
        context: context,
        inputValue: inputValue ?? "",
        selectValue: [data],
      })
      : label;
  }

  const formatted = Option
    // @ts-expect-error manually tested the required props
    ? <Option
      data={{label: labelNode, value: value}}
      getStyles={() => ({})}
      getClassNames={() => ""}
      cx={cx} />
    : labelNode;

  return formatted;
}

const SelectButton = (props: {
  parentProps: Parameters<typeof ReactSelect>[0],
  onClick: () => void
}) => {
  const parentProps = props.parentProps;
  const {isClearable, isMulti} = parentProps;

  // casting
  const selectedOptionSingle = !isMulti
    ? (parentProps.value as {label?: string, value: string} | null)
    : null;
  const selectedOptionMulti = !isMulti
    ? null
    : (parentProps.value as {label?: string, value: string}[] | null);
  const onChangeSingle = parentProps.onChange as unknown as (value: object | null, actionMeta: ActionMeta<unknown>) => void;
  const onChangeMulti = parentProps.onChange as unknown as (value: object[] | null, actionMeta: ActionMeta<unknown>) => void;

  return <div className="relative cursor-pointer bg-white border border-slate-500 rounded p-2 min-h-[2.5rem]" onClick={() => {
    props.onClick();
  }}>
    {!isMulti
      ? <span><FormattedOption parentProps={props.parentProps} data={selectedOptionSingle} context="menu" /></span>
      : <div className="flex flex-wrap items-center justify-start gap-2">
        {selectedOptionMulti?.map(o =>
          <span key={o.value}><FormattedOption parentProps={props.parentProps} data={o} context="menu" /></span>)}
      </div>
    }

    {isClearable &&  <div className={cx(
      "absolute top-0 right-0 bottom-0",
      "flex items-center justify-center",
    )}>
      {!isMulti && selectedOptionSingle && <div className={cx(
        "btn btn-ghost btn-sm"
      )} onClick={(e) => {
        e.stopPropagation();
        onChangeSingle?.(null, {
          action: "clear",
          removedValues: [selectedOptionSingle],
        });
      }}>
        <FaXmark className="text-slate-500" />
      </div>}
      {isMulti && !!selectedOptionMulti?.length && <div className={cx(
        "btn btn-ghost btn-sm"
      )} onClick={(e) => {
        e.stopPropagation();
        onChangeMulti?.([], {
          action: "clear",
          removedValues: selectedOptionMulti,
        });
      }}>
        <FaXmark className="text-slate-500" />
      </div>}
    </div>}
  </div>;
};

const MenuListItem = (props: {
  parentProps: Parameters<typeof AsyncSelect>[0];
  option: {label?: string, value: string},
  style?: CSSProperties,
  className?: string;
  onClick?: HTMLAttributes<HTMLDivElement>["onClick"],
  removeClassName?: string;
  onRemoveClick?: HTMLAttributes<HTMLDivElement>["onClick"];
}) => {
  const {parentProps, option, style} = props;
  const {isMulti} = parentProps;
  return <div className="join"  key={option.value} style={style}>
    <div className={cx(
      "join-item",
      "btn btn-sm",
      "animate-none transition-none",
      props.className,
    )} onClick={props.onClick}>
      <FormattedOption parentProps={parentProps} data={option} context="value" />
    </div>
    {isMulti && <div
      className={cx(
        "join-item",
        "btn btn-sm",
        "animate-none transition-none",
        props.removeClassName,
      )}
      onClick={props.onRemoveClick}
    ><FaXmark /></div>}
  </div>;
};

const MenuListActionSheet = (props: {
  parentProps: Parameters<typeof AsyncSelect>[0];
  isCreatable?: boolean,
  isAsync?: boolean,
}) => {
  const [filterText, setFilterText] = React.useState('');
  const parentProps = props.parentProps;
  const isMulti = parentProps.isMulti;

  // casting
  const selectedOptionSingle = isMulti
    ? (parentProps.value as {label?: string, value: string} | null)
    : null;
  const selectedOptionMulti = isMulti
    ? (parentProps.value as {label?: string, value: string}[] | null)
    : null;
  const onChangeSingle = parentProps.onChange as unknown as (value: object | null, actionMeta: ActionMeta<unknown>) => void;
  const onChangeMulti = parentProps.onChange as unknown as (value: object[] | null, actionMeta: ActionMeta<unknown>) => void;

  const {initialOptions, filterOptions} = useMemo(() => {
    // casting
    const options = parentProps.options as unknown as ({label?: string, value: string}[] | undefined);
    const defaultOptions = parentProps.defaultOptions as unknown as ({label?: string, value: string}[] | undefined);
    const loadOptions = parentProps.loadOptions as unknown as ((inputValue: string) => Promise<{label?: string, value: string}[]>) | undefined;

    const initialOptions = (options ? options : (defaultOptions ?? []));

    const filterOptions: (inputValue: string) => Promise<{label?: string, value: string}[]> = (options
        ? (async (inputValue: string) => (options ?? [])
          .filter((option) =>
            !! option.label?.toLowerCase().includes(inputValue.toLowerCase())
            || !!option.value?.toLowerCase().includes(inputValue.toLowerCase())
          ))
        : (inputValue) => {
          if (!inputValue) {
            return Promise.resolve(initialOptions);
          }
          invariant(loadOptions);
          return loadOptions(inputValue);
        }
    );

    return {
      initialOptions: initialOptions as unknown as {label?: string, value: string}[],
      filterOptions: filterOptions,
    }
  }, [parentProps.options, parentProps.defaultOptions, parentProps.loadOptions]);

  const [filteredOptions, setFilteredOptions] = useState(initialOptions);

  useEffect(() => {
    void filterOptions(filterText).then(setFilteredOptions);
  }, [filterOptions, filterText]);

  const [multiCache, setMultiCache] = useState(selectedOptionMulti ?? []);
  const removeOptionCache = (option: {label?: string, value: string}) => {
    setMultiCache(prev => {
      return produce(prev,draft => {
        const index = draft.findIndex(o => o.value === option.value);
        if (index > -1) {
          draft.splice(index, 1);
        }
      });
    })
  };
  const addOptionCache = (option: {label?: string, value: string}) => {
    setMultiCache(prev => {
      return produce(prev,draft => {
        const index = draft.findIndex(o => o.value === option.value);
        if (index === -1) {
          draft.push(option);
        }
      });
    })
  };

  useEffect(() => {
    if (!isMulti) {
      return;
    }
    onChangeMulti?.(multiCache, {
      action: "select-option", // TODO settle for this, no usage for action now
      option: multiCache,
    });
  }, [isMulti, onChangeMulti, multiCache]);

  const [topSection, setTopSection] = useState<HTMLDivElement | null>(null);

  const [topSectionHeight, setTopSectionHeight] = useState(0);
  useResizeObserver({
    ref: {
      current: topSection,
    },
    box: "border-box",
    onResize: (size) => setTopSectionHeight(size.height ?? 0),
  });

  // console.log({topSectionHeight, topSection});

  return (
    <ActionSheetWrapper>
      <div
        ref={(el) => setTopSection(el)}
      >
        {(!!props.isAsync || !!props.isCreatable) && <div className="relative">
          <input
              className={cx("input input-sm w-full border border-slate-500")}
              type="text"
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
              }}
          />
          {parentProps.placeholder && !filterText && <div className="absolute inset-0 px-3 flex items-center justify-start text-slate-500 pointer-events-none">
            {parentProps.placeholder}
          </div>}
        </div>}

        {props.isCreatable && filterText && <div className="btn btn-sm btn-outline w-full mt-2" onClick={() => {
          const created = {
            label: filterText,
            value: filterText,
          };
          if (!isMulti) {
            onChangeSingle(created, {
              action: "create-option",
              option: created,
            });
            useActionSheetStore.getState().pop();
          } else {
            addOptionCache(created);
          }
        }}>
            <FormattedOption
              parentProps={parentProps}
              data={{label: filterText, value: filterText}}
              context="create"
              inputValue={filterText}
            />
        </div>}

        {(!!props.isAsync || !!props.isCreatable) && <div className="mt-4 border-t border-slate-400 h-[1rem]" />}
      </div>

      {!!topSectionHeight && <div className={cx(
        "overflow-y-auto",
        "absolute inset-0 px-3",
        // to work on desktop, where the modal height is not fixed hence we cannot use absolute
        "md:static md:h-[18rem] md:px-0",
      )} style={{
        top: topSectionHeight,
      }}>
        {props.isAsync && <AutoSizer>
          {({ height, width }) => (
            <List
              className="List"
              height={height}
              itemCount={filteredOptions.length}
              itemSize={40}
              width={width}
            >
              {(props, context) => {
                const option = filteredOptions[props.index]!;
                const isActive = !isMulti
                  ? selectedOptionSingle?.value === option.value
                  : multiCache.map(o => o.value).includes(option.value);

                return <MenuListItem
                  key={option.value}
                  parentProps={parentProps}
                  option={option}
                  style={props.style}
                  className={cx(
                    isActive ? "btn-primary" : "btn-outline",
                  )}
                  onClick={() => {
                    if (!isMulti) {
                      onChangeSingle(option, {
                        action: "select-option",
                        option: option,
                      });
                      useActionSheetStore.getState().pop();
                    } else {
                      addOptionCache(option);
                    }
                  }}
                  removeClassName={cx(
                    isActive ? "btn-primary" : "btn-outline",
                  )}
                  onRemoveClick={(e) => {
                    removeOptionCache(option);
                    e.stopPropagation();
                  }}
                />;
              }}
            </List>
          )}
        </AutoSizer>}
        {!props.isAsync && <div className="flex flex-wrap items-start justify-start gap-2" >
          {filteredOptions.map((option, index) => {
            const isActive = !isMulti
              ? selectedOptionSingle?.value === option.value
              : multiCache.map(o => o.value).includes(option.value);

            return <MenuListItem
              key={option.value}
              parentProps={parentProps}
              option={option}
              className={cx(
                isActive ? "btn-primary" : "btn-outline",
              )}
              onClick={() => {
                if (!isMulti) {
                  onChangeSingle(option, {
                    action: "select-option",
                    option: option,
                  });
                  useActionSheetStore.getState().pop();
                } else {
                  addOptionCache(option);
                }
              }}
              removeClassName={cx(
                isActive ? "btn-primary" : "btn-outline",
              )}
              onRemoveClick={(e) => {
                removeOptionCache(option);
                e.stopPropagation();
              }}
            />;
          })}
        </div>}
      </div>}
    </ActionSheetWrapper>
  );
};

const ActionSheetSelect: typeof ReactSelect = (props) => {
  const isMobileWidth = useIsMobileWidth();

  if (isMobileWidth) {
    const p = props as unknown as Parameters<ReactSelect>[0];
    return <SelectButton parentProps={p} onClick={() => {
      useActionSheetStore.getState().push(
        <MenuListActionSheet parentProps={p} />
      );
    }} />;
  }

  return <ReactSelect {...props} />;
};

export default ActionSheetSelect;

export const ActionSheetCreatableSelect: typeof CreatableSelect = (props) => {
  const isMobileWidth = useIsMobileWidth();

  if (isMobileWidth) {
    const p = props as unknown as Parameters<CreatableSelect>[0];
    return <SelectButton parentProps={p} onClick={() => {
      useActionSheetStore.getState().push(
        <MenuListActionSheet parentProps={p} isCreatable={true} />
      );
    }} />;
  }

  return <CreatableSelect {...props} />;
};

export const ActionSheetAsyncSelect: typeof AsyncSelect = (props) => {
  const isMobileWidth = useIsMobileWidth();

  if (
    isMobileWidth
    || props.loadOptions // need to use the virtualized select in MenuListActionSheet
  ) {
    const p = props as unknown as Parameters<AsyncSelect>[0];
    return <SelectButton parentProps={p} onClick={() => {
      useActionSheetStore.getState().push(
        <MenuListActionSheet parentProps={p} isAsync={true} />
      );
    }} />;
  }

  return <AsyncSelect {...props} />;
};
