import { IconButton } from "@chakra-ui/react"
import React from "react"

type KeywordsIconButtonProps = {
	onClick: () => void
	icon: React.ReactElement
	ariaLabel: string
}

export function KeywordsIconButton({
	onClick,
	icon,
	ariaLabel,
}: KeywordsIconButtonProps) {
	return (
		<IconButton
			variant="outline"
			colorScheme="blackAlpha"
			aria-label={ariaLabel}
			icon={icon}
			m={1}
			isRound
			boxSize={6}
			onClick={onClick}
		/>
	)
}
