import * as postConstants from "../_constants/post.module";
import { toastError, toastInfo } from "../_helper/toastify.helper";
import { compareValues } from "../_helper/compareValue.helper";
const initialState = {
   listPost: [],
   listPostNew: [],
   listPostViews: [],
   postById: {}
};

const reducer = (state = initialState, action) => {
   switch (action.type) {
      //Load List Post
      case postConstants.FETCH_POST_SUCCESS: {
         const { data } = action.payload;
         return {
            ...state,
            listPost: data,
            listPostNew: data
               .sort(compareValues("dateAdded", "desc"))
               .slice(0, 5),
            listPostViews: data.sort(compareValues("views", "desc")).slice(0, 5)
         };
      }
      case postConstants.FETCH_POST_FAILED: {
         const { error } = action.payload;
         toastError(error);
         return {
            ...state,
            listPost: error
         };
      }
      //Load Post by Id
      case postConstants.FETCH_POST_GET_BYID_SUCCESS: {
         const { data } = action.payload;
         return {
            ...state,
            postById: data[0]
         };
      }
      case postConstants.FETCH_POST_GET_BYID_FAILED: {
         const { error } = action.payload;
         toastError(error);
         return {
            ...state,
            postById: error
         };
      }
      //Vote Post
      case postConstants.VOTE_POST_SUCCESS: {
         toastInfo("Cảm ơn bạn đã vote bài viết");
         return {
            ...state
         };
      }
      case postConstants.VOTE_POST_FAILED: {
         const { error } = action.payload;
         toastError(error);
         return {
            ...state
         };
      }
      default:
         return state;
   }
};

export default reducer;