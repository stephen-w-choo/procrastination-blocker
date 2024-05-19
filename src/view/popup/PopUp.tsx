import { Box, Button, Stack, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Category, SiteData } from "../../data/models/SiteData"
import { addSiteUseCase } from "../../messagePassing/classifySiteUseCases"
import { ModelDataCard } from "./ModelDataCard"
import { ModelDataResponse } from "../../messagePassing/base/MessageTypes"
import { requestModelDataUseCase, requestSiteStatusUseCase } from "../../messagePassing/requestModelDataUseCases"
import { requestSiteDataUseCase } from "../../messagePassing/requestSiteDataUseCases"

type PopUpProps = {
	siteData: SiteData | null
	seenBefore: boolean
}

export default function PopUp({ seenBefore }: PopUpProps) {
    const [modelData, setModelData] = useState<ModelDataResponse | null>(null)
    const [siteDataState, setSiteDataState] = useState<SiteData | null>(null)
    const [currentSiteCategory, setCurrentSiteCategory] = useState<Category | null>(null)

    // initial model setup
    useEffect(() => {
        requestModelDataUseCase().then(response => {
            setModelData(response)
        }).catch(error => {
            console.error("Error requesting model data", error)
        })

        requestSiteDataUseCase().then(response => {
            setSiteDataState(JSON.parse(response.serialisedSiteData))
            requestSiteStatusUseCase(JSON.parse(response.serialisedSiteData))
                .then(response => {
                    console.log("Site status response", response)
                })
        })
        
    }, [])
    
    const incrementModelData = (category: "procrastination" | "productive") => {
        if (modelData !== null) {
            setModelData({
                ...modelData,
                [category]: modelData[category] + 1
            })
        }
    }

	const addProcrastinationSite = () => {
		addSiteUseCase(Category.procrastination, JSON.stringify(siteDataState))
            .then(response => {
                console.log("Response", response)
                if (response.success) {
                    incrementModelData("procrastination")
                } else {
                    setModelData(null)
                }
            }).catch(() => { setModelData(null) })
	}

	const addProductiveSite = () => {
		addSiteUseCase(Category.productive, JSON.stringify(siteDataState))
            .then(response => {
                console.log("Response", response)
                if (response.success) {
                    incrementModelData("productive")
                } else {
                    setModelData(null)
                }
            }).catch(() => { setModelData(null) })
	}

	return (
		<Box padding={4}>
            <ModelDataCard modelData={modelData} />
			{siteDataState ? (
				<Box flex={1}>
					<Stack>
						<Button
							onClick={addProcrastinationSite}
							width="100%"
							colorScheme="red"
							background="white"
							variant="outline"
							textAlign={"left"}
						>
							<Text>Mark this site as non-productive</Text>
						</Button>
						<Button
							onClick={addProductiveSite}
							width="100%"
							colorScheme="green"
							background="white"
							variant="outline"
						>
							<Text>Mark this site as productive</Text>
						</Button>
					</Stack>
				</Box>
			) : (
				<Box>
					<Text>Site data not available</Text>
				</Box>
			)}
		</Box>
	)
}
