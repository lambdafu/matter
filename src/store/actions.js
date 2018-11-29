/* Set the current topic. */
export function SET_TOPIC(value)
{
    return {
        type: 'SET_TOPIC',
        payload: {
            value: value
        }
    };
}

/* Set the current item for a topic. */
export function SET_TOPIC_ITEM(topic, item)
{
    return {
        type: 'SET_TOPIC_ITEM',
        payload: {
            topic, item
        }
    };
}
