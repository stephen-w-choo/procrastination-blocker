import {
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
} from "@chakra-ui/react"
import React from "react"
import { Category } from "../../../data/models/Category"
import { ChevronUpIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"

type KeywordWeightInputProps = {
	weight: number
	index: number
	handleSubmit: (newWeight: number, index: number) => void
}

export function KeywordWeightInput({
	weight,
	index,
	handleSubmit,
}: KeywordWeightInputProps) {
	return (
		<NumberInput
			step={1}
			defaultValue={weight}
			min={1}
			max={20}
			onChange={value => {
				handleSubmit(parseInt(value), index)
			}}
			size="xs"
			w="50px"
		>
			<NumberInputField pl={1} pr={0} textAlign="left" />
			<NumberInputStepper width="16px">
				<NumberIncrementStepper children={<TriangleUpIcon boxSize={2} />} />
				<NumberDecrementStepper children={<TriangleDownIcon boxSize={2} />} />
			</NumberInputStepper>
		</NumberInput>
	)
}
