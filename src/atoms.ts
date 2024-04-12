import { WritableAtom, atom } from "jotai";
import { TaskType, UpdateTaskType } from "./types";

export function optionsAtomWithToggle(
  initialValue?: boolean,
): WritableAtom<boolean, [boolean?], void> {
  const anAtom = atom(initialValue, (get, set, nextValue?: boolean) => {
    const update = nextValue ?? !get(anAtom)
    set(anAtom, update)
  })

  return anAtom as WritableAtom<boolean, [boolean?], void>
}

export const isOptionsActiveAtom = optionsAtomWithToggle(false);

export function updateModalWithToggle(
  initialValue?: boolean,
): WritableAtom<boolean, [boolean?], void> {
  const anAtom = atom(initialValue, (get, set, nextValue?: boolean) => {
    const update = nextValue ?? !get(anAtom)
    set(anAtom, update)
  })

  return anAtom as WritableAtom<boolean, [boolean?], void>
}

export const isUpdateModalOpenAtom = updateModalWithToggle(false);

export const toBeUpdatedDocAtom = atom<UpdateTaskType | null>(null);

export const documentIdAtom = atom<string | null>(null);

export const reloadFlagAtom = atom<boolean>(false);