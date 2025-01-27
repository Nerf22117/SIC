import { mergeTypeDefs } from "@graphql-tools/merge";

import userTypeDef from "./user.typeDef.js";
import waterTypeDef from "./water.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([userTypeDef, waterTypeDef]);

export default mergedTypeDefs;
