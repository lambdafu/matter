const handlers = {};

const noop = () => {};
export function registerHandler(name, reducer = noop) {
  if (handlers.hasOwnProperty(name))
    throw new Error(`Handler with name "${name}" was already registered.`);
  handlers[name] = (state, payload) => reducer(state, ...payload);

  const actionCreator = (...payload) => ({ type: name, payload });
  actionCreator.type = name;
  return actionCreator;
}

export function rootReducer(state, action) {
  if (handlers.hasOwnProperty(action.type))
    return {
      ...state,
      saved: {
        ...state.saved,
        ...handlers[action.type](state.saved, action.payload),
      },
    };

  console.log(`Action "${action.type}" does not exist!`, action);

  return state;
}
