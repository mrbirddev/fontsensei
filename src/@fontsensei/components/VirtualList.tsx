import React, {CSSProperties, forwardRef, useEffect, useState} from "react";
import {FSFontItem} from "@fontsensei/core/types";
import listFonts from "@fontsensei/core/listFonts";
import {useScopedI18n} from "@fontsensei/locales";
import {debounce} from "lodash-es";
import {GoogleFontHeaders} from "@fontsensei/components/GoogleFontHeaders";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeList as List} from "react-window";

const ITEM_HEIGHT = 100;

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
  if (!fontItem) {
    return <div key="END" className="h-[100px] overflow-hidden" style={style} onWheel={onWheel} ref={forwardedRef}
                data-itemindex={index}>
      <div className="text-center">
        THE END
      </div>
    </div>
  }

  return <div key={fontItem.name} className="h-[100px] overflow-hidden" style={style} onWheel={onWheel}
              ref={forwardedRef} data-itemindex={index}>
    <div className="text-xl" style={{whiteSpace: 'nowrap', overflow: 'auto hidden'}}>
      #{index} {fontItem.name} {JSON.stringify(fontItem.tags)}
    </div>
    <div className="text-4xl bg-white/50 rounded px-2"
         style={{fontFamily: fontItem.name, whiteSpace: 'nowrap', overflow: 'auto hidden'}}>
      {text}
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
  initialFontItemList,
  pageSize,
}: { tagValue: string | undefined, initialFontItemList: FSFontItem[], pageSize: number }) => {
  const [list, setList] = useState(initialFontItemList);

  useEffect(() => {
    // console.log('changed', tagValue, initialFontItemList);
    setList(initialFontItemList);
    void listFonts({
      tagValue,
      skip: pageSize,
      take: 10000,
    }).then(res => {
      setList(prev => [...prev, ...res])
    });
  }, [tagValue, initialFontItemList]);


  const [configList, setConfigList] = useState([] as { name: string, text?: string }[]);

  const tProduct = useScopedI18n('product');
  const lorem = tProduct('lorem');
  const [text, setText] = useState('123,Abc! ' + lorem);
  useEffect(() => {
    setText('123,Abc! ' + lorem);
  }, [lorem]);

  useEffect(() => {
    const delayedUpdate = debounce((start, count) => {
      setConfigList(
        list.slice(
          start,
          start + count,
        ).map(fontItem => ({name: fontItem.name, text: text})),
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

  return <>
    <GoogleFontHeaders preConnect={false} configList={configList} strategy="block"/>
    <AutoSizer>
      {({height, width}) => (
        <List
          className="List"
          outerElementType={createOuterElementType}
          height={height}
          width={width}
          itemCount={list.length + 1}
          itemSize={ITEM_HEIGHT}
        >
          {(props) => <RefForwardedRow {...props} fontItem={list[props.index]} text={text}/>}
        </List>
      )}
    </AutoSizer>
  </>;
};

export default VirtualList;
