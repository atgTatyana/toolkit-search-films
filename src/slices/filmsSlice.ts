import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface IFilm {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export interface IFilmCard {
  Poster: string
  Title: string
  Year: string
  Genre: string
  Runtime: string
  Director: string
  Actors: string
  imdbRating: string
  Plot: string
}

export interface FilmsState {
  films: IFilm[]
  loading: boolean
  error: string
  filmsFavorites: IFilm[]
  search: string
  filmCard: IFilmCard | null
}

const initialState = {
  films: [],
  loading: false,
  error: "",
  filmsFavorites: [],
  search: "",
  filmCard: null,
} as FilmsState

const createSliceWithThunk = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
})

export const filmsSlice = createSliceWithThunk({
  name: "films",
  initialState,

  reducers: create => ({
    addInFavorites: create.reducer((state, action: PayloadAction<string>) => {
      const index = state.filmsFavorites.findIndex(
        (film) => film.imdbID === action.payload,
      )
      if (index === -1) {
        const film = state.films.filter(
          (film) => film.imdbID === action.payload,
        )
        state.filmsFavorites.push(film[0])
      }
    }),

    setSearch: create.reducer((state, action: PayloadAction<string>) => {
      state.search = action.payload
    }),

    deleteFromFavorites: create.reducer((state, action: PayloadAction<string>) => {
      state.filmsFavorites = state.filmsFavorites.filter(
        (film) => film.imdbID !== action.payload,
      )
    }),

    fetchFilms: create.asyncThunk(
      async (url: string, { rejectWithValue }) => {
        try {
          const response = await fetch(url)
          if (!response.ok) {
            return rejectWithValue("Loading films error!")
          }
          return await response.json()
        } catch (e) {
          return rejectWithValue(e)
        }
      },
      {
        pending: state => {
          state.loading = true
          state.error = ""
        },

        fulfilled: (state, action) => {
          if (action.payload.Response === "False") {
            state.error = action.payload.Error
            state.films = []
          } else {
            action?.payload?.Search
              ? (state.films = action.payload.Search)
              : (state.filmCard = action.payload)
            state.error = ""
          }
          state.loading = false
        },
        
        rejected: (state, action) => {
          state.loading = false
          state.error = action.payload as string
        },
      },
    ),
  }),
})

export const { addInFavorites, setSearch, deleteFromFavorites, fetchFilms } =
  filmsSlice.actions
export default filmsSlice.reducer
