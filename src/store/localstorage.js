export const loadLocalState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    const data = JSON.parse(serializedState);
    // FIXME: Verify validity.
    if (typeof data !== 'object') {
      return undefined;
    }
    return data;
  } catch (err) {
    return undefined;
  }
};

export const saveLocalState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // ignore write errors
  }
};
