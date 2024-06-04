import { CloseIcon } from "@chakra-ui/icons"
import { Box, Collapse, IconButton } from "@chakra-ui/react"
import React, { ReactNode } from "react"
import { COLORS } from "../colours"
import { TopBarDropdownTab } from "./TopBarDropdownTab"

export type TopBarProps = {
	isOpen: boolean
	onToggle: () => void
	disabled: boolean
	closeTopBar: () => void
	children: ReactNode
}

export function TopBar({
	isOpen,
	onToggle,
	disabled,
	closeTopBar: disableTopBar,
	children,
}: TopBarProps) {
	if (disabled === true) {
		return null
	}

	return (
		<>
			<Box
				pos="fixed"
				display="flex"
				flexDirection="column"
				alignItems="center"
				top="0px"
				left="0px"
				width="100%"
				zIndex="10000"
				p={2}
				backgroundColor={COLORS.backgroundYellow}
			>
				<Collapse animateOpacity in={isOpen} startingHeight="1px">
					{children}
				</Collapse>
				<Box display="flex" justifyContent="center" w="100%" overflow="hidden">
					<TopBarDropdownTab
						color={COLORS.blueWhite}
						isOpen={isOpen}
						onToggle={onToggle}
					/>
				</Box>
				<IconButton
					position={"absolute"}
					top="0px"
					right="0px"
					variant="ghost"
					colorScheme="black"
					aria-label="Done"
					fontSize="12px"
					icon={<CloseIcon />}
					height="15px"
					width="15px"
					onClick={disableTopBar}
				/>
			</Box>
		</>
	)
}
