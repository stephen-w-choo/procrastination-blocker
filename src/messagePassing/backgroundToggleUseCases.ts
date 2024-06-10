import {
	CheckFocusModeRequest,
	FocusModeResponse,
	ToggleFocusModeRequest,
} from "./base/MessageTypes"
import { sendMessage } from "./base/sendMessage"

export function toggleFocusModeUseCase(toggleTo: boolean): Promise<FocusModeResponse> {
	return sendMessage<ToggleFocusModeRequest, FocusModeResponse>({
		command: "toggleFocusMode",
		toggle: toggleTo,
	})
}

export function checkFocusModeUseCase(): Promise<FocusModeResponse> {
	return sendMessage<CheckFocusModeRequest, FocusModeResponse>({
		command: "checkFocusMode",
	})
}
