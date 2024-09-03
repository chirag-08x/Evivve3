import { MODULE_TYPE } from "src/views/pages/present/constants";
import { useNavigate, useParams } from "react-router";
import GameAdmin from "src/views/pages/present/components/GameAdmin";
import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedModule,
  getSessionInfo,
  resetPresentMode,
  togglePresentModeMenu,
} from "src/store/apps/present/PresentSlice";

const useExitPresentMode = () => {
  const selectedModule = useSelector(getSelectedModule);
  const { activeScreen } = useSelector((state) => state.present.game);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { programId } = useSelector(getSessionInfo);

  const handleExitPresentMode = (e, callback) => {
    // e.stopPropagation();
    if (selectedModule.name === MODULE_TYPE["evivve"] && activeScreen > 1) {
      GameAdmin.Logout();
    }
    dispatch(resetPresentMode());
    navigate(`/programs/${programId}`);
    dispatch(togglePresentModeMenu(false));
    if (callback)
        callback();
  };

  return handleExitPresentMode;
};

export default useExitPresentMode;
