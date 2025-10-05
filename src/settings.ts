export interface Settings {
	imageFolder: string;
	imageNotesFolder: string;
	showPreviewModal: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	imageFolder: '',
	imageNotesFolder: '',
	showPreviewModal: false
};
