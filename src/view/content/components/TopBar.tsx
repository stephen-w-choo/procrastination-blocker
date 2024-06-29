import { CloseIcon } from "@chakra-ui/icons"
import { Box, Collapse, IconButton } from "@chakra-ui/react"
import React, { ReactNode } from "react"
import { TopBarDropdownTab } from "./TopBarDropdownTab"

export type TopBarProps = {
	isOpen: boolean
	backgroundColor: string
	disabled: boolean
	children: ReactNode
	closeTopBar: () => void
	onToggle: () => void
}

export function TopBar({
	isOpen,
	backgroundColor,
	disabled,
	children,
	closeTopBar,
	onToggle,
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
				backgroundColor={backgroundColor}
			>
				<Collapse animateOpacity in={isOpen} startingHeight="1px">
					{children}
				</Collapse>
				<Box display="flex" justifyContent="center" w="100%" overflow="hidden">
					<TopBarDropdownTab
						color={backgroundColor}
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
					aria-label="Close top bar"
					fontSize="12px"
					icon={<CloseIcon color="#000000" />}
					height="15px"
					width="15px"
					onClick={closeTopBar}
				/>
			</Box>
		</>
	)
}
