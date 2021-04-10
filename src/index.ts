import { Engine } from "json-rules-engine";

let engine = new Engine();

engine.addRule({
  conditions: {
    all: [
      {
        fact: "documentMimeType",
        operator: "oneOf",
        value: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"],
      },
      {
        fact: "uploaderEmail",
        operator: "contains",
        value: "@evana.de",
      },
    ],
  },
  event: {
    type: "allConditionsAreMetEvent",
    params: {
      message: "Document is supported and email contains @evana.de",
    },
  },
});

let facts = {
  documentMimeType: "pptx",
  uploaderEmail: "s.vizcaino@evana.de",
};

engine.addOperator("oneOf", (fact: string, jsonValue: string) =>
  jsonValue.includes(fact)
);

engine.addOperator("contains", (fact: string, jsonValue: string) => {
  const regExp = new RegExp(jsonValue, "g");

  return regExp.test(fact);
});

engine.run(facts).then(({ events }) => {
  const allConditionsAreMetEvent = events.find(
    (event) => event.type === "allConditionsAreMetEvent"
  );

  if (allConditionsAreMetEvent) {
    console.log(allConditionsAreMetEvent.params);
  }
});
