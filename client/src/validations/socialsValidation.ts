import * as Yup from "yup";

const usernameRegex = /^@[a-zA-Z0-9._]{1,30}$/; // 1–30 chars after @, only letters, numbers, underscore, dot

export const socialsValidationSchemas: Record<string, Yup.StringSchema> = {
  linkedin: Yup.string()
    .matches(
      /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]+\/?$/,
      "Enter a valid LinkedIn profile URL"
    )
    .required("Required"),

  instagram: Yup.string()
    .matches(usernameRegex, "Must start with @ and contain only letters, numbers, underscores, or dots")
    .required("Required"),

  x: Yup.string()
    .matches(usernameRegex, "Must start with @ and contain only letters, numbers, underscores, or dots")
    .required("Required"),
};
