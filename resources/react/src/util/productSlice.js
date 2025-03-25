import { createSlice } from '@reduxjs/toolkit';
 
const initialState = {
  selectedCategory: '',
  sortOrder: '',
  searchQuery: '',
};
 
const ProductSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
   
  },
});
 
export const { setCategory, setSortOrder } = ProductSlice.actions;
export default ProductSlice.reducer;
 