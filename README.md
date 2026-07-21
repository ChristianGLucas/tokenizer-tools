# tokenizer-tools

Deterministic BPE tokenization for LLM context-window management: count,
encode, decode, truncate, chunk, and budget-check text against tiktoken's
`cl100k_base` / `o200k_base` / `p50k_base` / `p50k_edit` / `r50k_base` /
`gpt2` encodings, plus model-name resolution (`gpt-4o`, `gpt-4`,
`gpt-3.5-turbo`, `o1`, `gpt-5`, and other OpenAI model names) and
per-message chat-token accounting (the standard `num_tokens_from_messages`
overhead calculation agents need to size a chat request). Built for the
[Axiom](https://axiom.dev) marketplace (handle `christiangeorgelucas`).

## Nodes

| Node | What it does |
|---|---|
| `CountTokens` | Count tokens in text under an explicit encoding. |
| `CountTokensForModel` | Count tokens in text for a named model (resolves the model's encoding internally). |
| `Encode` | Turn text into its array of BPE token IDs. |
| `Decode` | Turn an array of BPE token IDs back into text, validating every ID against the encoding's real vocabulary first. |
| `Truncate` | Cut text down to a maximum token budget; reports tokens/chars dropped. |
| `FitsBudget` | Check whether text fits a token budget (boolean + count). |
| `ChunkText` | Split text into token-budget-bounded chunks (for embedding/RAG pipelines). |
| `CountChatTokens` | Count tokens for a chat-message array using the model's documented per-message/per-name overhead. |
| `ListEncodings` | List every supported encoding with representative example models. |
| `GetEncodingForModel` | Resolve a model name to the encoding it uses, without tokenizing anything. |

## Library wrapped

[`js-tiktoken`](https://www.npmjs.com/package/js-tiktoken) (MIT) — a pure
JavaScript port of OpenAI's `tiktoken`. Its encoding rank tables ship bundled
inside the npm package as offline data files (verified during authoring: no
runtime network fetch, ever). Its only runtime dependency is `base64-js`
(MIT), also license-verified.

## Correctness

Every encode/decode/count value in this package's test suite is checked
against an oracle **independent of js-tiktoken itself** — primarily the
official Python `tiktoken` package (a separate, Rust-backed implementation),
and for chat-token accounting, OpenAI's own cookbook example whose expected
counts are confirmed against a real OpenAI API response's
`usage.prompt_tokens` field.

`Decode` also closes a real gap in js-tiktoken: the library's own `decode()`
silently drops any token ID it doesn't recognize instead of raising an
error (confirmed directly against the library during authoring — Python's
official `tiktoken` raises `"Invalid token for decoding"` for the same ID).
This package validates every ID against the resolved encoding's actual
vocabulary before decoding, so an invalid ID is always a structured
`INVALID_TOKEN_ID` error, never a silently-shortened result.

## Design

Every node is a pure, deterministic, stateless text transform: no network
access, no filesystem, no wall-clock or randomness dependence — BPE
tokenization is a pure function of (text, encoding). Text input is capped at
1 MiB; token-ID arrays at 200,000 entries; chat requests at 500 messages /
4 MiB combined. An unknown encoding or model name always returns a
structured error, never a silent fallback.

## License

MIT — see [LICENSE](./LICENSE).
