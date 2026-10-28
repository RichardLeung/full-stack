import { learning } from './generated/messages';
export type Message = learning.IChatMessage;
export type Media = learning.IMedia;
export type Conversation = learning.IConversation;
export type Envelope = learning.IEnvelope;
export const EventType = learning.EventType;
export const MessageKind = learning.MessageKind;
export function encodeEnvelope(value: Envelope): Uint8Array {
  return learning.Envelope.encode(learning.Envelope.create({ ...value, version: 1 })).finish();
}
export function decodeEnvelope(data: Uint8Array): Envelope {
  const value = learning.Envelope.decode(data);
  if (value.version !== 1) throw new Error('Unsupported protocol version');
  return learning.Envelope.toObject(value, { defaults: true }) as Envelope;
}
