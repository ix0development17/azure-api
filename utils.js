export default function extractTextBetweenWords(text, wordBefore, wordAfter) {
    const startIndex = text.indexOf(wordBefore);
    const endIndex = text.indexOf(wordAfter);
    if (startIndex !== -1 && endIndex !== -1) {
      const extractedText = text
        .substring(startIndex + wordBefore.length, endIndex)
        .trim();
      return extractedText;
    } else {
      return "error";
    }
}