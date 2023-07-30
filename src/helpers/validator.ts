import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../core/ApiError";
import { Types } from "mongoose";

export enum ValidationSource {
  BODY = "body",
  HEADER = "headers",
  QUERY = "query",
  PARAM = "params",
}

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
    return value;
  }, "Object Id Validation");

export const JoiUrlEndpoint = () =>
  Joi.string().custom((value: string, helpers) => {
    if (value.includes("://")) return helpers.error("any.invalid");
    return value;
  }, "Url Endpoint Validation");

export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith("Bearer ")) return helpers.error("any.invalid");
    if (!value.split(" ")[1]) return helpers.error("any.invalid");
    return value;
  }, "Authorization Header Validation");

export default (
  schema: Joi.AnySchema,
  source: ValidationSource = ValidationSource.BODY
) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[source]);

      if (!error) return next();

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ""))
        .join(",");
      console.log(message);

      next(new BadRequestError(message));
    } catch (error) {
      next(error);
    }
  };
export function removeDiacritics(str: string): string {
  const diacriticsMap: { [key: string]: string } = {
    'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'đ': 'd',
    'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  };

  return str.replace(/[^\u0000-\u007E]/g, (char) => diacriticsMap[char] || char);
}
