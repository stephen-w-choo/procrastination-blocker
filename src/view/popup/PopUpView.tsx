import { Box, Flex, Spacer, Switch } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Category, SiteData, SiteSeen } from "../../data/models/SiteData"
import {
	checkFocusModeUseCase,
	toggleFocusModeUseCase,
} from "../../messagePassing/backgroundToggleUseCases"
import {
	GenericResponse,
	ModelMetricsResponse,
	SiteClassificationResponse,
} from "../../messagePassing/base/MessageTypes"
import {
	requestModelMetricsUseCase,
	requestModelSyncUseCase,
} from "../../messagePassing/classificationModelUseCases"
import {
	addSiteUseCase,
	checkSiteSeenUseCase,
	reclassifySiteUseCase,
	removeSiteUseCase,
} from "../../messagePassing/repositoryUseCases"
import { requestSiteDataUseCase } from "../../messagePassing/requestSiteDataUseCases"
import { COLORS } from "../colours"
import { ErrorBox } from "./ErrorBox"
import { ModelDataCard } from "./ModelDataCard"
import { RepositoryClassificationBox } from "./RepositoryClassificationBox"
import { SiteDataBox } from "./SiteDataBox"

type PopUpViewProps = {
	modelMetricsVal?: ModelMetricsResponse | null
	siteDataStateVal?: SiteData | null
	siteCategoryVal?: Category | SiteSeen | null
	focusModeStateVal?: boolean | "loading"
	siteClassificationStateVal?: SiteClassificationResponse | null
}

export default function PopUpView({
	modelMetricsVal = null,
	siteDataStateVal = null,
	siteCategoryVal = null,
	focusModeStateVal = false,
}: PopUpViewProps) {
	const [modelMetrics, setModelMetrics] = useState(modelMetricsVal)
	const [siteDataState, setSiteDataState] = useState(siteDataStateVal)
	const [siteCategory, setSiteCategory] = useState(siteCategoryVal)
	const [focusModeState, setFocusModeState] = useState<boolean | "loading">(
		focusModeStateVal
	)

	// initial model setup
	useEffect(() => {
		updateModelMetrics()
		updateSiteDataAndCategoryState()
		updateFocusToggleState()
	}, [])

	// Local state update functions
	const updateFocusToggleState = () => {
		checkFocusModeUseCase().then(response => {
			if (response.toggleStatus === undefined) return
			setFocusModeState(response.toggleStatus)
		})
	}

	const updateSiteDataAndCategoryState = () => {
		requestSiteDataUseCase().then(response => {
			const siteData: SiteData = JSON.parse(response.serialisedSiteData)
			setSiteDataState(siteData)
			updateSiteCategoryState(siteData)
		})
	}

	const updateModelMetrics = () => {
		requestModelMetricsUseCase()
			.then(response => {
				setModelMetrics(response)
			})
			.catch(error => {
				console.error("Error requesting model data", error)
			})
	}

	const updateSiteCategoryState = (siteData: SiteData) => {
		checkSiteSeenUseCase(JSON.stringify(siteData)).then(response => {
			setSiteCategory(response.seenBefore)
		})
	}

	// Classifier model interaction functions
	const toggleFocusMode = () => {
		setFocusModeState("loading")
		const toggleTo = !focusModeState

		toggleFocusModeUseCase(toggleTo).then(response => {
			if (response.toggleStatus === undefined) {
				setFocusModeState(false)
			} else {
				setFocusModeState(response.toggleStatus)
			}
		})
	}

	const resyncModel = () => {
		requestModelSyncUseCase()
			.then(response => {
				if (response.success === false || response.success === undefined) {
					throw new Error()
				}
				updateModelMetrics()
			})
			.catch(() => {
				setModelMetrics(null)
			})
	}

	// Repository interaction functions
	const addSite = (category: Category) => {
		addSiteUseCase(category, JSON.stringify(siteDataState))
			.then(response => {
				handleRepositoryChange(response)
			})
			.catch(() => {
				setModelMetrics(null)
			})
	}

	const removeSite = () => {
		if (siteCategory !== null && siteCategory !== SiteSeen.notSeen)
			removeSiteUseCase(JSON.stringify(siteDataState))
				.then(response => {
					handleRepositoryChange(response)
				})
				.catch(() => {
					setModelMetrics(null)
				})
	}

	const reclassifySite = () => {
		reclassifySiteUseCase(JSON.stringify(siteDataState))
			.then(response => {
				handleRepositoryChange(response)
			})
			.catch(() => {
				setModelMetrics(null)
			})
	}

	const handleRepositoryChange = (response: GenericResponse) => {
		if (response.success === false || response.success === undefined) {
			throw new Error(response.debugInfo)
		}
		updateModelMetrics()
		updateSiteCategoryState(siteDataState!!) // this feels bad
	}

	return (
		<Box maxW="400px" minW="300px" backgroundColor={COLORS.lightGrey} padding={4}>
			{siteDataState && modelMetrics ? (
				<>
					<SiteDataBox
						siteDataState={siteDataState}
						siteCategory={siteCategory}
					/>
					<Spacer p={3} />
					<RepositoryClassificationBox
						siteSeenBefore={siteCategory}
						addProductiveSite={() => addSite(Category.productive)}
						addProcrastinationSite={() => addSite(Category.procrastination)}
						removeSite={removeSite}
						reclassifySite={reclassifySite}
					/>
					<Spacer p={3} />
					<Flex alignItems="center" justifyContent="center">
						<Switch
							isChecked={focusModeState === true}
							isDisabled={focusModeState === "loading"}
							onChange={toggleFocusMode}
							m={2}
						/>
						Focus mode
					</Flex>
					<Spacer p={3} />
					<Box maxW="250px" m="0 auto">
						<ModelDataCard
							modelData={modelMetrics}
							showDownload
							resyncModel={resyncModel}
						/>
					</Box>
				</>
			) : (
				<>
					{!siteDataState && (
						<ErrorBox
							errorHeader="Content script not responding"
							errorText="You might need to refresh the page, or this 
							might not be a page that we can access data about 
							(eg a Chrome settings page)."
						/>
					)}
					<Spacer m="10px" />
					{!modelMetrics && (
						<ErrorBox
							errorHeader="Background script not responding"
							errorText="If you've just installed the extension,
							you might need to restart the browser first."
						/>
					)}
				</>
			)}
		</Box>
	)
}
