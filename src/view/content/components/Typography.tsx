import { Heading, ResponsiveValue, Text } from "@chakra-ui/react"
import React from "react"

// Typography file for the content script
// This is due to the content script not having access to the Chakra UI theme,
// so we need to manually coerce the font families here

const fontFamilies =
	'-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'

type TextProps = {
	children: React.ReactNode
	textAlign?: ResponsiveValue<
		| "-webkit-match-parent"
		| "center"
		| "end"
		| "justify"
		| "left"
		| "match-parent"
		| "right"
		| "start"
	>
	fontWeight?: ResponsiveValue<"normal" | "bold" | "bolder" | "lighter" | "semibold">
	color?: string
}

export function Heading1({ children, textAlign = "left", color = "#000000" }: TextProps) {
	return (
		<Heading
			fontSize="x-large"
			fontFamily={fontFamilies}
			textAlign={textAlign}
			color={color}
			verticalAlign="middle"
		>
			{children}
		</Heading>
	)
}

export function Heading2({ children, textAlign = "left", color = "#000000" }: TextProps) {
	return (
		<Heading
			fontSize="large"
			fontFamily={fontFamilies}
			textAlign={textAlign}
			color={color}
			verticalAlign="bottom"
		>
			{children}
		</Heading>
	)
}

export function Heading3({ children, textAlign = "left", color = "#000000" }: TextProps) {
	return (
		<Heading
			fontSize="medium"
			fontFamily={fontFamilies}
			textAlign={textAlign}
			color={color}
			verticalAlign="middle"
		>
			{children}
		</Heading>
	)
}

export function Body1({
	children,
	textAlign = "left",
	color = "#000000",
	fontWeight = "normal",
}: TextProps) {
	return (
		<Text
			fontSize="medium"
			fontFamily={fontFamilies}
			textAlign={textAlign}
			color={color}
			fontWeight={fontWeight}
			verticalAlign="middle"
		>
			{children}
		</Text>
	)
}

export function Body2({
	children,
	textAlign = "left",
	color = "#000000",
	fontWeight = "normal",
}: TextProps) {
	return (
		<Text
			fontSize="small"
			fontFamily={fontFamilies}
			textAlign={textAlign}
			color={color}
			fontWeight={fontWeight}
			verticalAlign="middle"
		>
			{children}
		</Text>
	)
}
