import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FormData {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  agree: boolean;
  photo: string;
  country: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface FormState {
  countries: Country[];
  data: FormData[];
}

const initialState: FormState = {
  data: [],
  countries: [
    { code: 'RU', name: 'Россия' },
    { code: 'BY', name: 'Беларусь' },
    { code: 'KZ', name: 'Казахстан' },
    { code: 'UA', name: 'Украина' },
    { code: 'US', name: 'США' },
    { code: 'DE', name: 'Германия' },
    { code: 'FR', name: 'Франция' },
    { code: 'IT', name: 'Италия' },
    { code: 'CN', name: 'Китай' },
    { code: 'JP', name: 'Япония' },
    { code: 'BR', name: 'Бразилия' },
    { code: 'IN', name: 'Индия' },
    { code: 'GB', name: 'Великобритания' },
    { code: 'PL', name: 'Польша' },
    { code: 'TR', name: 'Турция' },
  ],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addFormData(state, action: PayloadAction<FormData>) {
      state.data.push(action.payload);
    },
  },
});
export interface RootState {
  form: FormState;
}

export const { addFormData } = formSlice.actions;
export default formSlice.reducer;
