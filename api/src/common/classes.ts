import HttpStatusCodes from '@src/common/HttpStatusCodes';


/**
 * Error with status code and message.
 */
export class RouteError extends Error {

  public status: HttpStatusCodes;

  public constructor(status: HttpStatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * If route validation fails.
 */
export class ValidationErr extends RouteError {

  public static MSG = 'Le paramètre suivant est manquant ou invalide "';

  public constructor(paramName: string) {
    super(HttpStatusCodes.BAD_REQUEST, ValidationErr.GetMsg(paramName));
  }

  public static GetMsg(param: string) {
    return ValidationErr.MSG + param + '".';
  }
}

