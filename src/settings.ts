export interface Settings {
	imageFolder: string;
	imageNotesFolder: string;
	showPreviewModal: boolean;
	includeAssetProperty: boolean;
	templateFile: string;
}

export const DEFAULT_SETTINGS: Settings = {
	imageFolder: '',
	imageNotesFolder: '',
	showPreviewModal: false,
	includeAssetProperty: false,
	templateFile: ''
};

