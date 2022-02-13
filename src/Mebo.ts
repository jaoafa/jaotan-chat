import config from "config";
import axios, {AxiosError} from "axios";

interface MeboOptions {
  utterance: string;
  uid: string;
}

interface MeboBestResponse {
  utterance: string;
  score: number;
  options: string[],
  topic: string;
  imageUrl?: string;
  url?: string;
  isAutoResponse: boolean;
  extensions: any;
}

interface MeboResponse {
  utterance: string;
  bestResponse: MeboBestResponse;
}

export async function mebo(options: MeboOptions): Promise<MeboResponse | null> {
  const utterance = options.utterance;
  const uid = options.uid;

  const url = "https://api-mebo.dev/api";
  const apiKey = config.get("meboApiKey");
  const body = {
    "api_key": apiKey,
    "agent_id": config.get("meboAgentId"),
    utterance,
    "uid": `jaotan-chat-${uid}`,
  };
  try {
    const response = await axios.post(url, body);
    return await response.data;
  } catch (e) {
    console.log((e as AxiosError).response?.data);
  }
  return null;
}