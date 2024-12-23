import { v4 as uuidv4 } from 'uuid';

export function generateUuid(): string {
  return uuidv4();
}

export function mapResponse(
  mappingObject: any,
  responseObject: any,
  mappingFunctions: any,
): any {
  const returnObject: any = {};

  if (!mappingObject) {
    return responseObject;
  }

  for (const key in mappingObject) {
    if (mappingObject.hasOwnProperty(key)) {
      const mapFunction = mappingFunctions[mappingObject[key]];

      const mappedValue = mapFunction?.call(this, responseObject);
      if (mappedValue !== undefined) {
        returnObject[key] = mappedValue;
      }
    }
  }
  return returnObject;
}

