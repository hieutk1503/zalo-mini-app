import React, { useEffect } from "react";
import { Box, Text } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { useStore } from "@store";
import { MINI_APP_ID } from "@constants/common";

const Card = styled(Box)`
    ${tw`bg-white rounded-lg p-4 mb-3`}
`;

const Logo = styled.img`
    ${tw`w-16 h-16 rounded-lg object-cover mr-3`}
`;

const AboutPage: React.FC = () => {
    const [organization, getOrganization] = useStore(state => [
        state.organization,
        state.getOrganization,
    ]);

    useEffect(() => {
        if (!organization) {
            getOrganization({ miniAppId: MINI_APP_ID });
        }
    }, [organization]);

    const accounts = organization?.officialAccounts || [];

    return (
        <PageLayout title="Giới thiệu" id="about-page">
            <Box p={3}>
                <Card>
                    <Box tw="flex flex-row items-center">
                        {organization?.logoUrl ? (
                            <Logo
                                src={organization.logoUrl}
                                alt={organization?.name || ""}
                            />
                        ) : null}
                        <Box tw="flex-1">
                            <Text.Title size="normal" tw="text-text_1">
                                {organization?.name || "Chính quyền cơ sở"}
                            </Text.Title>
                        </Box>
                    </Box>
                    {organization?.description && (
                        <Text tw="text-text_1 mt-3 whitespace-pre-line">
                            {organization.description}
                        </Text>
                    )}
                </Card>

                {accounts.length > 0 && (
                    <Card>
                        <Text.Title size="small" tw="text-text_1 mb-2">
                            Kênh thông tin chính thức
                        </Text.Title>
                        {accounts.map(oa => (
                            <Box
                                key={oa.oaId || oa.name}
                                tw="py-2 border-b border-devider_1 last:border-0"
                            >
                                <Text tw="text-text_1 font-medium">
                                    {oa.name}
                                </Text>
                            </Box>
                        ))}
                    </Card>
                )}

                <Card>
                    <Text size="small" tw="text-text_2">
                        Thông tin lịch sử hình thành, cơ cấu tổ chức và cán bộ chủ
                        chốt được cập nhật bởi quản trị viên của địa phương.
                    </Text>
                </Card>
            </Box>
        </PageLayout>
    );
};

export default AboutPage;
