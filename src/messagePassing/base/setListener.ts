import { GenericResponse } from "./MessageTypes"

export function setListener<TRequest, TResponse>(
	listener: (
		request: TRequest,
		sender: chrome.runtime.MessageSender,
		sendResponse: (response: TResponse) => void
	) => boolean | void
) {
	chrome.runtime.onMessage.addListener(
		(
			request: TRequest,
			sender: chrome.runtime.MessageSender,
			sendResponse: (response: TResponse) => void
		) => {
			listener(request, sender, sendResponse)
		}
	)
}

export function setAsynchronousListener<TRequest, TResponse>(
	listener: (
		request: TRequest,
		sender: chrome.runtime.MessageSender,
		sendResponse: (response: TResponse) => void
	) => void
) {
	chrome.runtime.onMessage.addListener(
		(
			request: TRequest,
			sender: chrome.runtime.MessageSender,
			sendResponse: (response: TResponse | GenericResponse) => void
		) => {
			const timeout = setTimeout(() => {
				sendResponse({ success: false })
			}, 5000) // 5-second timeout to prevent memory leaks with the channel being left open

			listener(request, sender, sendResponse)

			return true
		}
	)
}
