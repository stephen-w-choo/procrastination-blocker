import { ChakraProvider } from "@chakra-ui/react"
import React from "react"
import { createRoot } from "react-dom/client"
import PopUpView from "../view/popup/PopUpView"

renderPopUp()

function renderPopUp() {
	const rootElement = document.getElementById("root")

	if (rootElement !== null) {
		const root = createRoot(rootElement)
		root.render(
			<ChakraProvider>
				<PopUpView />
			</ChakraProvider>
		)
	}
}
