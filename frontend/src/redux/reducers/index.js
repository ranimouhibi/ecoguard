import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Assure-toi que le chemin est correct

const rootReducer = combineReducers({
  auth: authReducer, // Ajouter d'autres reducers ici si tu en as
});

export default rootReducer;
