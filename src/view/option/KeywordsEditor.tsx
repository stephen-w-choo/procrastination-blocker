import { AddIcon, ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@chakra-ui/icons"
import {
	Box,
	Card,
	Flex,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react"
import React from "react"
import { Category, opposite } from "../../data/models/Category"
import { Heading2 } from "../content/components/Typography"
import { KeywordsIconButton } from "./components/KeywordsIconButton"
import { KeywordsTextInput } from "./components/KeywordsTextInput"
import { KeywordWeightInput } from "./components/KeywordWeightInput"
import { OptionsKeywordData } from "./OptionsModels"

type KeywordsEditorProps = {
	procrastinationKeywords: OptionsKeywordData[]
	productiveKeywords: OptionsKeywordData[]
	setProcrastinationKeywords: (keywords: OptionsKeywordData[]) => void
	setProductiveKeywords: (keywords: OptionsKeywordData[]) => void
	generateId: () => number
}

export function KeywordsEditor({
	procrastinationKeywords,
	productiveKeywords,
	setProcrastinationKeywords,
	setProductiveKeywords,
	generateId,
}: KeywordsEditorProps) {
	function getKeywordState(type: Category) {
		return type === Category.procrastination
			? procrastinationKeywords
			: productiveKeywords
	}

	function getKeywordStateSetter(type: Category) {
		return type === Category.procrastination
			? setProcrastinationKeywords
			: setProductiveKeywords
	}

	function handleKeywordSubmit<
		T extends OptionsKeywordData,
		K extends keyof OptionsKeywordData,
	>(type: Category, index: number, key: K, value: T[K]) {
		const keywordState = getKeywordState(type)
		const setKeywordState = getKeywordStateSetter(type)

		const newKeywords = [...keywordState]
		newKeywords[index][key] = value
		setKeywordState(newKeywords)
	}

	function handleReclassifyKeyword(currentType: Category, index: number) {
		// the keyword state that the keyword is currently in
		const previousKeywordState = getKeywordState(currentType)
		const currentKeyword = previousKeywordState[index]
		const newType = opposite(currentType)

		// remove the keyword from the current type
		removeKeyword(currentType, index)
		// add the keyword to the new type
		addKeyword(newType, currentKeyword)
	}

	function removeKeyword(type: Category, index: number) {
		const keywordState = getKeywordState(type)
		const setKeywordState = getKeywordStateSetter(type)
		setKeywordState(keywordState.filter((_, i) => i !== index))
	}

	function addKeyword(type: Category, keywordData: OptionsKeywordData | null = null) {
		const keywordState = getKeywordState(type)
		const setKeywordState = getKeywordStateSetter(type)

		if (keywordData === null) {
			keywordData = {
				id: generateId(),
				text: "<click to edit>",
				weight: 5,
			}
		}

		setKeywordState([...keywordState, keywordData])
	}

	return (
		// Make two columns
		<Flex justifyContent="center">
			<Card borderTopEndRadius="0px" borderBottomEndRadius="0px" p={2}>
				<Heading2 textAlign="center">Procrastination</Heading2>
				<TableContainer mt={8}>
					<Table size="sm" colorScheme="blackAlpha">
						<Thead>
							<Tr>
								<Th>weight</Th>
								<Th textAlign="center">Keyword</Th>
								<Th> {/* spacer */} </Th>
							</Tr>
						</Thead>
						<Tbody>
							{procrastinationKeywords.map((keyword, index) => (
								<Tr key={keyword.id}>
									<Td>
										<KeywordWeightInput
											weight={keyword.weight}
											index={index}
											handleSubmit={(newWeight, index) =>
												handleKeywordSubmit(
													Category.procrastination,
													index,
													"weight",
													newWeight
												)
											}
										/>
									</Td>
									<Td textAlign="center">
										<KeywordsTextInput
											text={keyword.text}
											onSubmit={newText =>
												handleKeywordSubmit(
													Category.procrastination,
													index,
													"text",
													newText
												)
											}
										/>
									</Td>
									<Td>
										<KeywordsIconButton
											ariaLabel="delete"
											icon={<CloseIcon boxSize={3} />}
											onClick={() =>
												removeKeyword(
													Category.procrastination,
													index
												)
											}
										/>
										<KeywordsIconButton
											ariaLabel="reclassify"
											icon={<ArrowRightIcon boxSize={3} />}
											onClick={() =>
												handleReclassifyKeyword(
													Category.procrastination,
													index
												)
											}
										/>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
				<Flex justifyContent="center">
					<KeywordsIconButton
						ariaLabel="add"
						icon={<AddIcon boxSize={3} />}
						onClick={() => addKeyword(Category.procrastination)}
					/>
				</Flex>
			</Card>
			<Card borderTopStartRadius="0px" borderBottomStartRadius="0px" p={2}>
				<Heading2 textAlign="center">Productive</Heading2>
				<TableContainer mt={8}>
					<Table size="sm" colorScheme="blackAlpha">
						<Thead>
							<Tr>
								<Th></Th>
								<Th textAlign="center">Keyword</Th>
								<Th>weight</Th>
							</Tr>
						</Thead>
						<Tbody>
							{productiveKeywords.map((keyword, index) => (
								<Tr key={keyword.id}>
									<Td>
										<KeywordsIconButton
											ariaLabel="reclassify"
											icon={<ArrowLeftIcon boxSize={3} />}
											onClick={() =>
												handleReclassifyKeyword(
													Category.productive,
													index
												)
											}
										/>
										<KeywordsIconButton
											ariaLabel="delete"
											icon={<CloseIcon boxSize={3} />}
											onClick={() =>
												removeKeyword(Category.productive, index)
											}
										/>
									</Td>
									<Td textAlign="center">
										<KeywordsTextInput
											text={keyword.text}
											onSubmit={newText =>
												handleKeywordSubmit(
													Category.productive,
													index,
													"text",
													newText
												)
											}
										/>
									</Td>
									<Td>
										<KeywordWeightInput
											weight={keyword.weight}
											index={index}
											handleSubmit={(newWeight, index) =>
												handleKeywordSubmit(
													Category.productive,
													index,
													"weight",
													newWeight
												)
											}
										/>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
				<Flex justifyContent="center">
					<KeywordsIconButton
						ariaLabel="add"
						icon={<AddIcon boxSize={3} />}
						onClick={() => addKeyword(Category.productive)}
					/>
				</Flex>
			</Card>
		</Flex>

		// Each row in the column will contain an Editable, a NumberInput, and a button to switch
	)
}
