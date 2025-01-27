import { mergeResolvers } from "@graphql-tools/merge";

import userResolver from "./user.resolver.js";
import waterResolver from "./water.resolver.js";
import foodResolver from "./food.resolver.js";

const mergedResolvers = mergeResolvers([
  userResolver,
  waterResolver,
  foodResolver,
]);

export default mergedResolvers;
