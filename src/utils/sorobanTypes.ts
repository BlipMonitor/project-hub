import { xdr } from '@stellar/stellar-sdk';

/**
 * Serialize a value to a Soroban value
 * @param value - The value to serialize
 * @returns The serialized value
 */
export function serializeScVal(value: any): xdr.ScVal {
  if (typeof value === 'string') {
    return xdr.ScVal.scvString(value);
  } else if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return xdr.ScVal.scvI32(value);
    } else {
      return xdr.ScVal.scvU64(xdr.Uint64.fromString(value.toString()));
    }
  } else if (typeof value === 'boolean') {
    return xdr.ScVal.scvBool(value);
  } else if (Array.isArray(value)) {
    return xdr.ScVal.scvVec(value.map(serializeScVal));
  } else if (typeof value === 'object' && value !== null) {
    const mapEntries = Object.entries(value).map(([key, val]) => {
      return new xdr.ScMapEntry({
        key: serializeScVal(key),
        val: serializeScVal(val)
      });
    });
    return xdr.ScVal.scvMap(mapEntries);
  } else {
    throw new Error(`Unsupported type for Soroban serialization: ${typeof value}`);
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
