import { Box, Card, Flex, Spacer, Switch, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Category, SiteData, SiteSeen } from "../../data/models/SiteData"
import {
	GenericResponse,
	ModelMetricsResponse,
	SiteClassificationResponse,
} from "../../messagePassing/base/MessageTypes"
import {
	requestModelMetricsUseCase,
	requestModelSyncUseCase,
	requestSiteClassificationUseCase,
} from "../../messagePassing/classificationModelUseCases"
import {
	addSiteUseCase,
	checkSiteSeenUseCase,
	reclassifySiteUseCase,
	removeSiteUseCase,
} from "../../messagePassing/repositoryUseCases"
import { requestSiteDataUseCase } from "../../messagePassing/requestSiteDataUseCases"
import { COLORS } from "../colours"
import { ModelDataCard } from "./ModelDataCard"
import { RepositoryClassificationBox } from "./RepositoryClassificationBox"
import { SiteDataBox } from "./SiteDataBox"

type PopUpViewProps = {
	modelMetricsVal?: ModelMetricsResponse | null
	siteDataStateVal?: SiteData | null
	siteCategoryVal?: Category | SiteSeen | null
	siteClassificationStateVal?: SiteClassificationResponse | null
}

export default function PopUp({
	modelMetricsVal = null,
	siteDataStateVal = null,
	siteCategoryVal = null,
	siteClassificationStateVal = null,
}: PopUpViewProps) {
	const [modelMetrics, setModelMetrics] = useState(modelMetricsVal)
	const [siteDataState, setSiteDataState] = useState(siteDataStateVal)
	const [siteCategory, setSiteCategory] = useState(siteCategoryVal)
	const [siteClassificationState, setSiteClassificationState] = useState(
		siteClassificationStateVal
	)

	// initial model setup
	useEffect(() => {
		updateModelMetrics()
		updateSiteDataState()
	}, [])

	const updateSiteDataState = () => {
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
			console.log(response)
		})
	}

	const updateSiteClassificationState = (siteData: SiteData) => {
		if (siteData.domain === undefined) {
			return
		}

		requestSiteClassificationUseCase(siteData).then(response => {
			console.log("Response from background script:", response)
			// setSiteClassificationState(response.category) TODO
		})
	}

	const resyncModel = () => {
		requestModelSyncUseCase()
			.then(response => {
				if (response.success === false || response.success === undefined) {
					throw new Error(response.debugInfo)
				}
				updateModelMetrics()
			})
			.catch(() => {
				setModelMetrics(null)
			})
	}

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

	const toggleFocusMode = () => {
		// TODO
	}

	return (
		<Box padding={4} minW="300px">
			<Card backgroundColor={COLORS.lightGrey} p={2}>
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
							addProcrastinationSite={() =>
								addSite(Category.procrastination)
							}
							removeSite={removeSite}
							reclassifySite={reclassifySite}
						/>

						<Spacer p={3} />
						<Flex alignItems="center" justifyContent="center">
							<Switch m={2} />
							Focus mode
						</Flex>
						<Spacer p={3} />
						<ModelDataCard
							modelData={modelMetrics}
							showChanges={false}
							resyncModel={resyncModel}
						/>
					</>
				) : (
					<>
						( siteDataState &&
						<Box>
							<Box flex={1} justifyContent="center">
								<Text>
									Error: we can't seem to get the data about the current
									page.
								</Text>
								<Text>
									You might need to refresh the page, or this might not
									be a page that we can access.
								</Text>
							</Box>
						</Box>
						) ( modelMetrics &&
						<Box>
							<Box flex={1} justifyContent="center">
								<Text>
									Error: we can't seem to get the data about the model.
								</Text>
								<Text>
									There appears to be an issue with the background
									process.
								</Text>
							</Box>
						</Box>
						)
					</>
				)}
			</Card>
		</Box>
	)
}
