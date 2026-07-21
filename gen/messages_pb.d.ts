// package: christiangeorgelucas.tokenizer_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class TextEncodingRequest extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getEncoding(): string;
  setEncoding(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TextEncodingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TextEncodingRequest): TextEncodingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TextEncodingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TextEncodingRequest;
  static deserializeBinaryFromReader(message: TextEncodingRequest, reader: jspb.BinaryReader): TextEncodingRequest;
}

export namespace TextEncodingRequest {
  export type AsObject = {
    text: string,
    encoding: string,
  }
}

export class CountResult extends jspb.Message {
  getCount(): number;
  setCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountResult.AsObject;
  static toObject(includeInstance: boolean, msg: CountResult): CountResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CountResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountResult;
  static deserializeBinaryFromReader(message: CountResult, reader: jspb.BinaryReader): CountResult;
}

export namespace CountResult {
  export type AsObject = {
    count: number,
    error: string,
  }
}

export class TextModelRequest extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getModel(): string;
  setModel(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TextModelRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TextModelRequest): TextModelRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TextModelRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TextModelRequest;
  static deserializeBinaryFromReader(message: TextModelRequest, reader: jspb.BinaryReader): TextModelRequest;
}

export namespace TextModelRequest {
  export type AsObject = {
    text: string,
    model: string,
  }
}

export class CountForModelResult extends jspb.Message {
  getCount(): number;
  setCount(value: number): void;

  getEncoding(): string;
  setEncoding(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountForModelResult.AsObject;
  static toObject(includeInstance: boolean, msg: CountForModelResult): CountForModelResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CountForModelResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountForModelResult;
  static deserializeBinaryFromReader(message: CountForModelResult, reader: jspb.BinaryReader): CountForModelResult;
}

export namespace CountForModelResult {
  export type AsObject = {
    count: number,
    encoding: string,
    error: string,
  }
}

export class EncodeResult extends jspb.Message {
  clearTokenIdsList(): void;
  getTokenIdsList(): Array<number>;
  setTokenIdsList(value: Array<number>): void;
  addTokenIds(value: number, index?: number): number;

  getCount(): number;
  setCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EncodeResult.AsObject;
  static toObject(includeInstance: boolean, msg: EncodeResult): EncodeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EncodeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EncodeResult;
  static deserializeBinaryFromReader(message: EncodeResult, reader: jspb.BinaryReader): EncodeResult;
}

export namespace EncodeResult {
  export type AsObject = {
    tokenIdsList: Array<number>,
    count: number,
    error: string,
  }
}

export class DecodeRequest extends jspb.Message {
  clearTokenIdsList(): void;
  getTokenIdsList(): Array<number>;
  setTokenIdsList(value: Array<number>): void;
  addTokenIds(value: number, index?: number): number;

  getEncoding(): string;
  setEncoding(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DecodeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DecodeRequest): DecodeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DecodeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DecodeRequest;
  static deserializeBinaryFromReader(message: DecodeRequest, reader: jspb.BinaryReader): DecodeRequest;
}

export namespace DecodeRequest {
  export type AsObject = {
    tokenIdsList: Array<number>,
    encoding: string,
  }
}

export class DecodeResult extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DecodeResult.AsObject;
  static toObject(includeInstance: boolean, msg: DecodeResult): DecodeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DecodeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DecodeResult;
  static deserializeBinaryFromReader(message: DecodeResult, reader: jspb.BinaryReader): DecodeResult;
}

export namespace DecodeResult {
  export type AsObject = {
    text: string,
    error: string,
  }
}

export class TruncateRequest extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getEncoding(): string;
  setEncoding(value: string): void;

  getMaxTokens(): number;
  setMaxTokens(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TruncateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TruncateRequest): TruncateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TruncateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TruncateRequest;
  static deserializeBinaryFromReader(message: TruncateRequest, reader: jspb.BinaryReader): TruncateRequest;
}

export namespace TruncateRequest {
  export type AsObject = {
    text: string,
    encoding: string,
    maxTokens: number,
  }
}

