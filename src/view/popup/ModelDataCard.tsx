import {
	Button,
	Card,
	FormLabel,
	Input,
	Spacer,
	Stat,
	StatGroup,
	Text,
} from "@chakra-ui/react"
import React from "react"
import {
	exportLocalStorage,
	importLocalStorage,
} from "../../messagePassing/chromeLocalStorageCases"
import { Body2, Heading2, Heading3 } from "../content/components/Typography"

type ModelDataCardProps = {
	modelData: {
		procrastination: number
		productive: number
		changesSinceLastSync: number
	}
	showChanges?: boolean
	showDownload?: boolean
	resyncModel: () => void
}

export function ModelDataCard({
	modelData,
	showChanges,
	showDownload,
	resyncModel,
}: ModelDataCardProps) {
	const changesSection = () => {
		if (modelData?.changesSinceLastSync === 0) {
			return <Text fontSize="small">Model is up to date with data</Text>
		} else {
			return (
				<>
					<Text fontSize="small">
						Changes since last sync:{" "}
						<strong>{modelData?.changesSinceLastSync}</strong>
					</Text>
					<Button
						onClick={() => {
							resyncModel()
						}}
						h={8}
						m={2}
					>
						<Body2>Resync model</Body2>
					</Button>
				</>
			)
		}
	}

	const downloadModel = () => {
		// TODO - refactor this part, increase type safety
		exportLocalStorage().then(data => {
			triggerDownload(data, "model_data.json")
		})

		const triggerDownload = (data: Object, downloadName: string) => {
			const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.download = downloadName
			a.href = url

			const clickEvent = new MouseEvent("click")
			a.dispatchEvent(clickEvent)
			a.remove()
		}
	}

	const uploadModel = (e: React.ChangeEvent<HTMLInputElement>) => {
		// TODO - refactor this part, increase type safety
		e.preventDefault()

		const file = e.target.files!![0]

		const reader = new FileReader()
		reader.onload = e => {
			const json = JSON.parse(e.target?.result as string)
			importLocalStorage(json)
		}
		reader.readAsText(file)
	}

	function HackedUploadInput(
		action: (event: React.ChangeEvent<HTMLInputElement>) => void
	) {
		return (
			<FormLabel
				position="absolute"
				htmlFor="import-json"
				className="import-button"
				h="100%"
				w="100%"
				display="flex"
				alignItems="center"
				justifyContent="center"
				m="0"
				_hover={{ cursor: "pointer" }}
			>
				<Input
					type="file"
					id="import-json"
					accept=".json"
					onChange={action}
					h="100%"
					w="100%"
					display="none"
				/>
			</FormLabel>
		)
	}

	const DownloadSection = () => {
		return (
			<>
				<Button
					onClick={downloadModel}
					maxW="200px"
					m="5px auto"
					fontSize="small"
				>
					Download model data
				</Button>
				<Button maxW="200px" m="5px auto" fontSize="small">
					Upload a previous model
					{HackedUploadInput(uploadModel)}
				</Button>
			</>
		)
	}

	return (
		<Card p={3} backgroundColor="white">
			<Heading3 textAlign="center">Text classifier data</Heading3>
			<Spacer p={2} />
			<StatGroup>
				<Stat>
					<Heading2 textAlign={"center"}>{modelData.productive}</Heading2>
					<Body2 textAlign={"center"}>productive</Body2>
				</Stat>
				<Stat>
					<Heading2 textAlign={"center"}>{modelData.procrastination}</Heading2>
					<Body2 textAlign={"center"}>procrastination</Body2>
				</Stat>
			</StatGroup>
			<Spacer p={2} />
			{showChanges && changesSection()}
			{showDownload && DownloadSection()}
		</Card>
	)
}
