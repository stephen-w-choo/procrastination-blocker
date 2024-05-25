import { Box, Button, Stack, Text } from "@chakra-ui/react"
import React from "react"
import { Category, SiteSeen } from "../../data/models/SiteData"

type RepositoryClassificationBoxProps = {
    siteSeenBefore: Category | SiteSeen | null
    addProductiveSite: () => void
    addProcrastinationSite: () => void
    removeSite: () => void
    reclassifySite: () => void
}

export function RepositoryClassificationBox({
    siteSeenBefore,
    addProductiveSite,
    addProcrastinationSite,
    removeSite,
    reclassifySite,
}: RepositoryClassificationBoxProps) {
    console.log("siteSeenBefore", siteSeenBefore)

    const ClassificationOptions = () => {
        switch (siteSeenBefore) {
            case undefined || null:
                return (<>
                    <Text>Error: we can't seem to access the database.</Text>
                    <Text>You might need to disable and re-enable the extension.</Text>
                </>)
            case SiteSeen.notSeen:
                return (<>
                    <Button
                        onClick={addProcrastinationSite}
                        width="100%"
                        colorScheme="red"
                        background="white"
                        variant="outline"
                        textAlign={"left"}
                    >
                        <Text>Classify as non-productive</Text>
                    </Button>
                    <Button
                        onClick={addProductiveSite}
                        width="100%"
                        colorScheme="green"
                        background="white"
                        variant="outline"
                    >
                        <Text>Classify as productive</Text>
                    </Button>
                </>)
            case Category.productive: 
            case Category.procrastination:
                return (<>
                    <Button
                        onClick={removeSite}
                        width="100%"
                        colorScheme="red"
                        background="white"
                        variant="outline"
                        textAlign={"left"}
                        >
                        <Text>Remove site</Text>
                    </Button>
                    <Button
                        onClick={reclassifySite}
                        width="100%"
                        colorScheme="orange"
                        background="white"
                        variant="outline"
                        >
                        <Text>Reclassify this site</Text>
                    </Button>
                </>)
        }
    }

    return (
        <Box flex={1}>
            <Stack>
                <ClassificationOptions />
            </Stack>
        </Box>
    )
}