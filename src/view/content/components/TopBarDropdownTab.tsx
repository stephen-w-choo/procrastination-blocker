import { ChevronDownIcon } from "@chakra-ui/icons"
import { Box, Button, Heading } from "@chakra-ui/react"
import React from "react"
import { Heading2 } from "./Typography"

export type TopBarIconProps = {
	color: string
	isOpen: boolean
	onToggle: () => void
}

export function TopBarDropdownTab({ color, isOpen, onToggle }: TopBarIconProps) {
	return (
		<Button
			overflow="hidden"
			position="absolute"
			background="transparent"
			variant="unstyled"
			display="flex"
			justifyContent="center"
			alignItems="center"
			border={0}
			height="min-content"
			padding="0px"
			onClick={onToggle}
		>
			<Heading
				position="absolute"
				fontSize="large"
				top="0"
				zIndex="1"
				display="flex"
				alignItems="center"
			>
				<Heading2>Focus Mode</Heading2>
			</Heading>
			<ChevronDownIcon
				position="absolute"
				color="#000000"
				top="20px"
				height="20px"
				width="20px"
				rotate="180deg"
				transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
				transition={"transform 0.4s"}
				boxSize={6}
			/>
			<Box width="100%">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="400"
					height="40"
					fill="none"
					viewBox="0 0 96 20"
					preserveAspectRatio="none"
				>
					<path
						fill={color}
						d="M32 12c-4-4-8-8-16-8C3.2 4 0 1.333 0 0h96c0 1.333-3.2 4-16 4-8 0-12 4-16 8s-8 8-16 8-12-4-16-8Z"
					/>
				</svg>
			</Box>
		</Button>
	)
}
