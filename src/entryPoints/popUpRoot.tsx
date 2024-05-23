import { ChakraProvider } from "@chakra-ui/react"
import React from "react"
import { createRoot } from "react-dom/client"
import PopUp from "../view/popup/PopUp"

renderPopUp()

function renderPopUp() {
	const rootElement = document.getElementById("root")

	if (rootElement !== null) {
		const root = createRoot(rootElement)
		root.render(
			<ChakraProvider>
				<PopUp />
			</ChakraProvider>
		)
	}
}
