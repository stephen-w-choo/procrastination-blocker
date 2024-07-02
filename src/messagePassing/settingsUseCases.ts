import { Settings } from "../data/models/Settings"
import {
	CheckFocusModeRequest,
	CheckFocusModeResponse,
	GetSettingsRequest,
	OpenSettingsRequest,
	OpenSettingsResponse,
	SetSettingsRequest,
	SettingsResponse,
	ToggleFocusModeRequest,
	ToggleFocusModeResponse,
} from "./base/MessageTypes"
import { sendMessage } from "./base/sendMessage"

export function toggleFocusModeUseCase(
	toggleTo: boolean
): Promise<ToggleFocusModeResponse> {
	return sendMessage<ToggleFocusModeRequest, ToggleFocusModeResponse>({
		command: "toggleFocusMode",
		toggle: toggleTo,
	})
}

export function checkFocusModeUseCase(): Promise<CheckFocusModeResponse> {
	return sendMessage<CheckFocusModeRequest, CheckFocusModeResponse>({
		command: "checkFocusMode",
	})
}

export function getSettingsUseCase(): Promise<SettingsResponse> {
	return sendMessage<GetSettingsRequest, SettingsResponse>({ command: "getSettings" })
}

export function setSettingsUseCase(settings: Settings): Promise<SettingsResponse> {
	return sendMessage<SetSettingsRequest, SettingsResponse>({
		command: "setSettings",
		settings,
	})
}

export function openSettingsUseCase(): Promise<OpenSettingsResponse> {
	return sendMessage<OpenSettingsRequest, OpenSettingsResponse>({
		command: "openSettings",
	})
}
