import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { GET_TEAM_WORK_PLANS, REVIEW_WORK_PLAN } from '../../graphql/approval.graphql';
import { APOLLO_CLIENT } from '../../services/apollo';
import { type QueryError } from '../../types/error.type';
import { type TeamWorkPlanEntry, type WorkPlanStatus } from '../../types/schdeule.type';

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
};

export const fetchTeamWorkPlans = createAsyncThunk<
  TeamWorkPlanEntry[],
  { teamLeaderId: string },
  { rejectValue: QueryError }
>('query/fetchTeamWorkPlans', async ({ teamLeaderId }, { rejectWithValue }) => {
  try {
    const { data } = await APOLLO_CLIENT.query({
      query: GET_TEAM_WORK_PLANS,
      variables: { teamLeaderId },
      fetchPolicy: 'network-only',
    });
    if (!data) {
      return rejectWithValue({ message: 'No data returned from the server.' });
    }
    return data.teamWorkPlans;
  } catch (error: unknown) {
    return rejectWithValue({ message: toErrorMessage(error) });
  }
});

export const reviewWorkPlan = createAsyncThunk<
  { entryId: string; status: WorkPlanStatus },
  { entryId: string; status: WorkPlanStatus; note?: string },
  { rejectValue: QueryError }
>('mutation/reviewWorkPlan', async ({ entryId, status, note }, { rejectWithValue }) => {
  try {
    const { data } = await APOLLO_CLIENT.mutate({
      mutation: REVIEW_WORK_PLAN,
      variables: { entryId, status, note },
    });
    if (!data?.reviewWorkPlan.success) {
      return rejectWithValue({
        message: data?.reviewWorkPlan.message ?? 'Unable to update work plan.',
      });
    }
    return { entryId, status };
  } catch (error: unknown) {
    return rejectWithValue({ message: toErrorMessage(error) });
  }
});

const teamApprovalSlice = createSlice({
  name: 'teamApproval',
  initialState: {
    data: [] as TeamWorkPlanEntry[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamWorkPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTeamWorkPlans.fulfilled,
        (state, action: PayloadAction<TeamWorkPlanEntry[]>) => {
          state.loading = false;
          state.data = action.payload;
        },
      )
      .addCase(fetchTeamWorkPlans.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ?? action.error.message ?? 'An unknown error occurred';
      })
      .addCase(reviewWorkPlan.fulfilled, (state, action) => {
        const entry = state.data.find((item) => item.id === action.payload.entryId);
        if (entry) entry.status = action.payload.status;
      })
      .addCase(reviewWorkPlan.rejected, (state, action) => {
        state.error =
          action.payload?.message ?? action.error.message ?? 'An unknown error occurred';
      });
  },
});

export default teamApprovalSlice.reducer;
