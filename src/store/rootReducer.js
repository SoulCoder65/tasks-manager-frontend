import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import tasksListReducer from './slices/tasksListSlice';

const appReducer = combineReducers({
  auth: authReducer,
  tasks: tasksListReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_ALL') {
    state = undefined; 
  }
  return appReducer(state, action);
};

export default rootReducer;
