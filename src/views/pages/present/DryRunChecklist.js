import { ArrowDropDown, Edit, ExpandMore, Shortcut } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { setMonth } from "date-fns";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getPresentModules,
  getSessionInfo,
  setSelectedModule,
} from "src/store/apps/present/PresentSlice";
import {
  getProgramId,
  toggleCustomizeDialog,
} from "src/store/apps/programs/ProgramSlice";
import { animTo, easeInExpo, easeOutQuint } from "src/utils/couchAnim";

import "./checkbox.css";
import "./checklist.css";
import "./loader.css";
import {
  getChecklist,
  setCheck,
  setChecklist,
  useChecklist,
  usePatchChecklist,
} from "./DryRunChecklistSlice";

import { isSocket } from "./components/ModuleFooter";

export const ChecklistActions = {
  openSection: () => {},
  toggleDryRun: () => {},
  openSectionByIndex: () => {},
};

function getChecklistIndex(id) {
  switch (id.split(":")[0]) {
    case "LEARNER_ACTIVATION":
      return 1;
    case "STRATEGY_PLANNING":
      return 2;
    case "EVIVVE":
      return 3;
    case "REFLECTION":
      return 4;
    case "DEBRIEF":
      return 5;
    case "_all_":
      return -1;
  }
}

const Checkbox = ({ id, label, name, checked, onCheck, isSubcheck }) => {
  const dispatch = useDispatch();
  const modules = useSelector(getPresentModules);

  function onChange(evt) {
    if (isSocket) return;

    if (isSubcheck) {
      console.log({ id, checked: evt.target.checked });
      onCheck(id, evt.target.checked);
    } else {
      ChecklistActions["openSection"](id);
      const index = getChecklistIndex(id);
      if (index > -1) {
        dispatch(setSelectedModule(modules[index]));
      }
    }
  }

  function onShortcut() {
    if (isSocket) return;
    ChecklistActions["openSection"](id.split(":")[0]);
  }

  function onEdit() {
    console.log("On Edit", name);
    dispatch(toggleCustomizeDialog(name));
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: isSubcheck ? "16px" : "18px",
        marginTop: "5px",
        marginBottom: isSubcheck ? "5px" : "10px",
        paddingLeft: isSubcheck ? "25px" : "0px",
        fontWeight: isSubcheck ? "normal" : "bold",
        textWrap: "nowrap",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          textWrap: "nowrap",
          marginRight: "10px",
        }}
      >
        {isSocket ? (
          <span
            className="checklist_loader"
            style={{ width: "20px", height: "20px", marginRight: "5 px" }}
          ></span>
        ) : (
          <input
            type="checkbox"
            checked={checked}
            className={`drc-checkbox ${isSubcheck && "small"}`}
            onChange={onChange}
          />
        )}
        <span style={{ lineHeight: "1.5" }} onClick={onChange}>
          {label}
        </span>
      </label>
      {isSubcheck && (
        <Tooltip title="Edit">
          <Edit
            style={{ marginRight: "2px", fontSize: "24px", cursor: "pointer" }}
            className="hover-icon"
            onClick={onEdit}
          />
        </Tooltip>
      )}
      {false && isSubcheck && (
        <Tooltip title="Goto">
          <Shortcut
            style={{ fontSize: "26px", cursor: "pointer" }}
            className="hover-icon"
            onClick={onShortcut}
          />
        </Tooltip>
      )}
    </div>
  );
};

const CheckboxList = forwardRef(({ id, name, sublist, onCheck }, ref) => {
  return (
    <div className="drc-content" ref={ref}>
      <Checkbox
        id={id}
        onCheck={onCheck}
        label={name}
        checked={sublist.reduce((acc, curr) => acc && curr.check, true)}
      />
      {sublist.map((obj) => (
        <Checkbox
          key={obj.id}
          id={id + ":" + obj.id}
          label={obj.name}
          name={name}
          onCheck={onCheck}
          checked={obj.check}
          isSubcheck={true}
        />
      ))}
    </div>
  );
});

