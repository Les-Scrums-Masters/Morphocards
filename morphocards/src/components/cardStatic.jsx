import React, { forwardRef, useImperativeHandle } from 'react';

const CardStatic = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => (
        {
            getValue() {
                return props.value;
            }
        }
    ));

    return (
        <div className="card">
            <h3 className="select-none">{props.value}</h3>
        </div>
    );

})

export default CardStatic;