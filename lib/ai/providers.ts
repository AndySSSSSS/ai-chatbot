import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { createQwen } from 'qwen-ai-provider';
import { fireworks } from '@ai-sdk/fireworks';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

const qwen = createQwen({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: 'sk-53e719214a2c47eb978dcd4a999fb953'
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model-small': chatModel,
        'chat-model-large': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model-small': qwen('qwen-turbo'),
        'chat-model-large': qwen('qwen-plus'),
        'chat-model-reasoning': wrapLanguageModel({
          model: qwen('qwq-plus'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': qwen('qwen-turbo'),
        'artifact-model': openai('gpt-4o-mini'),
      },
      imageModels: {
        'small-model': openai.image('dall-e-2'),
        'large-model': openai.image('dall-e-3'),
      },
    });
