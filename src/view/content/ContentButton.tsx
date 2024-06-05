import { Button } from "@chakra-ui/react"
import React from "react"

type ContentButtonProps = {
	color: string
	children?: React.ReactNode
	onClick: () => void
}

export function ContentButton({ color, children, onClick }: ContentButtonProps) {
	return (
		<Button
			onClick={onClick}
			colorScheme={color}
			display="flex"
			flexDir="column"
			background="white"
			opacity="0.9"
			boxShadow="base"
			variant="ghost"
			whiteSpace="normal"
			height="auto"
			p="2"
		>
			{children}
		</Button>
	)
}
