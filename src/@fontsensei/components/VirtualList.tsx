import React, {type CSSProperties, forwardRef, useContext, useEffect, useMemo, useState} from "react";
import {type FSFontItem} from "@fontsensei/core/types";
import listFonts from "@fontsensei/core/listFonts";
import {type TagValueMsgLabelType, useScopedI18n} from "@fontsensei/locales";
import {throttle} from "lodash-es";
import {GoogleFontHeaders} from "@fontsensei/components/GoogleFontHeaders";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeList as List} from "react-window";
import {cx} from "@emotion/css";
import {FaPlus, FaXmark} from "react-icons/fa6";
import {FontPickerPageContext} from "@fontsensei/components/fontPickerCommon";
import {PRODUCT_NAME} from "../../browser/productConstants";

const ITEM_HEIGHT = 140;
const ITEM_HEIGHT_CLS = 'h-[140px]';

// add a function onOuterWheel to window typing
declare global {
  interface Window {
    onOuterWheel?: (el: HTMLDivElement | null) => void;
  }
}

type RowProps = {
  index: number,
  style: CSSProperties,
  fontItem?: FSFontItem,
  text: string,
  onWheel?: (event: React.WheelEvent<HTMLDivElement>) => void,
  forwardedRef: React.Ref<HTMLDivElement>
};

const Row = ({index, style, fontItem, text, onWheel, forwardedRef}: RowProps) => {
  const tTagValueMsg = useScopedI18n('tagValueMsg');
  const pageCtx = useContext(FontPickerPageContext);

  if (!fontItem || (fontItem?.family === 'LOADING')) {
    return <div
      key="LOADING"
      className={cx(
        ITEM_HEIGHT_CLS,
        "overflow-hidden"
      )}
      style={style}
      onWheel={onWheel}
      ref={forwardedRef}
      data-itemindex={index}
    >
      <div className="text-center">
        <span className="loading loading-bars" />
      </div>
    </div>;
  }

  if (fontItem?.family === 'THE_END') {
    return <div
      key="END"
      className={cx(
        ITEM_HEIGHT_CLS,
        "overflow-hidden"
      )}
      style={style}
      onWheel={onWheel}
      ref={forwardedRef}
      data-itemindex={index}
    >
      <div className="text-center">
        THE END
      </div>
    </div>
  }

  return <div
    key={fontItem.family}
    className={cx(
      ITEM_HEIGHT_CLS,
      "overflow-hidden rounded-2xl",
      "hover:shadow-xl hover:bg-white/30",
      "p-2"
    )}
    style={style}
    onWheel={onWheel}
    ref={forwardedRef}
    data-itemindex={index}
  >
    <div
      className="h-full w-full"
    >
      <div
        className={cx(
          "text-xl",
          "flex items-center justify-start gap-1 mb-2"
        )}
        style={{whiteSpace: 'nowrap', overflow: 'auto hidden'}}
      >
        <span>
          #{index + 1}
        </span>
        <span className="font-bold badge badge-neutral badge-lg">
          {fontItem.family}
        </span>
        {pageCtx?.onAddTag && <span
            className="badge badge-ghost bg-white/30 hover:bg-white/70"
            onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            pageCtx?.onAddTag?.(fontItem.family);
          }}>
            <FaPlus />
        </span>}
        {fontItem.tags.map((tag) => {
          return <span key={tag} className="badge badge-ghost bg-white/30">
            {tTagValueMsg(tag as TagValueMsgLabelType)}
            {pageCtx?.onRemoveTag && <span className="hover:bg-white/70" onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              pageCtx?.onRemoveTag?.(fontItem.family);
            }}>
              <FaXmark />
            </span>}
          </span>;
        })}
      </div>
      <div
        className="text-4xl rounded px-2 "
        style={{
          fontFamily: `"${fontItem.family}"`,
          whiteSpace: 'nowrap',
          overflow: 'auto hidden'
        }}
      >
        {text}
      </div>
      {pageCtx?.Toolbar?.({fontItem}) ?? false}
    </div>
  </div>;
};

const RefForwardedRow = React.forwardRef<HTMLDivElement, Omit<RowProps, 'forwardedRef'>>((props, ref) => (
  <Row {...props} forwardedRef={ref}/>
));

const createOuterElementType = forwardRef<HTMLDivElement>((props, ref) => (
  <div
    id="outer"
    ref={ref}
    onWheel={(e) => window.onOuterWheel?.(e.currentTarget)}
    {...props}
  />
));

const VirtualList = ({
  tagValue,
  filterText,
  initialFontItemList,
  pageSize,
}: { tagValue: string, initialFontItemList: FSFontItem[], pageSize: number, filterText: string }) => {
  const [list, setList] = useState([
    ...initialFontItemList,
    {
      family: 'LOADING',
      tags: [],
    } as unknown as FSFontItem
  ]);

  useEffect(() => {
    void listFonts({
      filterText,
      tagValue,
      skip: 0,
      take: 10000,
    }).then(res => {
      setList([
        ...res,
        {
          family: 'THE_END',
          tags: [],
        } as unknown as FSFontItem
      ]);
    });
  }, [tagValue, filterText, initialFontItemList]);

  const [configList, setConfigList] = useState([] as { name: string, text?: string }[]);

  const tProduct = useScopedI18n('product');
  const lorem = tProduct('description', {productName: PRODUCT_NAME});
  const [text, setText] = useState(lorem);
  useEffect(() => {
    setText(lorem);
  }, [lorem]);

  useEffect(() => {
    // throttle makes more sense because the user may be scrolling
    // continously & slowly. debounce will never trigger.
    const delayedUpdate = throttle((start, count) => {
      setConfigList(
        list.slice(
          start,
          start + count,
        ).map(fontItem => ({name: fontItem.family, text: text})),
      );
    }, 1000);
    window.onOuterWheel = (el) => {
      if (!el) {
        return;
      }

      const visibleRowIndex = el.scrollTop / ITEM_HEIGHT;
      const totalHeight = el.clientHeight;
      const numberOfItemsVisible = totalHeight / ITEM_HEIGHT;
      const start = Math.floor(visibleRowIndex);
      const count = Math.ceil(numberOfItemsVisible) + 1;

      delayedUpdate(start, count);
    }

    window.onOuterWheel(
      document.querySelector('#outer')
    );
  }, [list, text]);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return <>
    <GoogleFontHeaders preConnect={false} configList={configList} strategy="block"/>
    {!isClient && <div>
      {initialFontItemList.map((fontItem) => (
        <Row
          key={fontItem.family}
          index={list.indexOf(fontItem)}
          fontItem={fontItem}
          text={text}
          style={{}}
          forwardedRef={() => void 0}
        />
      ))}
    </div>}
    {isClient && <AutoSizer>
      {({height, width}) => (
        <List
          className="List"
          outerElementType={createOuterElementType}
          height={height}
          width={width}
          itemCount={list.length}
          itemSize={ITEM_HEIGHT}
        >
          {(props) => <RefForwardedRow {...props} fontItem={list[props.index]} text={text}/>}
        </List>
      )}
    </AutoSizer>}
  </>;
};

export default VirtualList;
