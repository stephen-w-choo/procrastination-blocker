import { Box, Button, Divider, Stack, Text, Tooltip, useToast } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { GroupedKeywordData, KeywordData } from "../../data/models/Settings"
import { SettingsResponse } from "../../messagePassing/base/MessageTypes"
import {
	getSettingsUseCase,
	setSettingsUseCase,
} from "../../messagePassing/settingsUseCases"
import { Heading1, Heading2 } from "../content/components/Typography"
import { KeywordsEditor } from "./KeywordsEditor"
import { OptionsKeywordData } from "./OptionsModels"
import { ThresholdSlider } from "./ThresholdSlider"
import { InfoIcon, QuestionOutlineIcon } from "@chakra-ui/icons"
import { COLORS } from "../colours"
import { requestModelSyncUseCase } from "../../messagePassing/classificationModelUseCases"

type OptionsViewProps = {
	initialKeywords?: GroupedKeywordData | null
	initialThreshold?: number | null
}

export default function OptionsView({
	initialKeywords = null,
	initialThreshold = null,
}: OptionsViewProps) {
	const idCounter = useRef(0)
	const toast = useToast()

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
		setProductiveKeywords(
			addIdToKeywordData(response.settings.keywordData.productive)
		)
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


		const settingsSavePromise = setSettingsUseCase(settings)
			.then(response => parseSettingsResponse(response))
			.then(() => requestModelSyncUseCase())
			.then(value => {
				if (value.success) {
					console.log("Model synced")
				} else {
					throw new Error("Error syncing models")
				}
			})

		toast.promise(settingsSavePromise, {
			success: {
				title: "Settings saved",
				description: "Your settings have been saved.",
				isClosable: true,
			},
			error: {
				title: "Error",
				description: "An error occurred while saving your settings.",
				isClosable: true,
			},
			loading: {
				title: "Saving...",
				description: "Saving your settings...",
				isClosable: false,
			},
		})
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
			<Stack m="0 auto" maxW="200ch">
				<Heading1>Options</Heading1>
				<Heading2 textAlign="center">
					Threshold
					<Tooltip
						label={
							<>
								<Text>
									The procrastination score required before the site is
									considered non-productive.
								</Text>
								<br />
								<Text>
									This determines how sensitive the extension is to a
									procrastination score. Higher thresholds will increase
									the chances of a reminder prompt appearing when
									visiting a site.
								</Text>
							</>
						}
					>
						<QuestionOutlineIcon mb={1} ml={4} color={COLORS.blue} />
					</Tooltip>
				</Heading2>
				<Divider m={3} />
				<ThresholdSlider
					threshold={percentageThreshold}
					setThreshold={setPercentageThreshold}
				/>
				<Box h={16} />
				<Heading2 textAlign="center">
					Keywords
					<Tooltip
						label={
							<>
								<Text>
									These keywords help classify sites as productive or
									non-productive, enhancing the trained model's
									decisions.
								</Text>
								<br />
								<Text>
									More heavily weighted keywords have a stronger
									influence on the classification.
								</Text>
								<br />
								<Text>
									You can manage these keywords by adding, editing, or
									deleting them.
								</Text>
							</>
						}
					>
						<QuestionOutlineIcon mb={1} ml={4} color={COLORS.blue} />
					</Tooltip>
				</Heading2>
				<Divider m={3} />
				<KeywordsEditor
					procrastinationKeywords={procrastinationKeywords}
					productiveKeywords={productiveKeywords}
					setProcrastinationKeywords={setProcrastinationKeywords}
					setProductiveKeywords={setProductiveKeywords}
					generateId={generateId}
				/>
				<Box h={8} />
				<Button
					m="0 auto"
					colorScheme="blue"
					fontSize="xl"
					onClick={saveSettings}
				>
					Save your settings
				</Button>
			</Stack>
		)
	} else {
		// error state
		return <></>
	}
}
