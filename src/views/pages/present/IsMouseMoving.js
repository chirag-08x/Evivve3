import {useState, useEffect} from 'react';

const IsMouseMoving = () =>
{
    const [lastX, setLastX] = useState(-1);
    const [lastY, setLastY] = useState(-1);

    const [isMoving, setIsMoving] = useState(false);

    useEffect(() =>
    {
        let timeoutVar = null;

        const handleMouseMove = (event) =>
        {
            // Check if the cursor's position has changed
            if (event.clientX !== lastX || event.clientY !== lastY)
            {
                // Cursor is moving
                // console.log('Cursor is moving');
                setIsMoving(true);

                if (timeoutVar)
                {
                    clearTimeout(timeoutVar);
                }

                // Update last cursor position
                setLastX(event.clientX);
                setLastY(event.clientY);

                timeoutVar = setTimeout(() =>
                {
                    setIsMoving(false);
                }, 2000);
            }
        };
        document.addEventListener('mousemove', handleMouseMove);
        // Clean up event listener on component unmount
        return () =>
        {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Dependency array ensures effect runs only when these variables change

    return isMoving; // Or any other JSX you want to render
};

export default IsMouseMoving;
