import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter();

// const initialState = {
//     heroes: [],
//     heroesLoadingStatus: 'idle'
// }

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle'
});

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const {request} = useHttp();
        return request("http://localhost:3001/heroes");
    }
)

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        // heroesFetching: state => {state.heroesLoadingStatus = 'loading'},
        // heroesFetched: (state, action) =>{
        //     state.heroesLoadingStatus= 'idle';
        //     state.heroes = action.payload;
        // },
        // heroesFetchingError: state =>{
        //     state.heroesLoadingStatus = 'error';
        // },
        heroCreated: (state, action) => {
            // state.heroes.push(action.payload);
            heroesAdapter.addOne(state, action.payload);
        },
        heroDeleted: (state, action) => {
            // state.heroes = state.heroes.filter(item => item.id !== action.payload);
            heroesAdapter.removeOne(state, action.payload)
        }
    },
    extraReducers: (builder) =>{
        builder
                .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
                .addCase(fetchHeroes.fulfilled, (state, action) =>{
                    state.heroesLoadingStatus= 'idle';
                    heroesAdapter.setAll(state, action.payload)
                } )
                .addCase(fetchHeroes.rejected,state =>{
                    state.heroesLoadingStatus = 'error';
                } )
                .addDefaultCase(()=>{})
    }

});

const {actions, reducer} = heroesSlice;

export default reducer;

export const {selectAll} =  heroesAdapter.getSelectors(state => state.heroes)

export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;