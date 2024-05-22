export function setListener<TRequest, TResponse>(
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
			sendResponse: (response: TResponse) => void
		) => {
			listener(request, sender, sendResponse)
		}
	)
}
