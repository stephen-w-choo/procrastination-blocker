import { useDisclosure } from "@chakra-ui/react"
import React, { createContext, useContext, useEffect, useState } from "react"
import { Category, SiteSeen } from "../../data/models/Category"
import { SiteData } from "../../data/models/SiteData"
import { ProcrastinationScores } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"
import { requestModelSyncUseCase } from "../../messagePassing/classificationModelUseCases"

export interface ContentViewModelInitialValues {
	isActive: boolean
	rerenderTopBar: () => void
	siteData: SiteData
	siteSeen: Category | SiteSeen
	siteStatus: {
		procrastinationScore: ProcrastinationScores
		trainedOn: TrainedOn
	}
}

interface ContentViewModelProviderProps extends ContentViewModelInitialValues {
	children: React.ReactNode
}

interface ContentViewModelExportedValues {
	isTopBarDisabled: boolean
	isTopBarExpanded: boolean
	siteData: SiteData
	siteSeen: Category | SiteSeen
	siteStatus: {
		procrastinationScore: ProcrastinationScores
		trainedOn: TrainedOn
	}
	resyncAndRerenderTopBar: () => void
	toggleTopBarCollapse: () => void
	expandTopBar: () => void
	collapseTopBar: () => void
	setIsTopBarDisabled: (value: boolean) => void
}

const ContentViewModelContext = createContext({} as ContentViewModelExportedValues)

export function ContentViewModelProvider({
	isActive,
	rerenderTopBar,
	siteData,
	siteSeen,
	siteStatus,
	children,
}: ContentViewModelProviderProps) {
	// This hook is used to control the visibility of the top bar
	const {
		isOpen: isTopBarExpanded,
		onToggle: toggleTopBarCollapse,
		onOpen: expandTopBar,
		onClose: collapseTopBar,
	} = useDisclosure()

	const [isTopBarDisabled, setIsTopBarDisabled] = useState(false)

	useEffect(() => {
		if (isActive) {
			// 0.5 second delay
			setTimeout(() => expandTopBar(), 500)
		} else {
			setTimeout(() => collapseTopBar(), 500)
		}
	}, [isActive])

	function resyncAndRerenderTopBar() {
		requestModelSyncUseCase().then(modelSyncResponse => {
			if (modelSyncResponse.success) {
				rerenderTopBar()
			}
		})
	}

	// Exposed values and functions
	const exported: ContentViewModelExportedValues = {
		isTopBarDisabled,
		isTopBarExpanded,
		siteData,
		siteSeen,
		siteStatus,
		resyncAndRerenderTopBar,
		toggleTopBarCollapse,
		expandTopBar,
		collapseTopBar,
		setIsTopBarDisabled,
	}

	return (
		<ContentViewModelContext.Provider value={{ ...exported }}>
			{children}
		</ContentViewModelContext.Provider>
	)
}

export function useContentViewModel(): ContentViewModelExportedValues {
	return useContext(ContentViewModelContext)
}
