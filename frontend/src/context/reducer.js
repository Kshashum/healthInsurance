export const initialState = {
  login: false,
  vlist: [],
  tlist: [],
  token: null,
  name: "",
  userid: "",
  claimlist: [],
  searchlist: [],
  gte: 0,
  lte: 400,
  ord: "",
  price100_200: 0,
  price200_300: 0,
  price300_500: 0,
  clickSearch: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_VLIST":
      const temp = [...state.vlist];
      temp.push(action.item);
      return {
        ...state,
        vlist: temp,
      };
    case "DO_SEARCH":
      return {
        ...state,
        clickSearch: !state.clickSearch,
      };
    case "SORT":
      return {
        ...state,
        ord: action.item,
      };
    case "SEARCH":
      return {
        ...state,
        searchlist: action.item.searchlist,
        price100_200: action.item.price100_200,
        price200_300: action.item.price200_300,
        price300_500: action.item.price300_500,
      };
    case "ADD_FILTER":
      return {
        ...state,
        gte: action.item.gte,
        lte: action.item.lte,
      };
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
