import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PropertiesState {
    selectedCategory: string | null;
}

const initialState: PropertiesState = {
    selectedCategory: null,
};

const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        updateCategoryFilter(state, action: PayloadAction<string | null>) {
            state.selectedCategory = action.payload;
        },
    },
});

export const { updateCategoryFilter } = propertiesSlice.actions;

export default propertiesSlice.reducer;
