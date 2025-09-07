import { ClipboardService } from './clipboard-service';
import { VaultService } from './vault-service';
import { NotificationService } from './notification-service';

export class Command {
	private clipboardService: ClipboardService;
	private vaultService: VaultService;
	private notificationService: NotificationService;

	constructor(clipboardService: ClipboardService, vaultService: VaultService, notificationService: NotificationService) {
		this.clipboardService = clipboardService;
		this.vaultService = vaultService;
		this.notificationService = notificationService;
	}

	execute(): void {
		if (this.hasNoImage()) {
			this.notifyNoImage();
			return;
		}
		
		this.executeImagePaste();
	}

	private executeImagePaste(): void {
		try {
			const imageBuffer: Buffer = this.readImage();
			const filename: string = this.saveImage(imageBuffer);
			this.createNote(filename);
			this.notifySuccess();
		} catch (error: unknown) {
			this.notifyError(error);
		}
	}

	private hasNoImage(): boolean {
		return this.clipboardService.hasNoImage();
	}

	private readImage(): Buffer {
		return this.clipboardService.readImage();
	}

	private saveImage(imageBuffer: Buffer): string {
		return this.vaultService.saveImage(imageBuffer);
	}

	private createNote(filename: string): string {
		return this.vaultService.createNote(filename);
	}

	private notifySuccess(): void {
		this.notificationService.success();
	}

	private notifyError(error: unknown): void {
		if (error instanceof Error) {
			this.notificationService.error(error);
		} else {
			this.notificationService.error(new Error('Unknown error'));
		}
	}

	private notifyNoImage(): void {
		this.notificationService.noImage();
	}
}