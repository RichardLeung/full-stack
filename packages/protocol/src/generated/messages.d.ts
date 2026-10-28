import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace learning. */
export namespace learning {

    /** EventType enum. */
    enum EventType {
        UNKNOWN = 0,
        HELLO = 1,
        SEND_MESSAGE = 2,
        MESSAGE_CREATED = 3,
        ACK = 4,
        ERROR = 5,
        CONVERSATION_CHANGED = 6
    }

    /** MessageKind enum. */
    enum MessageKind {
        TEXT = 0,
        AUDIO = 1,
        IMAGE = 2
    }

    /** Properties of a Media. */
    interface IMedia {

        /** Media id */
        id?: (string|null);

        /** Media mimeType */
        mimeType?: (string|null);

        /** Media originalName */
        originalName?: (string|null);

        /** Media size */
        size?: (number|null);

        /** Media durationMs */
        durationMs?: (number|null);
    }

    /** Represents a Media. */
    class Media implements IMedia {

        /**
         * Constructs a new Media.
         * @param [properties] Properties to set
         */
        constructor(properties?: learning.IMedia);

        /** Media id. */
        public id: string;

        /** Media mimeType. */
        public mimeType: string;

        /** Media originalName. */
        public originalName: string;

        /** Media size. */
        public size: number;

        /** Media durationMs. */
        public durationMs: number;

        /**
         * Creates a new Media instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Media instance
         */
        public static create(properties?: learning.IMedia): learning.Media;

        /**
         * Encodes the specified Media message. Does not implicitly {@link learning.Media.verify|verify} messages.
         * @param message Media message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: learning.IMedia, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Media message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Media
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): learning.Media;

        /**
         * Verifies a Media message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Media message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Media
         */
        public static fromObject(object: { [k: string]: any }): learning.Media;

        /**
         * Creates a plain object from a Media message. Also converts values to other types if specified.
         * @param message Media
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: learning.Media, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Media to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Media
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatMessage. */
    interface IChatMessage {

        /** ChatMessage id */
        id?: (string|null);

        /** ChatMessage conversationId */
        conversationId?: (string|null);

        /** ChatMessage clientMessageId */
        clientMessageId?: (string|null);

        /** ChatMessage kind */
        kind?: (learning.MessageKind|null);

        /** ChatMessage text */
        text?: (string|null);

        /** ChatMessage mediaId */
        mediaId?: (string|null);

        /** ChatMessage createdAt */
        createdAt?: (string|null);

        /** ChatMessage media */
        media?: (learning.IMedia|null);
    }

    /** Represents a ChatMessage. */
    class ChatMessage implements IChatMessage {

        /**
         * Constructs a new ChatMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: learning.IChatMessage);

        /** ChatMessage id. */
        public id: string;

        /** ChatMessage conversationId. */
        public conversationId: string;

        /** ChatMessage clientMessageId. */
        public clientMessageId: string;

        /** ChatMessage kind. */
        public kind: learning.MessageKind;

        /** ChatMessage text. */
        public text: string;

        /** ChatMessage mediaId. */
        public mediaId: string;

        /** ChatMessage createdAt. */
        public createdAt: string;

        /** ChatMessage media. */
        public media?: (learning.IMedia|null);

        /**
         * Creates a new ChatMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatMessage instance
         */
        public static create(properties?: learning.IChatMessage): learning.ChatMessage;

        /**
         * Encodes the specified ChatMessage message. Does not implicitly {@link learning.ChatMessage.verify|verify} messages.
         * @param message ChatMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: learning.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): learning.ChatMessage;

        /**
         * Verifies a ChatMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatMessage
         */
        public static fromObject(object: { [k: string]: any }): learning.ChatMessage;

        /**
         * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
         * @param message ChatMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: learning.ChatMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChatMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Conversation. */
    interface IConversation {

        /** Conversation id */
        id?: (string|null);

        /** Conversation title */
        title?: (string|null);

        /** Conversation updatedAt */
        updatedAt?: (string|null);
    }

    /** Represents a Conversation. */
    class Conversation implements IConversation {

        /**
         * Constructs a new Conversation.
         * @param [properties] Properties to set
         */
        constructor(properties?: learning.IConversation);

        /** Conversation id. */
        public id: string;

        /** Conversation title. */
        public title: string;

        /** Conversation updatedAt. */
        public updatedAt: string;

        /**
         * Creates a new Conversation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Conversation instance
         */
        public static create(properties?: learning.IConversation): learning.Conversation;

        /**
         * Encodes the specified Conversation message. Does not implicitly {@link learning.Conversation.verify|verify} messages.
         * @param message Conversation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: learning.IConversation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Conversation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Conversation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): learning.Conversation;

        /**
         * Verifies a Conversation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Conversation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Conversation
         */
        public static fromObject(object: { [k: string]: any }): learning.Conversation;

        /**
         * Creates a plain object from a Conversation message. Also converts values to other types if specified.
         * @param message Conversation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: learning.Conversation, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Conversation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Conversation
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Envelope. */
    interface IEnvelope {

        /** Envelope version */
        version?: (number|null);

        /** Envelope requestId */
        requestId?: (string|null);

        /** Envelope type */
        type?: (learning.EventType|null);

        /** Envelope message */
        message?: (learning.IChatMessage|null);

        /** Envelope conversationId */
        conversationId?: (string|null);

        /** Envelope error */
        error?: (string|null);

        /** Envelope conversation */
        conversation?: (learning.IConversation|null);
    }

    /** Represents an Envelope. */
    class Envelope implements IEnvelope {

        /**
         * Constructs a new Envelope.
         * @param [properties] Properties to set
         */
        constructor(properties?: learning.IEnvelope);

        /** Envelope version. */
        public version: number;

        /** Envelope requestId. */
        public requestId: string;

        /** Envelope type. */
        public type: learning.EventType;

        /** Envelope message. */
        public message?: (learning.IChatMessage|null);

        /** Envelope conversationId. */
        public conversationId: string;

        /** Envelope error. */
        public error: string;

        /** Envelope conversation. */
        public conversation?: (learning.IConversation|null);

        /**
         * Creates a new Envelope instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Envelope instance
         */
        public static create(properties?: learning.IEnvelope): learning.Envelope;

        /**
         * Encodes the specified Envelope message. Does not implicitly {@link learning.Envelope.verify|verify} messages.
         * @param message Envelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: learning.IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Envelope message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Envelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): learning.Envelope;

        /**
         * Verifies an Envelope message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Envelope
         */
        public static fromObject(object: { [k: string]: any }): learning.Envelope;

        /**
         * Creates a plain object from an Envelope message. Also converts values to other types if specified.
         * @param message Envelope
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: learning.Envelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Envelope to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Envelope
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
