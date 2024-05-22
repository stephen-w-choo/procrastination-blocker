import { ChevronDownIcon } from "@chakra-ui/icons"
import { Button, Heading } from "@chakra-ui/react"
import React from "react"
import { LuBrainCircuit } from "react-icons/lu"

export type TopBarIconProps = {
	color: string
	isOpen: boolean
	onToggle: () => void
}

export function TopBarDropdownTab({
	color,
	isOpen,
	onToggle,
}: TopBarIconProps) {
	return (
		<Button
			position="absolute"
			background="transparent"
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
				<LuBrainCircuit
					style={{ display: "inline", marginRight: "5px" }}
				/>
				Training mode
			</Heading>
			<ChevronDownIcon
				position="absolute"
				top="5"
				rotate="180deg"
				transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
				transition={"transform 0.3s"}
				boxSize={6}
			/>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="800"
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
		</Button>
	)
}