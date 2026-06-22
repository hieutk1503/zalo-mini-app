import React, { useEffect } from "react";
import { Box, Icon, Text } from "zmp-ui";
import { openPhone } from "zmp-sdk";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Button } from "@components/customized";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { openWebView } from "@service/zalo";

const Card = styled(Box)`
    ${tw`bg-white rounded-lg p-4 mb-3`}
`;

const Row = styled.div`
    ${tw`flex flex-row items-start mb-3`}
`;

const LocationPage: React.FC = () => {
    const [officeLocations, getOfficeLocations, loading] = useStore(state => [
        state.officeLocations,
        state.getOfficeLocations,
        state.gettingOfficeLocations,
    ]);

    useEffect(() => {
        if (!officeLocations) {
            getOfficeLocations();
        }
    }, []);

    if (!loading && (!officeLocations || officeLocations.length === 0)) {
        return (
            <PageLayout title="Bản đồ - Trụ sở">
                <EmptyDataContainer />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Bản đồ - Trụ sở" id="location-page">
            <Box p={3}>
                {(officeLocations || []).map(loc => (
                    <Card key={loc.id}>
                        <Text tw="text-text_1 font-medium text-base mb-3">
                            {loc.name}
                        </Text>
                        <Row>
                            <Icon icon="zi-location" tw="text-main mr-2" />
                            <Text tw="text-text_1 flex-1">{loc.address}</Text>
                        </Row>
                        {loc.workingHours && (
                            <Row>
                                <Icon icon="zi-clock-1" tw="text-main mr-2" />
                                <Text tw="text-text_1 flex-1">
                                    {loc.workingHours}
                                </Text>
                            </Row>
                        )}
                        {loc.phoneNumber && (
                            <Row>
                                <Icon icon="zi-call" tw="text-main mr-2" />
                                <Text tw="text-text_1 flex-1">
                                    {loc.phoneNumber}
                                </Text>
                            </Row>
                        )}
                        <Box tw="flex flex-row gap-2 mt-2">
                            {loc.mapUrl && (
                                <Button
                                    fullWidth
                                    size="small"
                                    suffixIcon={<Icon icon="zi-location" />}
                                    onClick={() =>
                                        openWebView(loc.mapUrl as string)
                                    }
                                >
                                    Chỉ đường
                                </Button>
                            )}
                            {loc.phoneNumber && (
                                <Button
                                    fullWidth
                                    size="small"
                                    suffixIcon={<Icon icon="zi-call" />}
                                    onClick={() =>
                                        openPhone({
                                            phoneNumber: (
                                                loc.phoneNumber as string
                                            ).replace(/\s/g, ""),
                                            fail: err => console.error(err),
                                        })
                                    }
                                >
                                    Gọi
                                </Button>
                            )}
                        </Box>
                    </Card>
                ))}
            </Box>
        </PageLayout>
    );
};

export default LocationPage;
