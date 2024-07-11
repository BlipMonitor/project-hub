import { xdr } from '@stellar/stellar-sdk';

/**
 * Serialize a value to a Soroban value
 * @param value - The value to serialize
 * @returns The serialized value
 */
export function serializeScVal(value: xdr.ScVal): any {
  switch (value.switch()) {
    case xdr.ScValType.scvString():
      return value.str();
    case xdr.ScValType.scvSymbol():
      return value.sym().toString();
    case xdr.ScValType.scvI32():
      return value.i32();
    case xdr.ScValType.scvU32():
      return value.u32();
    case xdr.ScValType.scvI64():
      return value.i64().toString();
    case xdr.ScValType.scvU64():
      return value.u64().toString();
    case xdr.ScValType.scvBool():
      return value.value();
    case xdr.ScValType.scvVec():
      return value.vec()?.map(serializeScVal) || [];
    case xdr.ScValType.scvMap():
      return Object.fromEntries(
        value.map()?.map((entry) => [serializeScVal(entry.key()), serializeScVal(entry.val())]) ||
          []
      );
    default:
      throw new Error(`Unsupported Soroban type for serialization: ${value.switch().name}`);
  }
}

/**
 * Deserialize a Soroban value to a value
 * @param scval - The value to deserialize
 * @returns The deserialized value
 */
export function deserializeScVal(scval: xdr.ScVal): any {
  switch (scval.switch()) {
    case xdr.ScValType.scvString():
      return scval.str();
    case xdr.ScValType.scvSymbol():
      return scval.sym().toString();
    case xdr.ScValType.scvI32():
      return scval.i32();
    case xdr.ScValType.scvU32():
      return scval.u32();
    case xdr.ScValType.scvI64():
      return scval.i64().toString();
    case xdr.ScValType.scvU64():
      return scval.u64().toString();
    case xdr.ScValType.scvBool():
      return scval.value();
    case xdr.ScValType.scvVec():
      return scval.vec()?.map(deserializeScVal) || [];
    case xdr.ScValType.scvMap():
      return Object.fromEntries(
        scval
          .map()
          ?.map((entry) => [deserializeScVal(entry.key()), deserializeScVal(entry.val())]) || []
      );
    default:
      throw new Error(`Unsupported Soroban type for deserialization: ${scval.switch().name}`);
  }
}
