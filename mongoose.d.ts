declare module "mongoose" {
  interface ObjectId {
    equals(value: any): boolean;
  }
}
