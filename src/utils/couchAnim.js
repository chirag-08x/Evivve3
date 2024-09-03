import { compose, decomposeTSR, fromDefinition, fromTransformAttribute, rotate, scale, toCSS, transform, translate } from "transformation-matrix";

/*
interface AnimChanges {
    attrib: string,
    el: HTMLElement,
    from: string | number,
    to: string | number,
    executed: boolean,
}

interface AnimObject {
    end: number,
    start: number,
    elNodeList: NodeListOf<HTMLElement>,
    changes: AnimChanges[],
    onStart?: (targets) => void,
    onCompleted?: (targets) => void,
    _isStarted?: boolean,
    ease: (number: number) => number,
    id: string
}
*/

export function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

export function easeInExpo(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

export function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
}

const AnimLoopConfig = {
    startTime: null
}

export const initAnimationLoop = () => {
    function loop () {
        if (AnimLoopConfig.startTime === null)
            AnimLoopConfig.startTime = Date.now();

        animLoopHandler();
        window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
}

function getSceneTimePassed () {
    //GET SCENE TIME PASSED
    if (AnimLoopConfig.startTime === null)
        throw new Error("Animation loop hasnt been initiated");
    return Date.now() - AnimLoopConfig.startTime;
}

function getAttribValueType (attrib) {
    switch (attrib) {
        case 'width':
        case 'height':
        case 'maxWidth':
        case 'padding':
        case 'paddingBottom':
        case 'paddingTop':
        case 'top':
        case 'left':
            return 'px';
        case 'scale':
        case 'opacity':
        case 'zIndex':
        default:
            return '';
    }
}

const CALCULABLE_ATTRIBS = ['width', 'height', 'opacity', 'zIndex', 'maxWidth', 'padding', 'paddingBottom', 'paddingTop', 'top', 'left', 'scale'];
const TRANSFORMS_ATTRIBS = ['x', 'y', 'rotate'];

const animConfig = {
    id: 0
};
// time_passed can cause problems while incrementing from the animation loop
// use curr_time to calculate the time_passed from start_time and sc_time
const animArr = []; //AnimChanges

export function animTo (selector, attribs, funcs) {
    const elNodeList = typeof(selector) === 'string' ? document.querySelectorAll(selector) : [selector];

    const start = (attribs.delay || 0) + getSceneTimePassed();
    const end = (attribs.duration || 1000) + start;
    //console.log(`Start: ${start}, End: ${end}`);

    const obj = { //AnimObject
        start, end,
        elNodeList: elNodeList,
        id: 'id-' + animConfig.id++,
        ease: attribs.ease || (n => n),
        changes: [],
    };

    delete attribs.duration;
    delete attribs.delay;

    if (funcs && funcs.onStart) obj.onStart = funcs.onStart;
    if (funcs && funcs.onCompleted) obj.onCompleted = funcs.onCompleted;

    for (let el of elNodeList) {
        for (let attrib in attribs) {
            if (attrib == 'ease') continue;
            const oldValue = getComputedProp(el, attrib);
            //if (SceneManagerProps.rendering)
                obj.changes.push({el, attrib, from: oldValue, to: attribs[attrib], executed: false});
            //else
                //gsap.set(el, attribs);
        }
    }

    animArr.push(obj);
}

export function animFrom (selector, attribs, funcs) {
    const elNodeList = typeof(selector) === 'string' ? document.querySelectorAll(selector) : [selector];

    const start = (attribs.delay || 0) + getSceneTimePassed();
    const end = (attribs.duration || 1000) + start;

    const obj = { //AnimObject
        start, end,
        elNodeList: elNodeList,
        id: 'id-' + animConfig.id++,
        ease: attribs.ease || (n => n),
        changes: [],
    };

    delete attribs.duration;
    delete attribs.delay;

    if (funcs && funcs.onStart) obj.onStart = funcs.onStart;
    if (funcs && funcs.onCompleted) obj.onCompleted = funcs.onCompleted;

    for (let el of elNodeList) {
        let transform = {matrix: {a:1,b:0,c:0,d:1,e:0,f:0}, toUpdate: false};
        for (let attrib in attribs) {
            if (attrib == 'ease') continue;
            const oldValue = getComputedProp(el, attrib);
            if (!TRANSFORMS_ATTRIBS.includes(attrib))
                el.style[attrib] = attribs[attrib];
            else {
                transform.toUpdate = true;
                transform.matrix = applyToMatrix(transform.matrix, attrib, attribs[attrib])
            }
            obj.changes.push({el, attrib, from: attribs[attrib], to: oldValue, executed: false});
        }
        if (transform.toUpdate)
            el.style['transform'] = toCSS(transform.matrix);
    }

    animArr.push(obj);
}

export function animLoopHandler () {
    const sceneTimePassed = getSceneTimePassed();
    for (let animObj of animArr) {
        //console.log(`start: ${animObj.start}, end: ${animObj.end}, time_passed: ${getSceneTimePassed()}`);
        if (sceneTimePassed >= animObj.start && sceneTimePassed <= animObj.end + 120) {
            if (!animObj._isStarted && animObj.onStart) {
                //console.log(`start: ${animObj.start}, end: ${animObj.end}, time_passed: ${getSceneTimePassed()}`);
                //console.log(`animObj: ${JSON.stringify(animObj.changes)}`);
                animObj._isStarted = true;
                animObj.onStart(animObj.elNodeList);
            }

            let transform = {matrix: {a:1,b:0,c:0,d:1,e:0,f:0}, toUpdate: false};
            let perc = animObj.ease((sceneTimePassed-animObj.start)/(animObj.end-animObj.start));
            perc = perc < 0 ? 0 : perc;
            perc = perc > 1 ? 1 : perc;
            //console.log(`curr: ${sceneTimePassed}, start: ${animObj.start}, end: ${animObj.end}, perc: ${perc}`);
            for (let change of animObj.changes) {
                if (!TRANSFORMS_ATTRIBS.includes(change.attrib) && !CALCULABLE_ATTRIBS.includes(change.attrib)) {
                    change.el.style[change.attrib] = change.to;
                }

                if (typeof change.from == 'number' && typeof change.to == 'number') {
                    const from = change.from;
                    const to = change.to;
                    const value = getCalculatedValue(change.el, change.attrib, from, to, perc);
                    if (TRANSFORMS_ATTRIBS.includes(change.attrib)) {
                        transform.toUpdate = true;
                        transform.matrix = applyToMatrix(transform.matrix, change.attrib, value)
                    } else {
                        change.el.style[change.attrib] = value + getAttribValueType(change.attrib);
                    }
                } else {
                    if (!change.executed) {
                        change.el.style[change.attrib] = change.to;
                        change.executed = true;
                    }
                }
            }

            if (transform.toUpdate) {
                for (let el of animObj.elNodeList) {
                    el.style['transform'] = toCSS(transform.matrix);
                }
            }

            if (perc >= 1) {
                if (animObj.onCompleted)
                    animObj.onCompleted(animObj.elNodeList);

                break;
            }
        }
    }
}

/*function commitStyle (el, attrib, _from , _to, perc) {
    if (!TRANSFORMS_ATTRIBS.includes(attrib) && !CALCULABLE_ATTRIBS.includes(attrib)) {
        el.style[attrib] = _to;
    }

    if (typeof _from == 'number' && typeof _to == 'number') {
        const from = _from as number;
        const to = _to as number;
        const value = getCalculatedValue(el, attrib, from, to, perc);
        if (TRANSFORMS_ATTRIBS.includes(attrib)) {
            el.style['transform'] = value;
        } else {
            el.style[attrib] = value;
        }
    } else {
        el.style[attrib] = _to as string;
    }
}*/

function getComputedProp (el, attrib) {
    const oldValue = getComputedStyle(el)[attrib];
    if (!TRANSFORMS_ATTRIBS.includes(attrib) && !CALCULABLE_ATTRIBS.includes(attrib)) {
        return oldValue;
    }

    if (CALCULABLE_ATTRIBS.includes(attrib) && (oldValue == 'none' || oldValue == 'auto'))
        return 0;
    else if (CALCULABLE_ATTRIBS.includes(attrib))
        return parseFloat(oldValue);

    let transform  = {
        translate: {tx: 0, ty: 0},
        scale: {sx: 1, sy: 1},
        rotation: {angle: 0}
    };

    if (getComputedStyle(el).transform != 'none') {
        transform = decomposeTSR(compose(
            fromDefinition(
                fromTransformAttribute(getComputedStyle(el).transform)
            )
        ));
    }

    switch (attrib) {
        case 'x':
            return transform.translate.tx;
        case 'y':
            return transform.translate.ty;
        case 'scale':
            return transform.scale.sx; //We will be mostly scaling both at once
        case 'rotate':
            return transform.rotation.angle;
    }

    throw new Error(`No procedure for handling (id: ${el.id}, class: ${el.classList}) attrib: ${attrib}`);
}

function getCalculatedValue (el, attrib, fromValue, toValue, perc) {
    if (!TRANSFORMS_ATTRIBS.includes(attrib) && !CALCULABLE_ATTRIBS.includes(attrib)) {
        return toValue;
    }

    const value = fromValue + ((toValue-fromValue) * perc);
    return value;
}

function applyToMatrix (matrix, attrib, value) {
    switch (attrib) {
        case 'x':
            matrix = transform(matrix, translate(value));
            break;
        case 'y':
            matrix = transform(matrix, translate(0, value));
            break;
        case 'scale':
            matrix = transform(matrix, scale(value));
            break;
        case 'rotate':
            matrix = transform(matrix, rotate(value));
            break;
        default:
            throw new Error(`No procedure for handling attrib: ${attrib} value: ${value}`);
    }

    return matrix;
}
