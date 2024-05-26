import { Box, Button, Stack, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Category, SiteData, SiteSeen } from "../../data/models/SiteData"
import { GenericResponse, ModelMetricsResponse, SiteClassificationResponse } from "../../messagePassing/base/MessageTypes"
import { addSiteUseCase, reclassifySiteUseCase, removeSiteUseCase } from "../../messagePassing/repositoryUseCases"
import {
	requestModelMetricsUseCase,
	requestModelSyncUseCase,
} from "../../messagePassing/classificationModelUseCases"
import { requestSiteClassificationUseCase } from "../../messagePassing/classificationModelUseCases"
import { requestSiteDataUseCase } from "../../messagePassing/requestSiteDataUseCases"
import { ModelDataCard } from "./ModelDataCard"
import { RepositoryClassificationBox } from "./RepositoryClassificationBox"

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
	const [siteClassificationState, setSiteClassificationState] = useState(siteClassificationStateVal)

	// initial model setup
	useEffect(() => {
		updateModelMetrics()
		updateSiteDataState()
	}, [])

	const updateSiteDataState = () => {
		requestSiteDataUseCase().then(response => {
			const siteData: SiteData = JSON.parse(response.serialisedSiteData)
			setSiteDataState(siteData)
			updateSiteClassificationState(siteData)
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

	const updateSiteClassificationState = (siteData: SiteData) => {
		if (siteData.domain === undefined) { return }

		requestSiteClassificationUseCase(siteData).then(response => {
			console.log("Response from background script:", response)
			if (response.seenBefore !== undefined)
				setSiteCategory(response.seenBefore)
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
		updateSiteClassificationState(siteDataState!)
	}

	return (
		<Box padding={4}>
			<ModelDataCard 
				modelData={modelMetrics} 
				resyncModel={resyncModel}
			/>
			{siteDataState ? (
				<RepositoryClassificationBox
					siteSeenBefore={siteCategory}
					addProductiveSite={() => addSite(Category.productive)}
					addProcrastinationSite={() => addSite(Category.procrastination)}
					removeSite={removeSite}
					reclassifySite={reclassifySite}
				/>
			) : (
				<Box flex={1} justifyContent="center">
					<Text>Error: we can't seem to get the data about the current page.</Text>
					<Text>You might need to refresh the page.</Text>
				</Box>
			)}
		</Box>
	)
}
