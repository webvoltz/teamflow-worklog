import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { APOLLO_CLIENT } from '../../services/apollo';
import { TASK_TYPE } from '../../graphql/schedule.graphql';
import { type TaskTypeResponse } from '../../types/schdeule.type';
import { type QueryError } from '../../types/error.type';

interface TaskTypeQueryResult {
  taskTypes: {
    nodes: TaskTypeResponse[];
  };
}

export const fetchTaskType = createAsyncThunk<
  TaskTypeResponse[],
  undefined,
  { rejectValue: QueryError }
>('query/fetchTaskType', async (_, { rejectWithValue }) => {
  try {
    const response = await APOLLO_CLIENT.query<TaskTypeQueryResult>({ query: TASK_TYPE });
    return response.data.taskTypes.nodes;
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return rejectWithValue({ message: errorMessage });
  }
});

const querySlice = createSlice({
  name: 'query',
  initialState: {
    data: null as TaskTypeResponse[] | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskType.fulfilled, (state, action: PayloadAction<TaskTypeResponse[]>) => {
        state.data = action.payload;
      })
      .addCase(fetchTaskType.rejected, (state, action) => {
        state.error =
          action.payload?.message ?? action.error.message ?? 'An unknown error occurred';
      });
  },
});

export default querySlice.reducer;
