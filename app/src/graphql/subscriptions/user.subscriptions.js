import { gql } from "@apollo/client";

export const HYDRATION_REMINDER = gql`
  subscription HydrationReminder {
    hydrationReminder {
      userId
      message
    }
  }
`;
