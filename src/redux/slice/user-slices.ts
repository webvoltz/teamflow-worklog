import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { GET_USER } from '../../graphql/user.graphql';
import { APOLLO_CLIENT } from '../../services/apollo';
import { type UserData } from '../../types/user.type';
import { type QueryError } from '../../types/error.type';

export const fetchUserData = createAsyncThunk<UserData, undefined, { rejectValue: QueryError }>(
  'query/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await APOLLO_CLIENT.query({
        query: GET_USER,
        fetchPolicy: 'network-only',
      });
      if (!response.data) {
        return rejectWithValue({ message: 'No data returned from the server.' });
      }
      return response.data;
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      return rejectWithValue({ message: errorMessage });
    }
  },
);

const querySlice = createSlice({
  name: 'query',
  initialState: {
    data: null as UserData | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ?? action.error.message ?? 'An unknown error occurred';
      });
  },
});

export default querySlice.reducer;
