import React, {useEffect} from 'react';
import {useStore} from './utils/store';

const getLength = (a, b) => {
  const length = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  return length;
};

const getTopLeft = pt => {
  const inventoryModalRect = document
    .getElementsByClassName('class_inventory')[0]
    .getBoundingClientRect();
  const tl = document
    .getElementsByClassName('class_inventory_top_left')[0]
    ?.getBoundingClientRect();
  const tr = document
    .getElementsByClassName('class_inventory_top_right')[0]
    ?.getBoundingClientRect();
  const br = document
    .getElementsByClassName('class_inventory_bottom_right')[0]
    ?.getBoundingClientRect();
  const bl = document
    .getElementsByClassName('class_inventory_bottom_left')[0]
    ?.getBoundingClientRect();

  const topLength = getLength(tl, tr);
  const bottomLength = getLength(bl, br);
  const leftLength = getLength(tl, bl);
  const rightLength = getLength(tr, br);

  const addHeight = (pt.x - inventoryModalRect.x) / inventoryModalRect.width;

  const diffTopY =
    tl.y < tr.y
      ? Math.abs(((tr.y - tl.y) * (pt.x - tl.x)) / (tr.x - tl.x))
      : Math.abs((tr.y - tl.y) * (1 - (pt.x - tl.x) / (tr.x - tl.x)));
  const diffLeftX = Math.abs(((bl.x - tl.x) * (bl.y - pt.y)) / (bl.y - tl.y));

  const diffAddHeight = tl.y < tr.y ? addHeight : 1 - addHeight;
  const modalHeight =
    Math.min(leftLength, rightLength) +
    Math.abs(leftLength - rightLength) * diffAddHeight;
  const modalWidth =
    Math.min(topLength, bottomLength) +
    (Math.abs(topLength - bottomLength) * (pt.y - inventoryModalRect.y)) /
      inventoryModalRect.height;

  const top = (pt.y - Math.min(tl.y, tr.y) - diffTopY) * (500 / modalHeight);
  const left = (pt.x - tl.x - diffLeftX) * (900 / modalWidth);

  return {top, left};
};

export const DragAndDrop = props => {
  const {selSlot, updateSelSlot} = useStore();

  const slotDraggedRef = React.useRef(selSlot);

  useEffect(() => {
    slotDraggedRef.current = selSlot;
  }, [selSlot]);

  const moveElementCloneToMouseCoords = async (x, y) => {
    const slot = slotDraggedRef.current;
    if (!slot) return false;
    const insertedChild = document.getElementById(`id_item_slot_ghost_${slot}`);
    if (!insertedChild) return false;
    insertedChild.style.left = `${x}px`;
    insertedChild.style.top = `${y}px`;
  };

  const onMouseMove = event => {
    event.preventDefault();
    const {top, left} = getTopLeft({x: event.clientX, y: event.clientY});
    moveElementCloneToMouseCoords(left, top);
  };

  const onMouseClick = event => {
    // event.stopPropagation();
    // event.preventDefault();
    // if (!slotDraggedRef.current) return false;
    // const div = event.target;
    // const slot = div.getAttribute('data-slot');
    // const type = div.getAttribute('data-type');
    // const slotNumber = parseInt(slot);
    // if (slot  && type === "item") {
    //   updateSelSlot(slotNumber);
    //   const itemSelected = document.getElementById(`id_item_slot_${slot}`);
    //   const itemList = document.getElementsByClassName("inventory")[0];
    //   const itemClone = itemSelected.cloneNode(true);
    //   itemClone.className += " being-dragged";
    //   itemClone.id = `id_item_slot_ghost_${slot}`;
    //   itemList.appendChild(itemClone);
    //   const { top, left } = getTopLeft({ x: event.clientX, y: event.clientY });
    //   itemClone.style.top = `${top}px`;
    //   itemClone.style.left = `${left}px`;
    //   itemClone.style.zIndex = "50";
    //   itemSelected.className += " being-moved";
    // }
  };

  const onMouseReleased = event => {
    // if (slotDraggedRef.current === null) return false;
    // event.preventDefault();
    // const { clientX, clientY } = event;
    // const slot = slotDraggedRef.current;
    // if (slot === null) return false;
    // const itemSlotElement: any = document.getElementById(`id_item_slot_${slot}`);
    // itemSlotElement.className = itemSlotElement.className.replace(
    //   " being-moved",
    //   ""
    // );
    // const itemGhostElement: any = document.getElementById(
    //   `id_item_slot_ghost_${slot}`
    // );
    // itemGhostElement.remove();
    // const target: any = document.elementFromPoint(clientX, clientY);
    // const targetSlot = target.getAttribute("data-slot");
    // // console.log(targetSlot, slot)
    // if (
    //   ((targetSlot < itemNumPerPage && slot < itemNumPerPage * 2) ||
    //     (slot >= itemNumPerPage && targetSlot >= itemNumPerPage * 2) ||
    //     (slot >= itemNumPerPage && slot < itemNumPerPage * 2) ||
    //     (targetSlot >= itemNumPerPage && targetSlot < itemNumPerPage * 2)) &&
    //   targetSlot !== slot &&
    //   targetSlot !== null
    // ) {
    //   props.moveItemToSlot(slot, targetSlot);
    // }
    // updateSelSlot(null);
  };

  useEffect(() => {
    const element = document.getElementsByClassName(`class_inventory`)[0];
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('click', onMouseClick);
    element.addEventListener('mouseup', onMouseReleased);
    return () => {
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseup', onMouseReleased);
      element.removeEventListener('click', onMouseClick);
    };
  }, []);

  return null;
};