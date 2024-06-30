import { Box, Button, Stack } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { GroupedKeywordData, KeywordData } from "../../data/models/Settings"
import { SettingsResponse } from "../../messagePassing/base/MessageTypes"
import { getSettingsUseCase, setSettingsUseCase } from "../../messagePassing/settingsUseCases"
import { Heading1, Heading2 } from "../content/components/Typography"
import { KeywordsEditor } from "./KeywordsEditor"
import { OptionsKeywordData } from "./OptionsModels"
import { ThresholdSlider } from "./ThresholdSlider"

type OptionsViewProps = {
	initialKeywords?: GroupedKeywordData | null
	initialThreshold?: number | null
}

export default function OptionsView({
	initialKeywords = null,
	initialThreshold = null,
}: OptionsViewProps) {
	const idCounter = useRef(0)
	const generateId = () => idCounter.current++

	const thresholdToPercentage = (threshold: number) => Math.round(threshold * 100)
	const percentageToThreshold = (percentage: number) => percentage / 100

	// the threshold is stored as a number from 0 to 1 in the model
	// for the purpose of the state, we want to store it as a percentage
	const [percentageThreshold, setPercentageThreshold] = useState(initialThreshold)
	const [procrastinationKeywords, setProcrastinationKeywords] = useState(
		addIdToKeywordData(initialKeywords?.procrastination)
	)
	const [productiveKeywords, setProductiveKeywords] = useState(
		addIdToKeywordData(initialKeywords?.productive)
	)

	useEffect(() => {
		getSettingsUseCase().then(response => {
			parseSettingsResponse(response)
		})
	}, [])

	function parseSettingsResponse(response: SettingsResponse) {
		setPercentageThreshold(thresholdToPercentage(response.settings.threshold))
		setProcrastinationKeywords(
			addIdToKeywordData(response.settings.keywordData.procrastination)
		)
		setProductiveKeywords(addIdToKeywordData(response.settings.keywordData.productive))
	}

	function saveSettings() {
		if (!percentageThreshold || !procrastinationKeywords || !productiveKeywords) {
			// error state
			return
		}
		const settings = {
			threshold: percentageToThreshold(percentageThreshold),
			keywordData: {
				procrastination: procrastinationKeywords,
				productive: productiveKeywords,
			},
		}
		setSettingsUseCase(settings)
			.then(response => parseSettingsResponse(response))
	}

	function addIdToKeywordData(
		keywordData?: KeywordData[]
	): OptionsKeywordData[] | undefined {
		if (!keywordData) {
			return undefined
		}

		return keywordData.map(keyword => {
			return {
				...keyword,
				id: generateId(),
			}
		})
	}

	if (percentageThreshold && procrastinationKeywords && productiveKeywords) {
		return (
			<Stack>
				<Heading1>Options</Heading1>
				<Heading2 textAlign="center">Threshold</Heading2>
				<ThresholdSlider
					threshold={percentageThreshold}
					setThreshold={setPercentageThreshold}
				/>
				<Box h={8} />
				<Heading2 textAlign="center">Keywords</Heading2>
				<KeywordsEditor
					procrastinationKeywords={procrastinationKeywords}
					productiveKeywords={productiveKeywords}
					setProcrastinationKeywords={setProcrastinationKeywords}
					setProductiveKeywords={setProductiveKeywords}
					generateId={generateId}
				/>
				<Box h={8} />
				<Button onClick={saveSettings}>Save your settings</Button>
			</Stack>
		)
	} else {
		// error state
		return <></>
	}
}
