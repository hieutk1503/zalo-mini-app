import { useEffect } from "react";
import { useStore } from "@store";
import { initZaloSession, isZaloDevMode } from "../lib/zalo";

const Auth = () => {
    const [token, setToken, setUser] = useStore(state => [
        state.token,
        state.setToken,
        state.setUser,
    ]);

    useEffect(() => {
        const init = async () => {
            if (isZaloDevMode()) {
                setToken("dev-token");
                setUser({
                    id: "dev-user",
                    name: "Developer",
                    avatar: "",
                });
                return;
            }
            const session = await initZaloSession();
            if (session) {
                setToken(session.accessToken);
                setUser({
                    id: session.id,
                    name: session.name,
                    avatar: session.avatarUrl || "",
                });
            }
        };

        if (!token) {
            init();
        }
    }, [token, setToken, setUser]);

    return null;
};

export default Auth;
