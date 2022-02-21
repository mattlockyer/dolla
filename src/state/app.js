import { State } from '../utils/state';
import { initNear } from './near';

const initialState = {
	app: {
		mounted: false
	}
};

const KEYS = '__KEYS'
export const getKeysLS = (accountId) => JSON.parse(localStorage.getItem(accountId + KEYS) || '[]')
export const setKeysLS = (accountId, keys) => localStorage.setItem(accountId + KEYS, JSON.stringify(keys))

export const { appStore, AppProvider } = State(initialState, 'app');

// example app function
export const onAppMount = (message) => async ({ update, getState, dispatch }) => {
	update('app', { mounted: true });
	dispatch(initNear())
};
