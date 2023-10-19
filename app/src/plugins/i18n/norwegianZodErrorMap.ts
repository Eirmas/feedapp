import { ZodErrorMap, ZodIssueCode, util, ZodParsedType } from 'zod';

export const getParsedType = (data: any): ZodParsedType => {
  const t = typeof data;

  switch (t) {
    case 'undefined':
      return ZodParsedType.undefined;

    case 'string':
      return ZodParsedType.string;

    case 'number':
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;

    case 'boolean':
      return ZodParsedType.boolean;

    case 'function':
      return ZodParsedType.function;

    case 'bigint':
      return ZodParsedType.bigint;

    case 'symbol':
      return ZodParsedType.symbol;

    case 'object':
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === 'function' && data.catch && typeof data.catch === 'function') {
        return ZodParsedType.promise;
      }
      if (typeof Map !== 'undefined' && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== 'undefined' && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== 'undefined' && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;

    default:
      return ZodParsedType.unknown;
  }
};

const norwegianErrorMap: ZodErrorMap = (issue, _ctx) => {
  let message: string;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = 'Må fylles ut';
      } else {
        message = `Forventet ${issue.expected}, mottok ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Ugyldig bokstavelig verdi, forventet ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Ukjente nøkler i objektet: ${util.joinValues(issue.keys, ', ')}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Ugyldig inndata`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Ugyldig diskriminatordata. Forventet ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Ugyldig enumverdi. Forventet ${util.joinValues(issue.options)}, mottatt '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Ugyldige funksjonsargumenter`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Ugyldig funksjonens returtype`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Ugyldig dato`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === 'object') {
        if ('includes' in issue.validation) {
          message = `Ugyldig inndata: må inkludere "${issue.validation.includes}"`;

          if (typeof issue.validation.position === 'number') {
            message = `${message} på en eller flere posisjoner som er større enn eller lik ${issue.validation.position}`;
          }
        } else if ('startsWith' in issue.validation) {
          message = `Ugyldig inndata: må starte med "${issue.validation.startsWith}"`;
        } else if ('endsWith' in issue.validation) {
          message = `Ugyldig inndata: må ende med "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation === 'email') {
        message = 'Ugyldig e-postadresse';
      } else if (issue.validation !== 'regex') {
        message = `Ugyldig ${issue.validation}`;
      } else {
        message = 'Ugyldig';
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === 'array')
        message = `Listen må inneholde ${issue.exact ? 'nøyaktig' : issue.inclusive ? `minst` : `mer enn`} ${issue.minimum} element${
          issue.minimum === 1 ? '' : 'er'
        }`;
      else if (issue.type === 'string')
        message = `Strengen må inneholde ${issue.exact ? 'nøyaktig' : issue.inclusive ? `minst` : `mer enn`} ${issue.minimum} tegn`;
      else if (issue.type === 'number')
        message = `Tallet må være ${issue.exact ? `nøyaktig lik ` : issue.inclusive ? `større enn eller lik ` : `større enn `}${
          issue.minimum
        }`;
      else if (issue.type === 'date')
        message = `Datoen må være ${issue.exact ? `nøyaktig lik ` : issue.inclusive ? `større enn eller lik ` : `større enn `}${new Date(
          Number(issue.minimum),
        )}`;
      else message = 'Ugyldig inndata';
      break;
    case ZodIssueCode.too_big:
      if (issue.type === 'array')
        message = `Listen må inneholde ${issue.exact ? `nøyaktig` : issue.inclusive ? `høyst` : `mindre enn`} ${issue.maximum} element${
          issue.maximum === 1 ? '' : 'er'
        }`;
      else if (issue.type === 'string')
        message = `Strengen må inneholde ${issue.exact ? `nøyaktig` : issue.inclusive ? `høyst` : `mindre enn`} ${issue.maximum} tegn`;
      else if (issue.type === 'number')
        message = `Tallet må være ${issue.exact ? `nøyaktig lik ` : issue.inclusive ? `mindre enn eller lik ` : `mindre enn`} ${
          issue.maximum
        }`;
      else if (issue.type === 'bigint')
        message = `BigInt må være ${issue.exact ? `nøyaktig lik ` : issue.inclusive ? `mindre enn eller lik ` : `mindre enn`} ${
          issue.maximum
        }`;
      else if (issue.type === 'date')
        message = `Datoen må være ${issue.exact ? `nøyaktig lik ` : issue.inclusive ? `mindre enn eller lik ` : `mindre enn`} ${new Date(
          Number(issue.maximum),
        )}`;
      else message = 'Ugyldig inndata';
      break;
    case ZodIssueCode.custom:
      message = `Ugyldig inndata`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Resultatene fra krysset kunne ikke slås sammen`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Tallet må være et multiplum av ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = 'Tallet må være endelig';
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};

export default norwegianErrorMap;
