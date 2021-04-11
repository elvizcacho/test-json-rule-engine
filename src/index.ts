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
    type: "onSupportedDocumentType",
    params: {
      message: "Document is supported and email contains @evana.de",
    },
  },
});

engine.addRule({
  conditions: {
    any: [
      {
        fact: "securityClassification",
        operator: "equal",
        value: "unrestricted",
      },
      {
        fact: "securityClassification",
        operator: "equal",
        value: "",
      },
    ],
  },
  event: {
    type: "onUnrestrictedDocument",
    params: {
      message: "document is unrestricted do something aobut it",
    },
  },
});

engine.addRule({
  conditions: {
    any: [
      {
        fact: "securityClassification",
        operator: "equal",
        value: "restricted",
      },
    ],
  },
  event: {
    type: "onRestrictedDocument",
    params: {
      message: "document is restricted do something about it",
    },
  },
});

let facts = {
  securityClassification: "unrestricted",
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
  const onSupportedDocumentType = events.find(
    (event) => event.type === "onSupportedDocumentType"
  );

  const onRestrictedDocument = events.find(
    (event) => event.type === "onRestrictedDocument"
  );

  const onUnrestrictedDocument = events.find(
    (event) => event.type === "onUnrestrictedDocument"
  );

  if (onSupportedDocumentType && onRestrictedDocument) {
    console.log(onSupportedDocumentType.params);
    console.log(onRestrictedDocument.params);

    console.log(
      "document type is supported and is a restricted document to something"
    );
  }

  if (onSupportedDocumentType && onUnrestrictedDocument) {
    console.log(onSupportedDocumentType.params);
    console.log(onUnrestrictedDocument.params);

    console.log(
      "document type is supported and is a unrestricted document to something"
    );
  }
});
