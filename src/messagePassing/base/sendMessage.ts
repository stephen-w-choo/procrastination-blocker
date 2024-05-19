// Define generic sendMessageAsync function
export function sendMessage<TRequest, TResponse>(request: TRequest): Promise<TResponse> {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage<TRequest, TResponse>(request, (response: TResponse) => {
			if (chrome.runtime.lastError) {
				reject(new Error(chrome.runtime.lastError.message))
			} else {
				resolve(response)
			}
		})
	})
}

export function sendMessageActiveTab<TRequest, TResponse>(request: TRequest): Promise<TResponse> {
	return new Promise((resolve, reject) => {
		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
			if (tabs.length === 0) {
				reject(new Error("No active tabs"))
			} else {
				chrome.tabs.sendMessage(tabs[0].id!, request, (response: TResponse) => {
					if (chrome.runtime.lastError) {
						reject(new Error(chrome.runtime.lastError.message))
					} else {
						resolve(response)
					}
				})
			}
		})
	})
}
