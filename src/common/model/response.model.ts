export class ResponseData {
  constructor(status: number, description: string) {
    this.status = status;
    this.description = description;
  }
  status: number;
  description: string;
}

export class ResponseStatus {
  public static OK = new ResponseData(200, 'OK');
  public static CREATED = new ResponseData(201, 'Created');
  public static ACCEPTED = new ResponseData(202, 'Accepted');
  public static BAD_REQUEST = new ResponseData(400, 'Bad Request');
  public static UNAUTHORIZED = new ResponseData(401, 'Unauthorized');
  public static FORBIDDEN = new ResponseData(403, 'Forbidden');
  public static NOT_FOUND = new ResponseData(404, 'Not Found');
  public static INTERNAL_SERVER_ERROR = new ResponseData(500, 'Internal Server Error');
  public static SERVICE_UNAVAILABLE = new ResponseData(503, 'Service Unavailable');
}
