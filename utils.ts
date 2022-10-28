import { Permission, Query } from "accesscontrol";

export type Relation = "or" | "and";
export type Schema = (query: Query) => PermissionsSet;

type PermissionsSet = Record<string, Permission>;

export const checkByAndRelation = (permissions: PermissionsSet) => {
  return Object.values(permissions).every((permission) => permission.granted);
};

export const checkByOrRelation = (permissions: PermissionsSet) => {
  return Object.values(permissions).some((permission) => permission.granted);
};

export const CHECK_FUNCTION_MAP = {
  and: checkByAndRelation,
  or: checkByOrRelation,
};
