export const errorHandler = (
  statusCode = 500,
  message = "Internal Server Error"
) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.name = "HttpError";

  if (Error.captureStackTrace) Error.captureStackTrace(error, errorHandler);

  return error;
};
