import React from "react"
import {
    Box,
    Flex,
} from "@chakra-ui/react"

type TopBarProps = {
    addSite: () => void,
    removeSite: () => void,
}

function TopBar({
    addSite,
    removeSite,
}: TopBarProps) {
	return (
		<>
			<div
				style={{
					width: "100%",
					backgroundColor: "blue",
					color: "white",
					padding: "10px",
					position: "fixed",
					top: "0",
					left: "0",
					zIndex: "1000",
				}}
			>
                <Flex
                    flexDirection="column"
                    alignItems="center"
                >
                    <Box
                        onClick={addSite}
                    >
                        Add site
                    </Box>
                    <Box
                        onClick={removeSite}
                    >
                        Remove site
                    </Box>
                </Flex>
			</div>
		</>
	)
}

export default TopBar
