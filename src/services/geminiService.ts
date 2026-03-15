import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  async generateText(prompt: string) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || '';
  },

  async generateImage(prompt: string, aspectRatio: string = "1:1") {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
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

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  },

  async editImage(prompt: string, imageBase64: string, mimeType: string) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  },

  async generateVoice(text: string, voiceName: string = 'Kore', effects: { noiseReduction?: boolean, eq?: string } = {}) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
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

      let finalPcmBytes = bytes;
      const sampleRate = 24000;

      if (effects.noiseReduction || (effects.eq && effects.eq !== 'none')) {
        try {
          const float32Data = new Float32Array(bytes.length / 2);
          const dataView = new DataView(bytes.buffer);
          for (let i = 0; i < float32Data.length; i++) {
            float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
          }

          const offlineCtx = new OfflineAudioContext(1, float32Data.length, sampleRate);
          const audioBuffer = offlineCtx.createBuffer(1, float32Data.length, sampleRate);
          audioBuffer.copyToChannel(float32Data, 0);

          const source = offlineCtx.createBufferSource();
          source.buffer = audioBuffer;

          let currentNode: AudioNode = source;

          if (effects.noiseReduction) {
            const filter = offlineCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 8000;
            currentNode.connect(filter);
            currentNode = filter;
            
            const compressor = offlineCtx.createDynamicsCompressor();
            compressor.threshold.value = -50;
            compressor.knee.value = 40;
            compressor.ratio.value = 12;
            compressor.attack.value = 0;
            compressor.release.value = 0.25;
            currentNode.connect(compressor);
            currentNode = compressor;
          }

          if (effects.eq === 'bass-boost') {
            const filter = offlineCtx.createBiquadFilter();
            filter.type = 'lowshelf';
            filter.frequency.value = 200;
            filter.gain.value = 6;
            currentNode.connect(filter);
            currentNode = filter;
          } else if (effects.eq === 'treble-boost') {
            const filter = offlineCtx.createBiquadFilter();
            filter.type = 'highshelf';
            filter.frequency.value = 3000;
            filter.gain.value = 6;
            currentNode.connect(filter);
            currentNode = filter;
          } else if (effects.eq === 'vocal-presence') {
            const filter = offlineCtx.createBiquadFilter();
            filter.type = 'peaking';
            filter.frequency.value = 3000;
            filter.Q.value = 1;
            filter.gain.value = 5;
            currentNode.connect(filter);
            currentNode = filter;
          } else if (effects.eq === 'radio') {
            const hpFilter = offlineCtx.createBiquadFilter();
            hpFilter.type = 'highpass';
            hpFilter.frequency.value = 1000;
            currentNode.connect(hpFilter);
            
            const lpFilter = offlineCtx.createBiquadFilter();
            lpFilter.type = 'lowpass';
            lpFilter.frequency.value = 3000;
            hpFilter.connect(lpFilter);
            currentNode = lpFilter;
          }

          currentNode.connect(offlineCtx.destination);
          source.start();

          const renderedBuffer = await offlineCtx.startRendering();
          const renderedData = renderedBuffer.getChannelData(0);

          const outBytes = new Uint8Array(renderedData.length * 2);
          const outView = new DataView(outBytes.buffer);
          for (let i = 0; i < renderedData.length; i++) {
            let s = Math.max(-1, Math.min(1, renderedData[i]));
            outView.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
          }
          finalPcmBytes = outBytes;
        } catch (e) {
          console.error("Audio processing failed", e);
        }
      }

      const numChannels = 1;
      const byteRate = sampleRate * numChannels * 2;
      const blockAlign = numChannels * 2;
      const buffer = new ArrayBuffer(44 + finalPcmBytes.length);
      const view = new DataView(buffer);

      const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + finalPcmBytes.length, true);
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
      view.setUint32(40, finalPcmBytes.length, true);

      const pcmBytesView = new Uint8Array(buffer, 44);
      pcmBytesView.set(finalPcmBytes);

      const blob = new Blob([buffer], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    }
    throw new Error("No audio generated");
  },

  async generateSingleVideo(prompt: string, aspectRatio: string = '16:9', duration: string = '5s') {
    const apiKey = process.env.API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });
    
    const isExtended = duration === '12s';
    const model = isExtended ? 'veo-3.1-generate-preview' : 'veo-3.1-fast-generate-preview';
    
    let operation = await ai.models.generateVideos({
      model: model,
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio as any
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    if (operation.error) {
      throw new Error((operation.error as any).message || "Video generation failed during processing");
    }

    let finalVideo = operation.response?.generatedVideos?.[0]?.video;

    if (isExtended && finalVideo) {
      // Extend the video
      let extendOperation = await ai.models.generateVideos({
        model: 'veo-3.1-generate-preview',
        prompt: 'continue the scene seamlessly',
        video: finalVideo,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio as any
        }
      });

      while (!extendOperation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        extendOperation = await ai.operations.getVideosOperation({operation: extendOperation});
      }

      if (extendOperation.error) {
        throw new Error((extendOperation.error as any).message || "Video extension failed during processing");
      }
      
      finalVideo = extendOperation.response?.generatedVideos?.[0]?.video;
    }

    const downloadLink = finalVideo?.uri;
    if (!downloadLink) throw new Error("Video generation failed: No video URI returned");

    const response = await fetch(downloadLink, {
      method: 'GET',
      headers: {
        'x-goog-api-key': apiKey || '',
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch generated video");
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  async generateStory(prompt: string, mode: string = 'YouTube Automation') {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
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
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
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
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
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
