import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import React from "react"

type KeywordsTextInputProps = {
	text: string
	onSubmit: (newText: string) => void
}

export function KeywordsTextInput({ text, onSubmit }: KeywordsTextInputProps) {
	return (
		<Editable
			defaultValue={text}
			onSubmit={newText => {
				onSubmit(newText)
			}}
			cursor={"text"}
		>
			<EditablePreview
				mt="-3px"
				mb="-7px"
				w="186px"
				overflow="hidden"
				_hover={{ outline: "3px solid #E2E8F0" }}
				minH="25px"
			/>
			<EditableInput minW="100px" />
		</Editable>
	)
}
