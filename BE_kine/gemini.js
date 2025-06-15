import { GoogleGenAI } from "@google/genai";

/**
 * Gemini API key
 * @type {String}
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
/**
 * gg gen AI
 */
const AI = new GoogleGenAI({ apiKey: API_KEY });

/**
 * solve drawn math with gemini fr
 * @param {string} base64ImageUrl - image url that got from canvas
 * @returns {Promise<string>} A combined response: extracted LaTeX + solution steps/answer.
 */
export async function solveMathImage(base64ImageUrl) {

    const imgData = {
        mimeType: "image/png",
        data: base64ImageUrl.replace(/^data:image\/\w+;base64,/, ""),
    }
    // Prepare the “vision + text” payload
    const contents = [
        {
            // image data for gemini
            inlineData: imgData,
        },
        {
            // prompt
            text: `
                You are a skilled mathematician and LaTeX converter.  
                First, read the image above and convert any math or text into a clear LaTeX expression.  
                Then solve the problem step by step.  

                • If the image shows normal expressions (e.g. 2+3), extract them as LaTeX (e.g. \`2 + 3\`) and compute the result.  
                • If it shows variable assignments (e.g. x = 5, y = 2, then x + y), maintain the assignments and compute with them.  
                • If it shows LaTeX math (\`\\int_0^1 x^2 dx\`), restate the formula and solve it.  

                Format your output as:

                1. **Extracted expression (LaTeX):** \\[ ... \\]  
                2. **Solution:**  
                - Step 1: …  
                - Step 2: …  
                - **Answer:** …

                If the image has plain text or non-math content, just transcribe it as plain text.
            `.trim(),
        },
    ];

    const response = await AI.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
    })

    return response.text
}