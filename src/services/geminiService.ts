import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async generateImage(prompt: string, aspectRatio: string = "1:1") {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  },

  async generateVoice(text: string, voiceName: string = 'Kore') {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO" as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (inlineData) {
      const base64Audio = inlineData.data;
      const mimeType = inlineData.mimeType || '';

      if (mimeType.includes('wav') || mimeType.includes('mp3') || mimeType.includes('mpeg')) {
        return `data:${mimeType};base64,${base64Audio}`;
      }

      // Convert raw PCM to WAV Blob URL
      const binaryString = window.atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const sampleRate = 24000;
      const numChannels = 1;
      const byteRate = sampleRate * numChannels * 2;
      const blockAlign = numChannels * 2;
      const buffer = new ArrayBuffer(44 + bytes.length);
      const view = new DataView(buffer);

      const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + bytes.length, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, byteRate, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, 'data');
      view.setUint32(40, bytes.length, true);

      const pcmBytes = new Uint8Array(buffer, 44);
      pcmBytes.set(bytes);

      const blob = new Blob([buffer], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    }
    throw new Error("No audio generated");
  },

  async generateStory(prompt: string, mode: string = 'YouTube Automation') {
    let systemInstruction = "Break down this prompt into 3-4 scenes for a video. For each scene, provide a visual description (for image generation) and a short narration script. Return as JSON array of objects with {scene_description, narration}.";
    
    if (mode === 'Tutorial Mode') {
      systemInstruction = "Break down this prompt into a step-by-step tutorial video (4-5 scenes). Include an intro, clear steps, and an outro. For each scene, provide a visual description showing UI/actions, and a clear instructional narration script. Return as JSON array of objects with {scene_description, narration}.";
    } else if (mode === 'Explainer Video Mode') {
      systemInstruction = "Break down this prompt into an engaging explainer video (4-5 scenes). Include a hook/problem statement, solution introduction, benefits, and call to action. For each scene, provide a visual description (infographics, abstract concepts, or character animations) and a persuasive narration script. Return as JSON array of objects with {scene_description, narration}.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${systemInstruction} Prompt: ${prompt}`,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  },

  async storyAssistant(mode: 'brainstorm' | 'outline' | 'suggestions', input: string) {
    let prompt = "";
    if (mode === 'brainstorm') {
      prompt = `Brainstorm 5 creative and engaging video ideas based on this topic or niche: "${input}". For each idea, provide a catchy title and a brief 2-sentence concept. Return as a JSON array of objects with {title, concept}.`;
    } else if (mode === 'outline') {
      prompt = `Generate a detailed plot outline for a video about: "${input}". Include an introduction, 3 main plot points/acts, and a conclusion. Return as a JSON object with {introduction, acts: [act1, act2, act3], conclusion}.`;
    } else if (mode === 'suggestions') {
      prompt = `Provide suggestions for scene transitions and character development for this story concept: "${input}". Focus on making the narrative more professional and engaging. Return as a JSON object with {transitions: [suggestion1, suggestion2], character_development: [suggestion1, suggestion2]}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  },

  async suggestThumbnails(videoPrompt: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this video prompt: "${videoPrompt}", suggest 3 high-CTR YouTube thumbnail designs. For each, provide a "text" (bold overlay text) and a "visual_prompt" (description for the background image). Return as a JSON array of objects with {text, visual_prompt}.`,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  }
};
