import { Outlet } from "react-router-dom";
import { useUserInfo } from "src/services/user";

const PresenModeLayout = () => {
    useUserInfo();
    
    return(
        <>
            <Outlet />
        </>
    )
};

export default PresenModeLayout;
