export const initialState = {
  login: false,
  visitlist: [],
  token: null,
  name: "",
  userid: "",
  claimlist: [],
  searchlist: [],
  clickSearch: false,
  cartid: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "CLAIMS":
      return {
        ...state,
        claimlist: action.item,
      };
    case "AUTHORIZE":
      return {
        ...state,
        login: true,
        token: action.item.token,
        name: action.item.name,
        userid: action.item.userid,
      };
    case "LOGOUT":
      return {
        ...state,
        name: "",
        userid: null,
        token: null,
        login: false,
        claimlist: [],
        searchlist: [],
        visitlist: [],
      };
    default:
      return state;
  }
};
export default reducer;
