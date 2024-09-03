

export const getMenuPlacement = (elm) => {
    if(!elm){
        return {
            isLeftTop: true, 
            isRightTop: false,
            isLeftBottom: false,
            isRightBottom: false,
        }
    }
    const boundingRect = elm.getBoundingClientRect()

    if(
        boundingRect.x > (window.innerWidth - 280)
    ) {
        if(boundingRect.y > (window.innerHeight - 280)){
            return {
                isLeftTop: false, 
                isRightTop: false,
                isLeftBottom: false,
                isRightBottom: true,
            }
        } else {
            return {
                isLeftTop: false, 
                isRightTop: true,
                isLeftBottom: false,
                isRightBottom: false,
            }
        }
    } else {
        if(boundingRect.y > (window.innerHeight - 280)){
            return {
                isLeftTop: false, 
                isRightTop: false,
                isLeftBottom: true,
                isRightBottom: false,
            }
        }
    }

    return {
        isLeftTop: true, 
        isRightTop: false,
        isLeftBottom: false,
        isRightBottom: false,
    }
}

export const isMac = () => {
    return (navigator.userAgent.indexOf('Mac OS X') !== -1) || /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}