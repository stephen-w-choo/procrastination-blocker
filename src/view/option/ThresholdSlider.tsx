import {
	Box,
	Slider,
	SliderFilledTrack,
	SliderMark,
	SliderThumb,
	SliderTrack,
} from "@chakra-ui/react"
import React from "react"

type ThresholdSliderProps = {
	threshold: number
	setThreshold: (value: number) => void
}

export function ThresholdSlider({ threshold, setThreshold }: ThresholdSliderProps) {
	const labelStyles = {
		mt: "2",
		ml: "-2.5",
		fontSize: "sm",
	}

	return (
		<Box p={4} pt={6} width="400px" m="0 auto">
			<Slider
				defaultValue={threshold}
				min={5}
				max={100}
				step={5}
				onChange={val => setThreshold(val)}
			>
				<SliderMark value={25} {...labelStyles}>
					25%
				</SliderMark>
				<SliderMark value={50} {...labelStyles}>
					50%
				</SliderMark>
				<SliderMark value={75} {...labelStyles}>
					75%
				</SliderMark>
				<SliderMark
					value={threshold}
					textAlign="center"
					bg="blue.500"
					color="white"
					mt="-10"
					ml="-5"
					w="12"
				>
					{threshold}%
				</SliderMark>
				<SliderTrack>
					<SliderFilledTrack />
				</SliderTrack>
				<SliderThumb />
			</Slider>
		</Box>
	)
}
