import { Button, Text } from "@chakra-ui/react"
import React from "react"

type ContentButtonProps = {
	color: string
	text: string
	onClick: () => void
}

export function ContentButton({ color, text, onClick }: ContentButtonProps) {
	return (
		<Button
			onClick={onClick}
			colorScheme={color}
			background="white"
			variant="outline"
			whiteSpace="normal"
			height="auto"
			p="2"
		>
			<Text fontSize="medium">{text}</Text>
		</Button>
	)
}
