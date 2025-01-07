import { configureStore, createSlice } from "@reduxjs/toolkit";

// Слайс для хранения данных блюд
const dishesSlice = createSlice({
  name: "dishes",
  initialState: [],
  reducers: {
    setDishes: (state, action) => action.payload,
  },
});

export const { setDishes } = dishesSlice.actions;

// Настройка хранилища Redux
const store = configureStore({
  reducer: {
    dishes: dishesSlice.reducer,
  },
});

export default store;
