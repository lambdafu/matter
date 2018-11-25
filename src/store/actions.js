/* Replace the current state entirely. */
export function SET_STATE(value)
{
    return {
        type: 'SET_STATE',
        payload: {
            value: value
        }
    };
}

/* Set the current lead scientist. */
export function SET_SCIENTIST(value)
{
    return {
        type: 'SET_SCIENTIST',
        payload: {
            value: value
        }
    };
}

/* Set the current lead scientist. */
export function SET_TOPIC(value)
{
    return {
        type: 'SET_TOPIC',
        payload: {
            value: value
        }
    };
}
