import {
  getSelectedCustomizeModule,
  toggleEditFlag,
  toggleAdjustContextDialog,
  getSelectedProgram,
} from "src/store/apps/programs/ProgramSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  FormField,
  CustomizeWrapper,
  CustomizeLabel,
} from "./CustomizeStyles";
import Header from "./Header";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import Accordion from "src/components/shared/Accordion";
import { BtnWrapper } from "src/components/shared/BtnWrapper";
import { useState } from "react";
import { useEditGameModule } from "src/services/programs";
import styled from "@emotion/styled";
import EditIcon from "@mui/icons-material/Edit";

const EditWrapper = styled("div")`
  border: 1.5px solid #0d2359;
  border-radius: 8px;
  background-color: "#F5F6F8";
  padding: 0.5rem;
  font-size: 14px;
  color: #2a3547;
  display: flex;
  gap: 0 1.5rem;
`;

const EditBtn = styled("button")`
  background: transparent;
  display: grid;
  place-items: center;
  border: none;
  cursor: pointer;
  font-size: 22px;
`;

const CustomizeGameModule = ({ owner }) => {
  const dispatch = useDispatch();
  const editFlag = useSelector((state) => state?.programs?.editFlag);
  const { selectedModule } = useSelector(getSelectedCustomizeModule);
  // const owner = useSelector(getSelectedProgram).owner;
  const [moduleValues, setModuleValues] = useState({
    ga_id: selectedModule.id,
    ga_pcx: selectedModule.ga_pcx,
    ga_pac: selectedModule.ga_pac,
    ga_lcx: selectedModule.ga_lcx,
    ga_dur_min: selectedModule.ga_dur_min,
    ga_hst: selectedModule.ga_hst,
    ga_con: selectedModule.ga_con,
    ga_diff: selectedModule.ga_diff,
    overallDifficulty: selectedModule.overallDifficulty,
    landHarvast: selectedModule.landHarvast,
    offers: selectedModule.offers,
    landPurchase: selectedModule.landPurchase,
  });
  const editGameModule = useEditGameModule();

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (!editFlag) {
      dispatch(toggleEditFlag(true));
    }

    if (name === "ga_pac") {
      value = String(10 - value);
    }

    if (typeof value === "number") {
      value = String(value);
    }

    setModuleValues({ ...moduleValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editGameModule.mutate(moduleValues);
  };

  return (
    <CustomizeWrapper>
      <Header headerText="Customize Evivve Settings" headerIcon={true} />

      <Form onSubmit={handleSubmit}>
        <FormField>
          <CustomizeLabel>Program and Learner Context</CustomizeLabel>
          <EditWrapper>
            Evivve's game settings are customized to suit your program and
            learner context. To tailor the game settings further, modify the
            learner context.
            <EditBtn
              onClick={() =>
                dispatch(
                  toggleAdjustContextDialog({
                    showDialog: true,
                    showBtn: true,
                  })
                )
              }
            >
              <EditIcon fontSize="32px" />
            </EditBtn>
          </EditWrapper>
        </FormField>

        <FormField>
          <CustomizeLabel>Game Settings</CustomizeLabel>
          <Accordion
            text="Evivve game settings designed specifically for your program and learner context"
            type="game"
            handleChange={handleChange}
            duration={Number(moduleValues.ga_dur_min)}
            cronos={Number(moduleValues.ga_hst)}
            difficulty={Number(moduleValues.ga_diff)}
            consequence={Number(moduleValues.ga_con)}
            pace={Number(moduleValues.ga_pac)}
            disabled={!owner}
          />
        </FormField>

        {/* <FormField>
          <CustomizeLabel>
            Mechanics Inventory{" "}
            <span style={{ fontWeight: 400 }}>(Advanced Settings)</span>
          </CustomizeLabel>
          <Accordion
            text="A detailed inventory of the mechanics that support the game settings"
            type="mechanicsInventory"
            handleChange={handleChange}
            disabled={!owner}
          />
        </FormField> */}
        {owner && (
          <BtnWrapper>
            <PrimaryBtn
              disabled={editGameModule.isLoading}
              style={{ justifySelf: "end" }}
              mt="0.5rem"
            >
              Save
            </PrimaryBtn>
          </BtnWrapper>
        )}
      </Form>
    </CustomizeWrapper>
  );
};

export default CustomizeGameModule;

