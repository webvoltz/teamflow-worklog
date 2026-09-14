import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { PROJECT_QUERY, TL_PROJECT_QUERY } from '../../graphql/schedule.graphql';
import { APOLLO_CLIENT } from '../../services/apollo';
import { type QueryError } from '../../types/error.type';
import { type ProjectResponse } from '../../types/schdeule.type';

export const fetchProjectOption = createAsyncThunk<
  ProjectResponse[],
  { userId: string; isTeamLeader: boolean },
  { rejectValue: QueryError }
>('query/fetchProjects', async ({ userId, isTeamLeader }, { rejectWithValue }) => {
  try {
    let response: ProjectResponse[] = [];

    if (isTeamLeader) {
      const { data } = await APOLLO_CLIENT.query({
        query: TL_PROJECT_QUERY,
        variables: { teamLeaderId: userId },
      });
      if (!data) {
        return rejectWithValue({ message: 'No data returned from the server.' });
      }
      response = data.allmemberProject;
    } else {
      const { data } = await APOLLO_CLIENT.query({
        query: PROJECT_QUERY,
        variables: { usersId: userId },
      });
      if (!data) {
        return rejectWithValue({ message: 'No data returned from the server.' });
      }
      response = data.filteredProjects;
    }

    return response;
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
    data: null as ProjectResponse[] | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectOption.fulfilled, (state, action: PayloadAction<ProjectResponse[]>) => {
        state.data = action.payload;
      })
      .addCase(fetchProjectOption.rejected, (state, action) => {
        state.error =
          action.payload?.message ?? action.error.message ?? 'An unknown error occurred';
      });
  },
});

export default querySlice.reducer;
