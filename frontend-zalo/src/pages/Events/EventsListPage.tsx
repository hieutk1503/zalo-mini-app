import React, { useEffect } from "react";
import { useNavigate } from "zmp-ui";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState } from "@components";
import { Events } from "@components/home";
import { useStore } from "@store";

const EventsListPage: React.FC = () => {
    const navigate = useNavigate();
    const events = useStore(state => state.events);
    const getEvents = useStore(state => state.getEvents);

    useEffect(() => {
        getEvents?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PageLayout title="Sự kiện" id="events-page">
            {events && events.length ? (
                <Events
                    items={events}
                    onOpen={id => navigate(`/events/${id}`)}
                />
            ) : (
                <EmptyState title="Chưa có sự kiện" />
            )}
        </PageLayout>
    );
};

export default EventsListPage;
