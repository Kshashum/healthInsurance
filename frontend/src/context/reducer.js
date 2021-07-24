export const initialState = {
  login: false,
  vlist: [],
  tlist: [],
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
    case "REMOVEVLIST":
      return {
        ...state,
        vlist: state.vlist.filter((item) => item[0] != action.item),
      };
    case "VLIST":
      return {
        ...state,
        vlist: action.item,
      };
    case "TRANSACTIONS":
      return {
        ...state,
        tlist: action.item,
      };
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
        vlist: [],
      };
    default:
      return state;
  }
};
export default reducer;
