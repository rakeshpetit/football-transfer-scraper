import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { openRouterLlm as defaultModel } from "./models";

const prompt = `Your job is to parse text input on Football transfers and generate useful output out of the text. You will use words such as "here we go!", "official", "confirmed", etc to also output a confidence between 0-100. In the absence of such words, if the text sounds like rumour information rather than affirmative actions from clubs, confidence will be 0.

Examples of rumours: "Club want more", "Negotiating", "Deal not happening", "No agreement", "no intention"

Input: "Stefan Savić to Trabzonspor, here we go! Three year contract valid until June 2027, agreed today. Atlético Madrid will let him leave as revealed in May, mutual decision made. Medical tests later this week. Exclusive story, confirmed."

Output:
Player: Stefan Savić
Club from: Atlético Madrid
Club to: Trabzonspor
Fee amount:
Confidence: 100

Input: "There’s €3m release clause into the contract of Stole Dimitrievski at Valencia. Only in case Mamardashvili stays at Valencia this summer, the clause will be valid for Dimitrievski to leave immediately until the last day of the window."

Output:
Player: Stole Dimitrievski
Club from: Valencia
Club to:
Fee amount: €3m (release clause)
Confidence: 0

Input: "Borussia Dortmund have made contact with Man City to discuss Yan Couto deal conditions. BVB are not intentioned to pay €40m release clause, negotiating on price while Couto’s keen on the move. BVB plan to invest around €20/25m as @SkySportDE reported."

Output:
Player: Yan Couto
Club from: Man City
Club to: Borussia Dortmund
Fee amount: €20/25m (BVB's offer)
Confidence: 10`;

const informationExtractor = ChatPromptTemplate.fromTemplate(
  `${prompt}\n{formatInstructions}\n{phrase}`
);

const structuredOutputParser = StructuredOutputParser.fromNamesAndDescriptions({
  player: "Player name",
  clubFrom: "Club from which the player is moving",
  clubTo: "Club to which the player is moving",
  fee: "Transfer fee",
  confidence: "Confidence integer between 0-100",
});

const informationParser = async ({
  phrase = "",
  model = defaultModel,
  promptTemplate = informationExtractor,
  parser = structuredOutputParser,
}) => {
  const chain = promptTemplate.pipe(model).pipe(parser);
  const response = await chain.invoke({
    phrase,
    formatInstructions: parser.getFormatInstructions(),
  });
  return response;
};

export { informationParser };