const SUB_CHECK_HEIGHT = 34;
const CHECK_HEIGHT = 42;

const DryRunChecklist = () => {
  const [open, setOpen] = useState(false);
  const [isViewAll, setViewAll] = useState(true);

  const sessionInfo = useSelector(getSessionInfo);
  const programId = sessionInfo.programId;
  const patchChecklist = usePatchChecklist(programId);
  const fetchChecklist = useChecklist(programId);

  const buttonRef = useRef();
  const headRef = useRef();
  const buttonTextRef = useRef();
  const downIconRef = useRef();
  const footerRef = useRef();
  const bodyRef = useRef();

  const laRef = useRef();
  const spRef = useRef();
  const gaRef = useRef();
  const reRef = useRef();
  const deRef = useRef();
  const allRef = useRef();

  const checklist = useSelector(getChecklist);
  console.log("CL", checklist);
  const [mods, setMods] = useState([
    { id: "LEARNER_ACTIVATION", shown: false, last: Date.now() },
    { id: "STRATEGY_PLANNING", shown: false, last: Date.now() },
    { id: "EVIVVE", shown: false, last: Date.now() },
    { id: "REFLECTION", shown: false, last: Date.now() },
    { id: "DEBRIEF", shown: false, last: Date.now() },
    { id: "_all_", shown: true, last: Date.now() + 1000 },
  ]);

  useEffect(() => {
    //TODO: Horrible design. Temp fix, due to dependency on programId from sessionInfo
    setTimeout(() => {
      if (!fetchChecklist.isFetched) {
        fetchChecklist.refetch();
      }
    }, 2000);
  }, []);

  useEffect(() => {
    laRef.current.style.opacity = "0";
    laRef.current.style.display = "none";
    spRef.current.style.opacity = "0";
    spRef.current.style.display = "none";
    gaRef.current.style.opacity = "0";
    gaRef.current.style.display = "none";
    reRef.current.style.opacity = "0";
    reRef.current.style.display = "none";
    deRef.current.style.opacity = "0";
    deRef.current.style.display = "none";
    allRef.current.style.opacity = "1";

    bodyRef.current.style.height = `${getHeight("_all_")}px`;
  }, []);

  function getHeight(section) {
    if (section == "_all_") {
      return checklist.length * CHECK_HEIGHT + 10;
    }

    console.log("SECTION: " + section);
    const obj = checklist.find((obj) => obj.id == section);
    return CHECK_HEIGHT + obj.sublist.length * SUB_CHECK_HEIGHT + 30;
  }

  function getRef(section) {
    switch (section) {
      case "LEARNER_ACTIVATION":
        return laRef;
      case "STRATEGY_PLANNING":
        return spRef;
      case "EVIVVE":
        return gaRef;
      case "REFLECTION":
        return reRef;
      case "DEBRIEF":
        return deRef;
      case "_all_":
        return allRef;
    }
  }

  function calculateOpenHeight(section) {
    return (
      42 +
      10 +
      getHeight(section || mods.find((obj) => obj.shown == true).id) +
      31
    );
  }

  ChecklistActions["openSection"] = (section) => {
    if (isViewAll) {
      openSection_(section);
      setViewAll(false);
    }
  };

  ChecklistActions["openSectionByIndex"] = (index) => {
    if (index < 1 || index > 5) throw new Error("Index not in range");

    const section = mods[index - 1].id;
    if (isViewAll) {
      openSection_(section);
      setViewAll(false);
    } else {
      openSection_(section);
    }
  };

  ChecklistActions["toggleDryRun"] = () => {
    if (!open) {
      animTo(downIconRef.current, {
        duration: 1000,
        rotate: 3.14159,
        ease: easeOutQuint,
      });
      animTo(buttonRef.current, {
        duration: 1000,
        width: 300,
        height: calculateOpenHeight(),
        ease: easeOutQuint,
      });
      animTo(buttonTextRef.current, {
        duration: 1000,
        width: 150,
        ease: easeOutQuint,
      });
      setOpen(true);
    }
  };

  function openSection_(section) {
    let old = mods.find((obj) => obj.shown == true);
    let neww = mods.find((obj) => obj.id == section);

    old.shown = false;
    neww.shown = true;
    neww.last = Date.now();

    animTo(
      getRef(old.id).current,
      { duration: 1000, opacity: 0, ease: easeOutQuint },
      {
        onCompleted: (elList) => {
          elList.map((el) => (el.style.display = "none"));
        },
      }
    );
    animTo(
      getRef(neww.id).current,
      { duration: 1000, opacity: 1, ease: easeOutQuint },
      {
        onStart: (elList) => {
          elList.map((el) => (el.style.display = "block"));
        },
      }
    );

    animTo(buttonRef.current, {
      duration: 1000,
      height: calculateOpenHeight(neww.id),
      ease: easeOutQuint,
    });
    animTo(bodyRef.current, {
      duration: 1000,
      height: getHeight(neww.id),
      ease: easeOutQuint,
    });

    setMods([...mods]);
  }

  function onClick() {
    if (isSocket) return;

    if (open) {
      animTo(downIconRef.current, {
        duration: 1000,
        rotate: 0,
        ease: easeOutQuint,
      });
      animTo(buttonRef.current, {
        duration: 1000,
        width: 162,
        height: 44,
        ease: easeOutQuint,
      });
      animTo(buttonTextRef.current, {
        duration: 1000,
        width: 80,
        ease: easeOutQuint,
      });
    } else {
      animTo(downIconRef.current, {
        duration: 1000,
        rotate: 3.14159,
        ease: easeOutQuint,
      });
      animTo(buttonRef.current, {
        duration: 1000,
        width: 300,
        height: calculateOpenHeight(),
        ease: easeOutQuint,
      });
      animTo(buttonTextRef.current, {
        duration: 1000,
        width: 150,
        ease: easeOutQuint,
      });
    }

    setOpen(!open);
  }

  function onViewMore() {
    if (isSocket) return;

    if (isViewAll) {
      const neww = mods.reduce(
        (recent, curr) => {
          if (curr.id == "_all_") return recent;
          return curr.last > recent.last ? curr : recent;
        },
        { id: "-", last: 0 }
      );

      console.log("neww.name: " + neww.id);
      openSection_(neww.id);
    } else {
      openSection_("_all_");
    }

    setViewAll(!isViewAll);
  }

  function onCheck(module, check) {
    patchChecklist.mutate({ module, check });
  }

  function getCompletedChecks() {
    let checks = 0;
    for (let module of checklist) {
      checks += module.sublist.reduce((acc, curr) => (acc &&= curr.check), true)
        ? 1
        : 0;
    }
    return checks;
  }

  return (
    <div ref={buttonRef} className="drc-container">
      <div className="drc-head" ref={headRef} onClick={onClick}>
        <div className="drc-text" ref={buttonTextRef}>
          Dry Run Checklist
        </div>
        <div className="drc-checks">
          <div>[{getCompletedChecks()}/5]</div>
          <div className="drop-down">
            <ExpandMore
              style={{ color: "#341A5A", fontSize: "18px" }}
              ref={downIconRef}
            />
          </div>
        </div>
      </div>
      <div className="drc-body" ref={bodyRef}>
        {checklist.map((obj) => (
          <CheckboxList
            key={obj.id}
            ref={getRef(obj.id)}
            onCheck={onCheck}
            id={obj.id}
            name={obj.name}
            sublist={obj.sublist}
            check={obj.check}
          />
        ))}

        <div className="drc-content" ref={allRef}>
          {checklist.map((obj) => {
            console.log("obj", obj);
            return (
              <Checkbox
                key={"ALL_" + obj.id}
                id={obj.id}
                label={obj.name}
                onCheck={onCheck}
                checked={obj.sublist.reduce((a, c) => a && c.check, true)}
              />
            );
          })}
        </div>
      </div>
      <div ref={footerRef} className="drc-footer">
        <span onClick={onViewMore}>{isViewAll ? "View Less" : "View All"}</span>
      </div>
    </div>
  );
};

export default DryRunChecklist;
