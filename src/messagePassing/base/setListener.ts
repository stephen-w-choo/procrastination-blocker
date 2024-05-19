export function setListener<TRequest, TResponse>(
    listener: (
        request: TRequest,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: TResponse) => void
    ) => void
) {
    chrome.runtime.onMessage.addListener((request: TRequest, sender: chrome.runtime.MessageSender, sendResponse: (response: TResponse) => void) => {
        listener(request, sender, sendResponse);
    });
}


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