export class TruncateResult extends jspb.Message {
  getTruncatedText(): string;
  setTruncatedText(value: string): void;

  getTruncated(): boolean;
  setTruncated(value: boolean): void;

  getTokensKept(): number;
  setTokensKept(value: number): void;

  getTokensDropped(): number;
  setTokensDropped(value: number): void;

  getCharsDropped(): number;
  setCharsDropped(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TruncateResult.AsObject;
  static toObject(includeInstance: boolean, msg: TruncateResult): TruncateResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TruncateResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TruncateResult;
  static deserializeBinaryFromReader(message: TruncateResult, reader: jspb.BinaryReader): TruncateResult;
}

export namespace TruncateResult {
  export type AsObject = {
    truncatedText: string,
    truncated: boolean,
    tokensKept: number,
    tokensDropped: number,
    charsDropped: number,
    error: string,
  }
}

export class FitsBudgetRequest extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getEncoding(): string;
  setEncoding(value: string): void;

  getMaxTokens(): number;
  setMaxTokens(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FitsBudgetRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FitsBudgetRequest): FitsBudgetRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FitsBudgetRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FitsBudgetRequest;
  static deserializeBinaryFromReader(message: FitsBudgetRequest, reader: jspb.BinaryReader): FitsBudgetRequest;
}

export namespace FitsBudgetRequest {
  export type AsObject = {
    text: string,
    encoding: string,
    maxTokens: number,
  }
}

export class FitsBudgetResult extends jspb.Message {
  getFits(): boolean;
  setFits(value: boolean): void;

  getCount(): number;
  setCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FitsBudgetResult.AsObject;
  static toObject(includeInstance: boolean, msg: FitsBudgetResult): FitsBudgetResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FitsBudgetResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FitsBudgetResult;
  static deserializeBinaryFromReader(message: FitsBudgetResult, reader: jspb.BinaryReader): FitsBudgetResult;
}

export namespace FitsBudgetResult {
  export type AsObject = {
    fits: boolean,
    count: number,
    error: string,
  }
}

export class ChunkTextRequest extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getEncoding(): string;
  setEncoding(value: string): void;

  getMaxTokensPerChunk(): number;
  setMaxTokensPerChunk(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChunkTextRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChunkTextRequest): ChunkTextRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChunkTextRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChunkTextRequest;
  static deserializeBinaryFromReader(message: ChunkTextRequest, reader: jspb.BinaryReader): ChunkTextRequest;
}

export namespace ChunkTextRequest {
  export type AsObject = {
    text: string,
    encoding: string,
    maxTokensPerChunk: number,
  }
}

export class TextChunk extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getTokenCount(): number;
  setTokenCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TextChunk.AsObject;
  static toObject(includeInstance: boolean, msg: TextChunk): TextChunk.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TextChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TextChunk;
  static deserializeBinaryFromReader(message: TextChunk, reader: jspb.BinaryReader): TextChunk;
}

export namespace TextChunk {
  export type AsObject = {
    text: string,
    tokenCount: number,
  }
}

export class ChunkTextResult extends jspb.Message {
  clearChunksList(): void;
  getChunksList(): Array<TextChunk>;
  setChunksList(value: Array<TextChunk>): void;
  addChunks(value?: TextChunk, index?: number): TextChunk;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChunkTextResult.AsObject;
  static toObject(includeInstance: boolean, msg: ChunkTextResult): ChunkTextResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChunkTextResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChunkTextResult;
  static deserializeBinaryFromReader(message: ChunkTextResult, reader: jspb.BinaryReader): ChunkTextResult;
}

export namespace ChunkTextResult {
  export type AsObject = {
    chunksList: Array<TextChunk.AsObject>,
    error: string,
  }
}

export class ChatMessage extends jspb.Message {
  getRole(): string;
  setRole(value: string): void;

  getName(): string;
  setName(value: string): void;

  getContent(): string;
  setContent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMessage): ChatMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatMessage;
  static deserializeBinaryFromReader(message: ChatMessage, reader: jspb.BinaryReader): ChatMessage;
}

