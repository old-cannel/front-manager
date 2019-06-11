export default {
  namespace: 'project',

  state: {
    notice: [],
  },

  effects: {},

  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
  },
};
