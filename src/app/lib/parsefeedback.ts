export function parseLLMResponse(output: string) {
  try {
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      score: parsed.score || "0",
      feedback: parsed.feedback || "",
      followUpQuestion: parsed.followUpQuestion || "Next question not found.",
    };
  } catch (err) {
    console.error("Error parsing response:", err);
    return {
      score: "0",
      feedback: "Sorry, something went wrong with AI response.",
      followUpQuestion: "Could you tell me more about your technical experience?",
    };
  }
}
