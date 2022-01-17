import hs from "src/lib/httpStatus.js";

export default (req, res, next) => {
  res.error = (status, code, message, stack = undefined) => {
    res.status(status);
    return res.json({
      error: {
        code,
        message,
        stack,
      },
    });
  };

  res.error.authRequired = (message = "Authentication required") =>
    res.error(hs.UNAUTHORIZED, "auth_required", message);

  res.error.authFailed = (message = "Authentication failed") =>
    res.error(hs.UNAUTHORIZED, "auth_failed", message);

  res.error.insufficientPermissions = (message = "Permission required") =>
    res.error(hs.FORBIDDEN, "insufficient_permissions", message);

  res.error.badRequest = (message = "Bad request", stack = undefined) => {
    res.error(hs.BAD_REQUEST, "bad_request", message, stack);
  };

  res.error.badParam = (param, details = undefined) => {
    res.error(
      hs.BAD_REQUEST,
      "bad_param",
      details || `the value you provided for '${param}' is not allowed`
    );
  };

  res.error.missingParam = (param) => {
    res.error(
      hs.BAD_REQUEST,
      "missing_param",
      `'${param}' is a required parameter`
    );
  };

  res.error.notFound = (message = "This item was not found") => {
    res.error(hs.NOT_FOUND, "not_found", message);
  };

  next();
};
