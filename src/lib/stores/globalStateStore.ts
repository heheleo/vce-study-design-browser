import { writable } from 'svelte/store';

export interface GlobalState {
	isLoadingData: boolean;
	selectedSubject: string | null;
}

const createGlobalStateStore = () => {
	const { subscribe, set, update } = writable<GlobalState>({
		isLoadingData: true,
		selectedSubject: null
	});

	const setLoadingData = (isLoadingData: boolean) => {
		update((state) => ({ ...state, isLoadingData }));
	};

	const setSelectedSubject = (selectedSubject: string | null) => {
		update((state) => ({ ...state, selectedSubject }));
	};

	return {
		subscribe,
		setLoadingData,
		setSelectedSubject
	};
};

export const GlobalStateStore = createGlobalStateStore();
