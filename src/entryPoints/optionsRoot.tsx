import { ChakraProvider } from "@chakra-ui/react"
import React from "react"
import { createRoot } from "react-dom/client"
import OptionsView from "../view/option/OptionsView"

renderOptions()

function renderOptions() {
	const rootElement = document.getElementById("root")

	if (rootElement !== null) {
		const root = createRoot(rootElement)
		root.render(
			<ChakraProvider>
				<OptionsView />
			</ChakraProvider>
		)
	}
}
