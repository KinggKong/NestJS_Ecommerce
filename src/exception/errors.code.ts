export const ErrorCode = {
  INVALID_KEY: { code: 2000, message: 'Invalid key' },
  UNCATEGORIZED_EXCEPTION: { code: 9999, message: 'Uncategorized exception' },
  PRODUCT_NOT_FOUND: { code: 2000, message: 'Product Not Found' },
  USER_NOT_FOUND: { code: 4000, message: 'User Not Found' },
  PERMISSION_DENIED: { code: 2000, message: 'Permission denied' },

  USER_EMAIL_EXISTED: { code: 4000, message: 'User Email Exist' },
  USER_USERNAME_EXISTED: { code: 4000, message: 'User Username Exist' },
  USER_EMAIL_NOT_EXIST: { code: 4000, message: 'User Email Not Exist' },

  LOGIN_FAILED: { code: 4000, message: 'Login Failed, Wrong Password or Username' },
} as const;

export type ErrorCodeType = keyof typeof ErrorCode;
