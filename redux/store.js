import {configureStore} from '@reduxjs/toolkit'
import todosReducer from './todosSlices'

export const store = configureStore({
    reducer: {
        todos: todosReducer
    }
})