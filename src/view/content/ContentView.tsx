import React from "react"
import { COLORS } from "../colours"
import { TopBar } from "./components/TopBar"
import { useContentViewModel } from "./ContentContext"
import { FocusMode } from "./sections/FocusMode"


export function ContentView() {
	const {
        isTopBarDisabled,
        isTopBarExpanded,
        toggleTopBarCollapse,
        setIsTopBarDisabled
    } = useContentViewModel()

	return (
		<TopBar
			backgroundColor={COLORS.lightGrey}
			disabled={isTopBarDisabled}
			closeTopBar={() => setIsTopBarDisabled(true)}
			isOpen={isTopBarExpanded}
			onToggle={toggleTopBarCollapse}
		>
			<FocusMode />
		</TopBar>
	)
}
