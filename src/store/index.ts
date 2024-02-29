import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { filmsSlice } from "../slices/filmsSlice"

export const rootReducer = combineSlices(filmsSlice)
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
