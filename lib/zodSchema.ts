import { z } from "zod";

const flameGraphPoint = z
  .object({
    wpm: z.number({
      required_error: "instantaneous wpm is missing",
      invalid_type_error: "instantaneous wpm must be a number",
    }),
    rawWpm: z.number({
      required_error: "instantaneous rawWpm is missing",
      invalid_type_error: "instantaneous rawWpm must be a number",
    }),
    interval: z.number({
      required_error: "interval is missing",
      invalid_type_error: "interval must be a number",
    }),
    errors: z.number({
      required_error: "errors is missing",
      invalid_type_error: "errors must be a number",
    }),
    problematicKeys: z
      .array(z.string(), {
        required_error: "problematicKeys field missing",
        invalid_type_error: "problematicKeys field must be an array",
      })
      .max(25, {
        message: "Too many error in short span of time. (┬┬﹏┬┬)",
      }),
  })
  .strict();

const flameGraph = z
  .array(flameGraphPoint)
  .nonempty({ message: "flameGraph must contain at least one entry" });

const test = z
  .object({
    charSets: z
      .array(z.number(), {
        required_error: "charSets is required",
        invalid_type_error: "charSets must be an array of numbers",
      })
      .nonempty({ message: "charSets cannot be empty" }),

    mode: z.enum(["time", "words"], {
      required_error: "mode is required",
      invalid_type_error: "mode must be one of: time | words | quote",
    }),
    mode2: z.number({
      required_error: "mode 2 is required",
      invalid_type_error: "mode must be number",
    }),
    flameGraph: flameGraph,

    accuracy: z.number({
      required_error: "accuracy is missing",
      invalid_type_error: "accuracy must be a number",
    }),
    rawWpm: z.number({
      required_error: "rawWpm is missing",
      invalid_type_error: "rawWpm must be a number",
    }),
    avgWpm: z.number({
      required_error: "avgWpm is missing",
      invalid_type_error: "avgWpm must be a number",
    }),
    initialSeed: z.string({
      required_error: "initialSeed is missing",
      invalid_type_error: "initialSeed must be a string",
    }),
    generatedAmt: z.number({
      required_error: "generatedAmt is missing",
      invalid_type_error: "generatedAmt must be a number",
    }),
    finalHash: z.string({
      required_error: "finalHash is missing",
      invalid_type_error: "finalHash must be a string",
    }),
    language: z.enum(["English", "English1k","C", "C++" , "French", "French1k", "Italian", "Italian1k", "Java", "Javascript", "Php", "Portuguese", 
      "Portuguese1k", "Ruby", "Russian", "Russian1k", "Spanish", "Spanish1k", "Typescript"], {
      required_error: "Language is required",
      invalid_type_error: "Language must be one of: C | C++ | English | English1k | French | French1k | Italian | Italian1k | Java | Javascript | Php | Portuguese | Portuguese1k | Ruby | Russian | Russian1k | Spanish | Spanish1k | Typescript",
    }),
    isPb: z.boolean({
      required_error: "isPb is missing",
      invalid_type_error: "isPb must be a number",
    }),
    // these will not be saved.
    keySpaceDuration:z.array(z.number(),{
      required_error: "keySpaceDuration field missing",
      invalid_type_error: "KeySpaceDuration field must be an array",
    }),
    keyPressDuration:z.array(z.number(),{
      required_error: "keySpaceDuration field missing",
      invalid_type_error: "KeySpaceDuration field must be an array",
    })
  })
  .strict();

export type TestPayload = z.infer<typeof test>;
export default test;
export { flameGraph };
