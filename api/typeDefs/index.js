import { mergeTypeDefs } from "@graphql-tools/merge";

import userTypeDef from "./user.typeDef.js";
import waterTypeDef from "./water.typeDef.js";
import foodTypeDef from "./food.typeDef.js";
import exerciseTypeDef from "./exercise.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([
  userTypeDef,
  waterTypeDef,
  foodTypeDef,
  exerciseTypeDef,
]);

export default mergedTypeDefs;
