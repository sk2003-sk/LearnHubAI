import { getApiErrorMessage } from "./apiResponse";

export default function errorHandler(error, fallback) {
  return getApiErrorMessage(error, fallback);
}
