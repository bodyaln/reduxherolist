import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';


const filterAdapter = createEntityAdapter();

const initialState = filterAdapter.getInitialState({
    // filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
});


export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    () => {
        const {request} = useHttp();
        return request("http://localhost:3001/filters");
    }
)

const filtersSlice  = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        // filtersFetching: state => {state.filtersLoadingStatus = 'loading'},
        // filtersFetched: (state, action) => {
        //     state.filters = action.payload
        //     state.filtersLoadingStatus ='idle'
        // },
        // filtersFetchingError: state => {state.filtersLoadingStatus ='error'},
        activeFilterChanged: (state, action)=> {state.activeFilter = action.payload}
    },
    extraReducers: (builder) =>{
        builder
                .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
                .addCase(fetchFilters.fulfilled, (state, action) =>{
                    state.filtersLoadingStatus= 'idle';
                    // state.filters = action.payload;
                    filterAdapter.setAll(state, action.payload);
                } )
                .addCase(fetchFilters.rejected,state =>{
                    state.filtersLoadingStatus = 'error';
                } )
                .addDefaultCase(()=>{})
    }
});


const {actions, reducer} = filtersSlice ;

export default reducer;

export const {selectAll} = filterAdapter.getSelectors(state => state.filters);
export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged,
} = actions;