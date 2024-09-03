import { ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  SecondaryBtn,
  SecondaryGrayBtn,
} from "src/components/shared/BtnStyles";
import useExitPresentMode from "src/hooks/useExitPresentMode";
import { toggleSchedulerDialog } from "src/store/apps/programs/ProgramSlice";
import { animTo, easeOutQuint } from "src/utils/couchAnim";

import "./checkbox.css";
import { getChecklist, getChecklistFull, setCheck, setReviewChecklistPopup } from "./DryRunChecklistSlice";
import "./review-checklist.css";

const CheckboxSection = ({id, label, checked, sublist, selected, openSection}) => {
    const dispatch = useDispatch();

    return (
    <div className="rc-checkbox-section">
        <div className="rc-checkbox-head" onClick={() => openSection(id)}>
            <label className="rc-checkbox-label">
                <input type="checkbox" className="drc-checkbox" checked={sublist.reduce((a,c) => a && c.check, true)}/>
                <span>{label}</span>
            </label>
            <div>
                <ExpandMore style={{color: '#786791', transform: selected === id ? 'rotate(180deg)' : ''}}/>
            </div>
        </div>
        <div className={'REF_'+id} style={{padding: '0px', display: 'none', overflow: 'hidden', opacity: '0'}}>
            {sublist.map(o =>
                <label className="rc-sub-checkbox-label">
                    <input onChange={evt => dispatch(setCheck({id: id+':'+o.id, check: evt.target.checked}))} type="checkbox" className="drc-checkbox" checked={o.check}/>
                    <span>{o.name}</span>
                </label>
            )}
        </div>
    </div>);
}

const ReviewChecklistPopup = () => {
    const dispatch = useDispatch();
    const checklist = useSelector(getChecklistFull);
    const exitPresentMode = useExitPresentMode();
    const [selected, setSelected] = useState(null);

    function onSchedule (e) {
        dispatch(setReviewChecklistPopup(false));
        exitPresentMode(e, () => {
            dispatch(toggleSchedulerDialog(true));
        });
    }

    function onGoEditMode (e) {
        dispatch(setReviewChecklistPopup(false));
        exitPresentMode(e);
    }

    function getHeight (section) {
        const c = checklist.checklist.find(o => o.id == section);
        if (!c)
            throw new Error("");

        return c.sublist.length * 27 + 20;
    }

    function openSection (section) {
        if (section !== selected) {
            if (selected !== null)
                animTo('.REF_'+selected, {duration: 1000, height: 0, padding: 0, opacity: 0, ease: easeOutQuint}, {
                    onCompleted: target => {
                        console.dir(target);
                        if (target[0])
                        target[0].style.display = 'none';
                    }
                });
            animTo('.REF_'+section, {duration: 1000, height: getHeight(section), padding: 10, opacity: 1, ease: easeOutQuint}, {
                onStart: target => {
                    //console.dir(target);
                    if (target[0])
                    target[0].style.display = 'block';
                }
            });
        } else {
            animTo('.REF_'+section, {duration: 1000, height: 0, padding: 0, opacity: 0, ease: easeOutQuint}, {
                onCompleted: target => {
                    //console.dir(target);
                    if (target[0])
                    target[0].style.display = 'none';
                }
            });
        }
        setSelected(section == selected ? null : section);
    }

    return (<>
    <div style={{display: checklist.isReviewChecklistOpen ? 'block' : 'none'}} className="rc-background"></div>
    <div style={{display: checklist.isReviewChecklistOpen ? 'block' : 'none'}} className="rc-popup">
        <div className="rc-popup-head">REVIEW YOUR PROGRAM</div>
        <div className="rc-body">
            {checklist.checklist.map(o =>
                <CheckboxSection
                    id={o.id}
                    label={o.name}
                    checked={o.sublist.reduce((a,c) => a && c.check, true)}
                    sublist={o.sublist}
                    openSection={openSection}
                    selected={selected}
                />
            )}
        </div>
        <div className="rc-footer">
            <SecondaryBtn onClick={onSchedule}>
                SCHEDULE
            </SecondaryBtn>
            <SecondaryBtn style={{width: 'initial'}} onClick={onGoEditMode}>
                GO TO EDIT MODE
            </SecondaryBtn>
        </div>
    </div>
    </>);
}

export default ReviewChecklistPopup;
