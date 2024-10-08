import { Injectable } from "@nestjs/common";
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { prompts } from "./prompts";
import { MeasureType } from "src/types/mainTypes";

@Injectable()
export class GeminiService {
    constructor() { }

    filterMeasure(texto: string): string {
        // \D representa qualquer caractere que NÃO seja um dígito
        return texto.replace(/\D/g, '');
    }

    apiKey = process.env.GEMINI_API_KEY;
    genAI = new GoogleGenerativeAI(this.apiKey);
    fileManager = new GoogleAIFileManager(this.apiKey);
    model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });
    generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    async uploadToGemini(path, mimeType) {
        const uploadResult = await this.fileManager.uploadFile(path, {
            mimeType,
            displayName: path,
        });
        const file = uploadResult.file;
        console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
        return file;
    }

    async getMeasure(imageURL: string, measureType: MeasureType) {
        const files = [
            await this.uploadToGemini(imageURL, "image/png"),
        ];
        const chatSession = this.model.startChat({
            generationConfig: this.generationConfig,

            history: [
                {
                    role: "user",
                    parts: [
                        {
                            fileData: {
                                mimeType: files[0].mimeType,
                                fileUri: files[0].uri,
                            },
                        }
                    ],
                },
            ],
        });

        const prompt = prompts[measureType]

        const result = await chatSession.sendMessage(prompt);
        return this.filterMeasure(result.response.text());
    }

}