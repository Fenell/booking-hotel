import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { AppDispatch, RootState } from "./store";

type DispatchFunction = () => AppDispatch;

export const useCollapseDispatch: DispatchFunction = useDispatch;
export const useCollapseSelector: TypedUseSelectorHook<RootState> = useSelector;
