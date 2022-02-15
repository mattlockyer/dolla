import { State } from '../utils/state';
import { initNear } from './near';

const initialState = {
	app: {
		mounted: false
	}
};

const KEYS = '__KEYS'
export const getKeysLS = () => JSON.parse(localStorage.getItem(KEYS) || '[]')
export const setKeysLS = (keys) => localStorage.setItem(KEYS, JSON.stringify(keys))
export const { appStore, AppProvider } = State(initialState, 'app');

// example app function
export const onAppMount = (message) => async ({ update, getState, dispatch }) => {
	update('app', { mounted: true });
	dispatch(initNear())
};
