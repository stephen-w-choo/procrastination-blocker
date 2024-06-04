import { Alert, AlertIcon, Flex, Text } from "@chakra-ui/react"
import React from "react"

type ErrorCardProps = {
	errorHeader: string
	errorText: string
}

export function ErrorBox({ errorHeader, errorText }: ErrorCardProps) {
	return (
		<Alert status="warning" flexDir={"column"} alignItems="baseline">
			<Flex>
				<AlertIcon />
				<Text fontWeight={"bold"}>{errorHeader}</Text>
			</Flex>
			<br />
			<Text>{errorText}</Text>
		</Alert>
	)
}
