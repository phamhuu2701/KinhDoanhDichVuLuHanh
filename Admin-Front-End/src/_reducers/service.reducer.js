import * as serviceConstants from "../_constants/service.module";
import {
   toastError,
   toastPatchSuccess,
   toastDeleteSuccess,
   toastCreateSuccess
} from "../_helper/toastify.helper";
const initialState = {
   listService: [],
   listImageService: [],
   serviceById: {},
   delete: [],
   patch: [],
   create: []
};

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case serviceConstants.FETCH_SERVICE:
         return {
            ...state,
            listService: []
         };
      case serviceConstants.FETCH_SERVICE_SUCCESS: {
         const { data } = action.payload;
         return {
            ...state,
            listService: data
         };
      }
      case serviceConstants.FETCH_SERVICE_FAILED: {
         const { error } = action.payload;
         toastError(error);
         return {
            ...state,
            listService: error
         };
      }

      //Get Schedule By  Id Service
      case serviceConstants.FETCH_SERVICE_GET_BYID_SUCCESS: {
         const { data } = action.payload;
         return {
            ...state,
            serviceById: data
         };
      }
      case serviceConstants.FETCH_SERVICE_GET_BYID_FAILED: {
         const { error } = action.payload;
         toastError(error);
         return {
            ...state,
            serviceById: error
         };
      }

      //Post - Create
      case serviceConstants.FETCH_SERVICE_CREATE_SUCCESS: {
         const { data } = action.payload;
         const { newRecord } = action.newRecord;
         toastCreateSuccess(newRecord);
         return {
            ...state,
            create: data
         };
      }
      case serviceConstants.FETCH_SERVICE_CREATE_FAILED: {
         const { error } = action.payload;
         toastError(error);
         return {
            ...state,
            create: error
         };
      }

      //Delete
      case serviceConstants.FETCH_SERVICE_DELETE_SUCCESS: {
         const { data } = action.payload;
         const { record } = action.record;
         toastDeleteSuccess(record);
         return {
            ...state,
            delete: data
         };
      }
      case serviceConstants.FETCH_SERVICE_DELETE_FAILED: {
         const { error } = action.payload;
         toastError(error);
         return {
            ...state,
            delete: error
         };
      }

      //Patch - update
      case serviceConstants.FETCH_SERVICE_PATCH_SUCCESS: {
         const { data } = action.payload;
         const { newRecord } = action.newRecord;
         toastPatchSuccess(newRecord);
         return {
            ...state,
            patch: data
         };
      }
      case serviceConstants.FETCH_SERVICE_PATCH_FAILED: {
         const { error } = action.payload;
         toastError(error);
         return {
            ...state,
            patch: error
         };
      }

      default:
         return state;
   }
};

export default reducer;
