import { mergeResolvers } from "@graphql-tools/merge";

import userResolver from "./user.resolver.js";
import waterResolver from "./water.resolver.js";

const mergedResolvers = mergeResolvers([userResolver, waterResolver]);

export default mergedResolvers;
