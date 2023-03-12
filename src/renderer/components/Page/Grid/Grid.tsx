import React, { useEffect, useState } from 'react';
import { useGeneralContext } from '@components/GeneralContext';

import { Notification } from '@components/common/Notification';
import ConfirmModal from '@components/common/Modals/ConfirmModal';

import { BlockElement, PageGridState } from '@renderer/common/types';

import '@components/Page/Page.scss';
import '@components/Page/Grid/Grid.scss';
import '@components/Page/Grid/Blocks/Blocks.scss';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import GridElement from './GridElement';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useAddBlock } from '@renderer/hooks/useAddBlock';
import { useDialog } from '@renderer/hooks/useDialog';
import { useFileSaveLoad } from '@renderer/hooks/useFileSaveLoad';

const ResponsiveGridLayout = WidthProvider(Responsive);

const PageGrid = () => {
  const [state, setState] = useState<PageGridState>({
    items: [],
    breakpoint: 'lg',
    cols: 8,
  });
  const [allBlockValues, setAllBlockValues] = useState([]);
  const [popupType, setPopupType] = useState('');
  const [clearModalOpen, setClearModalOpen] = useState(false);
  
  const {
    newWidgetRequest,
    clearPageRequest,
    isRightSidebarOpen,
    isLeftSidebarOpen,
  } = useGeneralContext();

  useEffect( function adjustGridWidth() {
      setTimeout(() => {
        dispatchEvent(new Event('resize'));
      }, 300);
  }, [isRightSidebarOpen, isLeftSidebarOpen]);

  useFileSaveLoad(
    state,
    setState,
    allBlockValues,
    setAllBlockValues,
    setPopupType,
  );

  useAddBlock(newWidgetRequest, setState);

  const ModalChoice = useDialog(
    clearPageRequest,
    setState,
    setAllBlockValues,
    setClearModalOpen,
  );

  const onLayoutChange = (layout: Array<BlockElement>) => {
    layout.map((block) => {
      block.type = state.items.find((item) => item.i == block.i).type;
      block.metaData = state.items.find((item) => item.i == block.i).metaData;
    });

    setState((prev) => ({ ...prev, items: layout }));
  };

  const onBreakpointChange = (breakpoint: string, cols: number) => {
    setState((prev) => ({ ...prev, breakpoint: breakpoint, cols: cols }));
  };

  const onRemoveItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.i !== e.target.name),
    }));

    setAllBlockValues((allValues) =>
      allValues.filter((value) => value.id !== e.target.name),
    );
  };

  return (
    <div className='grid-container'>
      <ResponsiveGridLayout
        onLayoutChange={onLayoutChange}
        onBreakpointChange={onBreakpointChange}
        className='layout'
        cols={{ lg: 8, md: 6, sm: 4, xs: 2, xss: 1 }}
        rowHeight={50}
        resizeHandles={['sw']}
        containerPadding={[0, 0]}
        breakpoints={{ lg: 800, md: 600, sm: 400, xs: 200, xss: 100 }}
        draggableHandle='.block-handle'
      >
        {state.items.map((element) => (
          <GridElement
            blockElement={element}
            onRemoveItem={onRemoveItem}
            key={element.i}
            data-grid={element}
            blockValue={element.metaData}
            setValuesFunction={setAllBlockValues}
            allValues={allBlockValues}
          />
        ))}
      </ResponsiveGridLayout>

      <ConfirmModal
        open={clearModalOpen}
        onConfirm={ModalChoice.handleDialogConfirm}
        onCancel={ModalChoice.handleDialogCancel}
        text='האם למחוק את תכולת הדף?'
      />

      <Notification scene={popupType} />
    </div>
  );
};

export default PageGrid;
