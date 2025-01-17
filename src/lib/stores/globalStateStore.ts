import { writable } from 'svelte/store';

export interface GlobalState {
	isLoadingData: boolean;
	selectedSubject: string | null;
	selectedUnit: '1' | '2' | '34' | null;
	selectedAOS: number | null;
}

const createGlobalStateStore = () => {
	const { subscribe, update } = writable<GlobalState>({
		isLoadingData: true,
		selectedSubject: null,
		selectedUnit: null,
		selectedAOS: null
	});

	const setLoadingData = (isLoadingData: boolean) => {
		update((state) => ({ ...state, isLoadingData }));
	};

	const setSelectedSubject = (selectedSubject: string | null) => {
		update((state) => ({ ...state, selectedSubject }));
	};

	const setSelectedUnit = (selectedUnit: '1' | '2' | '34' | null) => {
		update((state) => ({ ...state, selectedUnit }));
	};

	const setSelectedAOS = (selectedAOS: number | null) => {
		update((state) => ({ ...state, selectedAOS }));
	};

	return {
		subscribe,
		setLoadingData,
		setSelectedSubject,
		setSelectedUnit,
		setSelectedAOS
	};
};

export const GlobalStateStore = createGlobalStateStore();
