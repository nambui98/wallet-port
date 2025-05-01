import { createSlice } from "@reduxjs/toolkit"

import { RootState } from "../store"

const initialState = {
  applicant: null,
  sdkToken: null,
  workflowRun: null,
}

const slice = createSlice({
  name: "onfido",
  initialState,
  reducers: {
    setApplicant: (state, action) => {
      state.applicant = action.payload
    },
    setSdkToken: (state, action) => {
      state.sdkToken = action.payload
    },
    setWorkflowRun: (state, action) => {
      state.workflowRun = action.payload
    },
  },
})

export const { setApplicant, setSdkToken, setWorkflowRun } = slice.actions
export const selectApplicant = (state: RootState) => state.onfido.applicant
export const selectSdkToken = (state: RootState) => state.onfido.sdkToken
export const selectWorkflowRun = (state: RootState) => state.onfido.workflowRun

export default slice.reducer
