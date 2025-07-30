import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../reducer';
import { AppDispatch, RootState } from 'app/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
