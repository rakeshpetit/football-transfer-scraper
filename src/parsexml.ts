import fs from "fs";
import { XMLParser } from "fast-xml-parser";

const MIN_TEXT_LENGTH = 100;

const PATTERNS = ["id__", "css-", "url(", "justify-content"];

function containsPattern(text: string): boolean {
  for (const pattern of PATTERNS) {
    if (text.includes(pattern)) {
      return true;
    }
  }
  return false;
}

function parseXMLFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const parser = new XMLParser({
            ignoreAttributes: false,
            allowBooleanAttributes: true,
            processEntities: false,
            isArray: (name, jpath, isLeafNode, isAttribute) => {
              return false;
            },
          });
          const result = parser.parse(data);
          resolve(result);
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    });
  });
}

// Function to extract useful text information
function extractUsefulText(xmlObject: any): string[] {
  let usefulText: string[] = [];

  // Example: Extract text from specific tags
  function traverse(obj: any) {
    if (typeof obj === "object") {
      for (let key in obj) {
        if (key === "#text") {
          // console.log(obj);
          // console.log("-- delimiter --");
          const elementText = obj[key];
          // Text content is often in the '#text' key
          let text = "";
          if (elementText.length > 0) {
            text = elementText.trim();
          }
          if (text.length > MIN_TEXT_LENGTH) {
            const isUsefulTextAlreadyPresent = usefulText.find((arrayText) =>
              arrayText.includes(text)
            );
            if (!isUsefulTextAlreadyPresent) {
              usefulText.push(text);
            }
          }
        } else if (key !== "svg") {
          traverse(obj[key]);
        }
      }
    } else if (typeof obj === "string") {
      let text = obj.trim();
      if (text.length > MIN_TEXT_LENGTH && !containsPattern(text)) {
        const isUsefulTextAlreadyPresent = usefulText.find((arrayText) =>
          arrayText.includes(text)
        );
        if (!isUsefulTextAlreadyPresent) {
          usefulText.push(text);
        }
      }
    }
  }

  traverse(xmlObject);
  return usefulText;
}

const writeToFile = (content: string[]) => {
  fs.appendFile("output.txt", JSON.stringify(content, null, 2), (err) => {
    if (err) {
      console.error("Error writing HTML file:", err);
    } else {
      console.log("HTML file has been saved successfully.");
    }
  });
};

// Main function to process the XML file
async function main() {
  const filePath = "./output.html"; // Replace with your XML file path
  try {
    const xmlObject = await parseXMLFile(filePath);
    const usefulText = extractUsefulText(xmlObject);
    writeToFile(usefulText);
  } catch (error) {
    console.error("Error processing XML file:", error);
  }
}

// Run the main function
main();