export namespace ChatMessage {
  export type AsObject = {
    role: string,
    name: string,
    content: string,
  }
}

export class ChatTokensRequest extends jspb.Message {
  clearMessagesList(): void;
  getMessagesList(): Array<ChatMessage>;
  setMessagesList(value: Array<ChatMessage>): void;
  addMessages(value?: ChatMessage, index?: number): ChatMessage;

  getModel(): string;
  setModel(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatTokensRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChatTokensRequest): ChatTokensRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatTokensRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatTokensRequest;
  static deserializeBinaryFromReader(message: ChatTokensRequest, reader: jspb.BinaryReader): ChatTokensRequest;
}

export namespace ChatTokensRequest {
  export type AsObject = {
    messagesList: Array<ChatMessage.AsObject>,
    model: string,
  }
}

export class ChatTokensResult extends jspb.Message {
  getCount(): number;
  setCount(value: number): void;

  getEncoding(): string;
  setEncoding(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatTokensResult.AsObject;
  static toObject(includeInstance: boolean, msg: ChatTokensResult): ChatTokensResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatTokensResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatTokensResult;
  static deserializeBinaryFromReader(message: ChatTokensResult, reader: jspb.BinaryReader): ChatTokensResult;
}

export namespace ChatTokensResult {
  export type AsObject = {
    count: number,
    encoding: string,
    error: string,
  }
}

export class ListEncodingsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListEncodingsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListEncodingsRequest): ListEncodingsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListEncodingsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListEncodingsRequest;
  static deserializeBinaryFromReader(message: ListEncodingsRequest, reader: jspb.BinaryReader): ListEncodingsRequest;
}

export namespace ListEncodingsRequest {
  export type AsObject = {
  }
}

export class EncodingInfo extends jspb.Message {
  getEncoding(): string;
  setEncoding(value: string): void;

  clearExampleModelsList(): void;
  getExampleModelsList(): Array<string>;
  setExampleModelsList(value: Array<string>): void;
  addExampleModels(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EncodingInfo.AsObject;
  static toObject(includeInstance: boolean, msg: EncodingInfo): EncodingInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EncodingInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EncodingInfo;
  static deserializeBinaryFromReader(message: EncodingInfo, reader: jspb.BinaryReader): EncodingInfo;
}

export namespace EncodingInfo {
  export type AsObject = {
    encoding: string,
    exampleModelsList: Array<string>,
  }
}

export class ListEncodingsResult extends jspb.Message {
  clearEncodingsList(): void;
  getEncodingsList(): Array<EncodingInfo>;
  setEncodingsList(value: Array<EncodingInfo>): void;
  addEncodings(value?: EncodingInfo, index?: number): EncodingInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListEncodingsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListEncodingsResult): ListEncodingsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListEncodingsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListEncodingsResult;
  static deserializeBinaryFromReader(message: ListEncodingsResult, reader: jspb.BinaryReader): ListEncodingsResult;
}

export namespace ListEncodingsResult {
  export type AsObject = {
    encodingsList: Array<EncodingInfo.AsObject>,
  }
}

export class ModelRequest extends jspb.Message {
  getModel(): string;
  setModel(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModelRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ModelRequest): ModelRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ModelRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModelRequest;
  static deserializeBinaryFromReader(message: ModelRequest, reader: jspb.BinaryReader): ModelRequest;
}

export namespace ModelRequest {
  export type AsObject = {
    model: string,
  }
}

export class EncodingForModelResult extends jspb.Message {
  getEncoding(): string;
  setEncoding(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EncodingForModelResult.AsObject;
  static toObject(includeInstance: boolean, msg: EncodingForModelResult): EncodingForModelResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EncodingForModelResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EncodingForModelResult;
  static deserializeBinaryFromReader(message: EncodingForModelResult, reader: jspb.BinaryReader): EncodingForModelResult;
}

export namespace EncodingForModelResult {
  export type AsObject = {
    encoding: string,
    error: string,
  }
}

