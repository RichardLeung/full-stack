/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const learning = $root.learning = (() => {

    /**
     * Namespace learning.
     * @exports learning
     * @namespace
     */
    const learning = {};

    /**
     * EventType enum.
     * @name learning.EventType
     * @enum {number}
     * @property {number} UNKNOWN=0 UNKNOWN value
     * @property {number} HELLO=1 HELLO value
     * @property {number} SEND_MESSAGE=2 SEND_MESSAGE value
     * @property {number} MESSAGE_CREATED=3 MESSAGE_CREATED value
     * @property {number} ACK=4 ACK value
     * @property {number} ERROR=5 ERROR value
     * @property {number} CONVERSATION_CHANGED=6 CONVERSATION_CHANGED value
     */
    learning.EventType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNKNOWN"] = 0;
        values[valuesById[1] = "HELLO"] = 1;
        values[valuesById[2] = "SEND_MESSAGE"] = 2;
        values[valuesById[3] = "MESSAGE_CREATED"] = 3;
        values[valuesById[4] = "ACK"] = 4;
        values[valuesById[5] = "ERROR"] = 5;
        values[valuesById[6] = "CONVERSATION_CHANGED"] = 6;
        return values;
    })();

    /**
     * MessageKind enum.
     * @name learning.MessageKind
     * @enum {number}
     * @property {number} TEXT=0 TEXT value
     * @property {number} AUDIO=1 AUDIO value
     * @property {number} IMAGE=2 IMAGE value
     */
    learning.MessageKind = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TEXT"] = 0;
        values[valuesById[1] = "AUDIO"] = 1;
        values[valuesById[2] = "IMAGE"] = 2;
        return values;
    })();

    learning.Media = (function() {

        /**
         * Properties of a Media.
         * @memberof learning
         * @interface IMedia
         * @property {string|null} [id] Media id
         * @property {string|null} [mimeType] Media mimeType
         * @property {string|null} [originalName] Media originalName
         * @property {number|null} [size] Media size
         * @property {number|null} [durationMs] Media durationMs
         */

        /**
         * Constructs a new Media.
         * @memberof learning
         * @classdesc Represents a Media.
         * @implements IMedia
         * @constructor
         * @param {learning.IMedia=} [properties] Properties to set
         */
        function Media(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Media id.
         * @member {string} id
         * @memberof learning.Media
         * @instance
         */
        Media.prototype.id = "";

        /**
         * Media mimeType.
         * @member {string} mimeType
         * @memberof learning.Media
         * @instance
         */
        Media.prototype.mimeType = "";

        /**
         * Media originalName.
         * @member {string} originalName
         * @memberof learning.Media
         * @instance
         */
        Media.prototype.originalName = "";

        /**
         * Media size.
         * @member {number} size
         * @memberof learning.Media
         * @instance
         */
        Media.prototype.size = 0;

        /**
         * Media durationMs.
         * @member {number} durationMs
         * @memberof learning.Media
         * @instance
         */
        Media.prototype.durationMs = 0;

        /**
         * Creates a new Media instance using the specified properties.
         * @function create
         * @memberof learning.Media
         * @static
         * @param {learning.IMedia=} [properties] Properties to set
         * @returns {learning.Media} Media instance
         */
        Media.create = function create(properties) {
            return new Media(properties);
        };

        /**
         * Encodes the specified Media message. Does not implicitly {@link learning.Media.verify|verify} messages.
         * @function encode
         * @memberof learning.Media
         * @static
         * @param {learning.IMedia} message Media message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Media.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.mimeType != null && Object.hasOwnProperty.call(message, "mimeType"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.mimeType);
            if (message.originalName != null && Object.hasOwnProperty.call(message, "originalName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.originalName);
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.size);
            if (message.durationMs != null && Object.hasOwnProperty.call(message, "durationMs"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.durationMs);
            return writer;
        };

        /**
         * Decodes a Media message from the specified reader or buffer.
         * @function decode
         * @memberof learning.Media
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {learning.Media} Media
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Media.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            let end, message;
            if (length === undefined)
                end = reader.len;
            else {
                end = reader.pos + length;
                if (end > reader.len)
                    throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
            }
            message = new $root.learning.Media();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.mimeType = reader.string();
                        break;
                    }
                case 3: {
                        message.originalName = reader.string();
                        break;
                    }
                case 4: {
                        message.size = reader.uint32();
                        break;
                    }
                case 5: {
                        message.durationMs = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            if (length !== undefined) {
                if (reader.pos !== end)
                    throw RangeError("index out of range");
                reader.len = length;
            }
            return message;
        };

        /**
         * Verifies a Media message.
         * @function verify
         * @memberof learning.Media
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Media.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.mimeType != null && Object.hasOwnProperty.call(message, "mimeType"))
                if (!$util.isString(message.mimeType))
                    return "mimeType: string expected";
            if (message.originalName != null && Object.hasOwnProperty.call(message, "originalName"))
                if (!$util.isString(message.originalName))
                    return "originalName: string expected";
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                if (!$util.isInteger(message.size))
                    return "size: integer expected";
            if (message.durationMs != null && Object.hasOwnProperty.call(message, "durationMs"))
                if (!$util.isInteger(message.durationMs))
                    return "durationMs: integer expected";
            return null;
        };

        /**
         * Creates a Media message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof learning.Media
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {learning.Media} Media
         */
        Media.fromObject = function fromObject(object, long) {
            if (object instanceof $root.learning.Media)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".learning.Media: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            let message = new $root.learning.Media();
            if (object.id != null)
                message.id = String(object.id);
            if (object.mimeType != null)
                message.mimeType = String(object.mimeType);
            if (object.originalName != null)
                message.originalName = String(object.originalName);
            if (object.size != null)
                message.size = object.size >>> 0;
            if (object.durationMs != null)
                message.durationMs = object.durationMs >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Media message. Also converts values to other types if specified.
         * @function toObject
         * @memberof learning.Media
         * @static
         * @param {learning.Media} message Media
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Media.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.mimeType = "";
                object.originalName = "";
                object.size = 0;
                object.durationMs = 0;
            }
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                object.id = message.id;
            if (message.mimeType != null && Object.hasOwnProperty.call(message, "mimeType"))
                object.mimeType = message.mimeType;
            if (message.originalName != null && Object.hasOwnProperty.call(message, "originalName"))
                object.originalName = message.originalName;
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                object.size = message.size;
            if (message.durationMs != null && Object.hasOwnProperty.call(message, "durationMs"))
                object.durationMs = message.durationMs;
            return object;
        };

        /**
         * Converts this Media to JSON.
         * @function toJSON
         * @memberof learning.Media
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Media.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Media
         * @function getTypeUrl
         * @memberof learning.Media
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Media.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/learning.Media";
        };

        return Media;
    })();

    learning.ChatMessage = (function() {

        /**
         * Properties of a ChatMessage.
         * @memberof learning
         * @interface IChatMessage
         * @property {string|null} [id] ChatMessage id
         * @property {string|null} [conversationId] ChatMessage conversationId
         * @property {string|null} [clientMessageId] ChatMessage clientMessageId
         * @property {learning.MessageKind|null} [kind] ChatMessage kind
         * @property {string|null} [text] ChatMessage text
         * @property {string|null} [mediaId] ChatMessage mediaId
         * @property {string|null} [createdAt] ChatMessage createdAt
         * @property {learning.IMedia|null} [media] ChatMessage media
         */

        /**
         * Constructs a new ChatMessage.
         * @memberof learning
         * @classdesc Represents a ChatMessage.
         * @implements IChatMessage
         * @constructor
         * @param {learning.IChatMessage=} [properties] Properties to set
         */
        function ChatMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatMessage id.
         * @member {string} id
         * @memberof learning.ChatMessage
         * @instance
         */
        ChatMessage.prototype.id = "";

        /**
         * ChatMessage conversationId.
         * @member {string} conversationId
         * @memberof learning.ChatMessage
         * @instance
         */
        ChatMessage.prototype.conversationId = "";

        /**
         * ChatMessage clientMessageId.
         * @member {string} clientMessageId
         * @memberof learning.ChatMessage
         * @instance
         */
        ChatMessage.prototype.clientMessageId = "";

        /**
         * ChatMessage kind.
         * @member {learning.MessageKind} kind
         * @memberof learning.ChatMessage
         * @instance
         */
        ChatMessage.prototype.kind = 0;

        /**
         * ChatMessage text.
         * @member {string} text
         * @memberof learning.ChatMessage
         * @instance
         */
        ChatMessage.prototype.text = "";

        /**
         * ChatMessage mediaId.
         * @member {string} mediaId
         * @memberof learning.ChatMessage
         * @instance
         */
        ChatMessage.prototype.mediaId = "";

        /**
         * ChatMessage createdAt.
         * @member {string} createdAt
         * @memberof learning.ChatMessage
         * @instance
         */
        ChatMessage.prototype.createdAt = "";

        /**
         * ChatMessage media.
         * @member {learning.IMedia|null|undefined} media
         * @memberof learning.ChatMessage
         * @instance
         */
        ChatMessage.prototype.media = null;

        /**
         * Creates a new ChatMessage instance using the specified properties.
         * @function create
         * @memberof learning.ChatMessage
         * @static
         * @param {learning.IChatMessage=} [properties] Properties to set
         * @returns {learning.ChatMessage} ChatMessage instance
         */
        ChatMessage.create = function create(properties) {
            return new ChatMessage(properties);
        };

        /**
         * Encodes the specified ChatMessage message. Does not implicitly {@link learning.ChatMessage.verify|verify} messages.
         * @function encode
         * @memberof learning.ChatMessage
         * @static
         * @param {learning.IChatMessage} message ChatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessage.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.conversationId != null && Object.hasOwnProperty.call(message, "conversationId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.conversationId);
            if (message.clientMessageId != null && Object.hasOwnProperty.call(message, "clientMessageId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.clientMessageId);
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.kind);
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.text);
            if (message.mediaId != null && Object.hasOwnProperty.call(message, "mediaId"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.mediaId);
            if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.createdAt);
            if (message.media != null && Object.hasOwnProperty.call(message, "media"))
                $root.learning.Media.encode(message.media, writer.uint32(/* id 8, wireType 2 =*/66).fork(), q + 1).ldelim();
            return writer;
        };

        /**
         * Decodes a ChatMessage message from the specified reader or buffer.
         * @function decode
         * @memberof learning.ChatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {learning.ChatMessage} ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessage.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            let end, message;
            if (length === undefined)
                end = reader.len;
            else {
                end = reader.pos + length;
                if (end > reader.len)
                    throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
            }
            message = new $root.learning.ChatMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.conversationId = reader.string();
                        break;
                    }
                case 3: {
                        message.clientMessageId = reader.string();
                        break;
                    }
                case 4: {
                        message.kind = reader.int32();
                        break;
                    }
                case 5: {
                        message.text = reader.string();
                        break;
                    }
                case 6: {
                        message.mediaId = reader.string();
                        break;
                    }
                case 7: {
                        message.createdAt = reader.string();
                        break;
                    }
                case 8: {
                        message.media = $root.learning.Media.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            if (length !== undefined) {
                if (reader.pos !== end)
                    throw RangeError("index out of range");
                reader.len = length;
            }
            return message;
        };

        /**
         * Verifies a ChatMessage message.
         * @function verify
         * @memberof learning.ChatMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatMessage.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.conversationId != null && Object.hasOwnProperty.call(message, "conversationId"))
                if (!$util.isString(message.conversationId))
                    return "conversationId: string expected";
            if (message.clientMessageId != null && Object.hasOwnProperty.call(message, "clientMessageId"))
                if (!$util.isString(message.clientMessageId))
                    return "clientMessageId: string expected";
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                switch (message.kind) {
                default:
                    return "kind: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                if (!$util.isString(message.text))
                    return "text: string expected";
            if (message.mediaId != null && Object.hasOwnProperty.call(message, "mediaId"))
                if (!$util.isString(message.mediaId))
                    return "mediaId: string expected";
            if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                if (!$util.isString(message.createdAt))
                    return "createdAt: string expected";
            if (message.media != null && Object.hasOwnProperty.call(message, "media")) {
                let error = $root.learning.Media.verify(message.media, long + 1);
                if (error)
                    return "media." + error;
            }
            return null;
        };

        /**
         * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof learning.ChatMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {learning.ChatMessage} ChatMessage
         */
        ChatMessage.fromObject = function fromObject(object, long) {
            if (object instanceof $root.learning.ChatMessage)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".learning.ChatMessage: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            let message = new $root.learning.ChatMessage();
            if (object.id != null)
                message.id = String(object.id);
            if (object.conversationId != null)
                message.conversationId = String(object.conversationId);
            if (object.clientMessageId != null)
                message.clientMessageId = String(object.clientMessageId);
            switch (object.kind) {
            default:
                if (typeof object.kind === "number") {
                    message.kind = object.kind;
                    break;
                }
                break;
            case "TEXT":
            case 0:
                message.kind = 0;
                break;
            case "AUDIO":
            case 1:
                message.kind = 1;
                break;
            case "IMAGE":
            case 2:
                message.kind = 2;
                break;
            }
            if (object.text != null)
                message.text = String(object.text);
            if (object.mediaId != null)
                message.mediaId = String(object.mediaId);
            if (object.createdAt != null)
                message.createdAt = String(object.createdAt);
            if (object.media != null) {
                if (!$util.isObject(object.media))
                    throw TypeError(".learning.ChatMessage.media: object expected");
                message.media = $root.learning.Media.fromObject(object.media, long + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof learning.ChatMessage
         * @static
         * @param {learning.ChatMessage} message ChatMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatMessage.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.conversationId = "";
                object.clientMessageId = "";
                object.kind = options.enums === String ? "TEXT" : 0;
                object.text = "";
                object.mediaId = "";
                object.createdAt = "";
                object.media = null;
            }
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                object.id = message.id;
            if (message.conversationId != null && Object.hasOwnProperty.call(message, "conversationId"))
                object.conversationId = message.conversationId;
            if (message.clientMessageId != null && Object.hasOwnProperty.call(message, "clientMessageId"))
                object.clientMessageId = message.clientMessageId;
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                object.kind = options.enums === String ? $root.learning.MessageKind[message.kind] === undefined ? message.kind : $root.learning.MessageKind[message.kind] : message.kind;
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                object.text = message.text;
            if (message.mediaId != null && Object.hasOwnProperty.call(message, "mediaId"))
                object.mediaId = message.mediaId;
            if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                object.createdAt = message.createdAt;
            if (message.media != null && Object.hasOwnProperty.call(message, "media"))
                object.media = $root.learning.Media.toObject(message.media, options, q + 1);
            return object;
        };

        /**
         * Converts this ChatMessage to JSON.
         * @function toJSON
         * @memberof learning.ChatMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ChatMessage
         * @function getTypeUrl
         * @memberof learning.ChatMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ChatMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/learning.ChatMessage";
        };

        return ChatMessage;
    })();

    learning.Conversation = (function() {

        /**
         * Properties of a Conversation.
         * @memberof learning
         * @interface IConversation
         * @property {string|null} [id] Conversation id
         * @property {string|null} [title] Conversation title
         * @property {string|null} [updatedAt] Conversation updatedAt
         */

        /**
         * Constructs a new Conversation.
         * @memberof learning
         * @classdesc Represents a Conversation.
         * @implements IConversation
         * @constructor
         * @param {learning.IConversation=} [properties] Properties to set
         */
        function Conversation(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Conversation id.
         * @member {string} id
         * @memberof learning.Conversation
         * @instance
         */
        Conversation.prototype.id = "";

        /**
         * Conversation title.
         * @member {string} title
         * @memberof learning.Conversation
         * @instance
         */
        Conversation.prototype.title = "";

        /**
         * Conversation updatedAt.
         * @member {string} updatedAt
         * @memberof learning.Conversation
         * @instance
         */
        Conversation.prototype.updatedAt = "";

        /**
         * Creates a new Conversation instance using the specified properties.
         * @function create
         * @memberof learning.Conversation
         * @static
         * @param {learning.IConversation=} [properties] Properties to set
         * @returns {learning.Conversation} Conversation instance
         */
        Conversation.create = function create(properties) {
            return new Conversation(properties);
        };

        /**
         * Encodes the specified Conversation message. Does not implicitly {@link learning.Conversation.verify|verify} messages.
         * @function encode
         * @memberof learning.Conversation
         * @static
         * @param {learning.IConversation} message Conversation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Conversation.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
            if (message.updatedAt != null && Object.hasOwnProperty.call(message, "updatedAt"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.updatedAt);
            return writer;
        };

        /**
         * Decodes a Conversation message from the specified reader or buffer.
         * @function decode
         * @memberof learning.Conversation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {learning.Conversation} Conversation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Conversation.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            let end, message;
            if (length === undefined)
                end = reader.len;
            else {
                end = reader.pos + length;
                if (end > reader.len)
                    throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
            }
            message = new $root.learning.Conversation();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.title = reader.string();
                        break;
                    }
                case 3: {
                        message.updatedAt = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            if (length !== undefined) {
                if (reader.pos !== end)
                    throw RangeError("index out of range");
                reader.len = length;
            }
            return message;
        };

        /**
         * Verifies a Conversation message.
         * @function verify
         * @memberof learning.Conversation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Conversation.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                if (!$util.isString(message.title))
                    return "title: string expected";
            if (message.updatedAt != null && Object.hasOwnProperty.call(message, "updatedAt"))
                if (!$util.isString(message.updatedAt))
                    return "updatedAt: string expected";
            return null;
        };

        /**
         * Creates a Conversation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof learning.Conversation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {learning.Conversation} Conversation
         */
        Conversation.fromObject = function fromObject(object, long) {
            if (object instanceof $root.learning.Conversation)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".learning.Conversation: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            let message = new $root.learning.Conversation();
            if (object.id != null)
                message.id = String(object.id);
            if (object.title != null)
                message.title = String(object.title);
            if (object.updatedAt != null)
                message.updatedAt = String(object.updatedAt);
            return message;
        };

        /**
         * Creates a plain object from a Conversation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof learning.Conversation
         * @static
         * @param {learning.Conversation} message Conversation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Conversation.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.title = "";
                object.updatedAt = "";
            }
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                object.id = message.id;
            if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                object.title = message.title;
            if (message.updatedAt != null && Object.hasOwnProperty.call(message, "updatedAt"))
                object.updatedAt = message.updatedAt;
            return object;
        };

        /**
         * Converts this Conversation to JSON.
         * @function toJSON
         * @memberof learning.Conversation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Conversation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Conversation
         * @function getTypeUrl
         * @memberof learning.Conversation
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Conversation.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/learning.Conversation";
        };

        return Conversation;
    })();

    learning.Envelope = (function() {

        /**
         * Properties of an Envelope.
         * @memberof learning
         * @interface IEnvelope
         * @property {number|null} [version] Envelope version
         * @property {string|null} [requestId] Envelope requestId
         * @property {learning.EventType|null} [type] Envelope type
         * @property {learning.IChatMessage|null} [message] Envelope message
         * @property {string|null} [conversationId] Envelope conversationId
         * @property {string|null} [error] Envelope error
         * @property {learning.IConversation|null} [conversation] Envelope conversation
         */

        /**
         * Constructs a new Envelope.
         * @memberof learning
         * @classdesc Represents an Envelope.
         * @implements IEnvelope
         * @constructor
         * @param {learning.IEnvelope=} [properties] Properties to set
         */
        function Envelope(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Envelope version.
         * @member {number} version
         * @memberof learning.Envelope
         * @instance
         */
        Envelope.prototype.version = 0;

        /**
         * Envelope requestId.
         * @member {string} requestId
         * @memberof learning.Envelope
         * @instance
         */
        Envelope.prototype.requestId = "";

        /**
         * Envelope type.
         * @member {learning.EventType} type
         * @memberof learning.Envelope
         * @instance
         */
        Envelope.prototype.type = 0;

        /**
         * Envelope message.
         * @member {learning.IChatMessage|null|undefined} message
         * @memberof learning.Envelope
         * @instance
         */
        Envelope.prototype.message = null;

        /**
         * Envelope conversationId.
         * @member {string} conversationId
         * @memberof learning.Envelope
         * @instance
         */
        Envelope.prototype.conversationId = "";

        /**
         * Envelope error.
         * @member {string} error
         * @memberof learning.Envelope
         * @instance
         */
        Envelope.prototype.error = "";

        /**
         * Envelope conversation.
         * @member {learning.IConversation|null|undefined} conversation
         * @memberof learning.Envelope
         * @instance
         */
        Envelope.prototype.conversation = null;

        /**
         * Creates a new Envelope instance using the specified properties.
         * @function create
         * @memberof learning.Envelope
         * @static
         * @param {learning.IEnvelope=} [properties] Properties to set
         * @returns {learning.Envelope} Envelope instance
         */
        Envelope.create = function create(properties) {
            return new Envelope(properties);
        };

        /**
         * Encodes the specified Envelope message. Does not implicitly {@link learning.Envelope.verify|verify} messages.
         * @function encode
         * @memberof learning.Envelope
         * @static
         * @param {learning.IEnvelope} message Envelope message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Envelope.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
            if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.requestId);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                $root.learning.ChatMessage.encode(message.message, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
            if (message.conversationId != null && Object.hasOwnProperty.call(message, "conversationId"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.conversationId);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.error);
            if (message.conversation != null && Object.hasOwnProperty.call(message, "conversation"))
                $root.learning.Conversation.encode(message.conversation, writer.uint32(/* id 7, wireType 2 =*/58).fork(), q + 1).ldelim();
            return writer;
        };

        /**
         * Decodes an Envelope message from the specified reader or buffer.
         * @function decode
         * @memberof learning.Envelope
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {learning.Envelope} Envelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Envelope.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            let end, message;
            if (length === undefined)
                end = reader.len;
            else {
                end = reader.pos + length;
                if (end > reader.len)
                    throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
            }
            message = new $root.learning.Envelope();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.version = reader.uint32();
                        break;
                    }
                case 2: {
                        message.requestId = reader.string();
                        break;
                    }
                case 3: {
                        message.type = reader.int32();
                        break;
                    }
                case 4: {
                        message.message = $root.learning.ChatMessage.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 5: {
                        message.conversationId = reader.string();
                        break;
                    }
                case 6: {
                        message.error = reader.string();
                        break;
                    }
                case 7: {
                        message.conversation = $root.learning.Conversation.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            if (length !== undefined) {
                if (reader.pos !== end)
                    throw RangeError("index out of range");
                reader.len = length;
            }
            return message;
        };

        /**
         * Verifies an Envelope message.
         * @function verify
         * @memberof learning.Envelope
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Envelope.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                if (!$util.isString(message.requestId))
                    return "requestId: string expected";
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    break;
                }
            if (message.message != null && Object.hasOwnProperty.call(message, "message")) {
                let error = $root.learning.ChatMessage.verify(message.message, long + 1);
                if (error)
                    return "message." + error;
            }
            if (message.conversationId != null && Object.hasOwnProperty.call(message, "conversationId"))
                if (!$util.isString(message.conversationId))
                    return "conversationId: string expected";
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            if (message.conversation != null && Object.hasOwnProperty.call(message, "conversation")) {
                let error = $root.learning.Conversation.verify(message.conversation, long + 1);
                if (error)
                    return "conversation." + error;
            }
            return null;
        };

        /**
         * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof learning.Envelope
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {learning.Envelope} Envelope
         */
        Envelope.fromObject = function fromObject(object, long) {
            if (object instanceof $root.learning.Envelope)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".learning.Envelope: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            let message = new $root.learning.Envelope();
            if (object.version != null)
                message.version = object.version >>> 0;
            if (object.requestId != null)
                message.requestId = String(object.requestId);
            switch (object.type) {
            default:
                if (typeof object.type === "number") {
                    message.type = object.type;
                    break;
                }
                break;
            case "UNKNOWN":
            case 0:
                message.type = 0;
                break;
            case "HELLO":
            case 1:
                message.type = 1;
                break;
            case "SEND_MESSAGE":
            case 2:
                message.type = 2;
                break;
            case "MESSAGE_CREATED":
            case 3:
                message.type = 3;
                break;
            case "ACK":
            case 4:
                message.type = 4;
                break;
            case "ERROR":
            case 5:
                message.type = 5;
                break;
            case "CONVERSATION_CHANGED":
            case 6:
                message.type = 6;
                break;
            }
            if (object.message != null) {
                if (!$util.isObject(object.message))
                    throw TypeError(".learning.Envelope.message: object expected");
                message.message = $root.learning.ChatMessage.fromObject(object.message, long + 1);
            }
            if (object.conversationId != null)
                message.conversationId = String(object.conversationId);
            if (object.error != null)
                message.error = String(object.error);
            if (object.conversation != null) {
                if (!$util.isObject(object.conversation))
                    throw TypeError(".learning.Envelope.conversation: object expected");
                message.conversation = $root.learning.Conversation.fromObject(object.conversation, long + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from an Envelope message. Also converts values to other types if specified.
         * @function toObject
         * @memberof learning.Envelope
         * @static
         * @param {learning.Envelope} message Envelope
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Envelope.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.version = 0;
                object.requestId = "";
                object.type = options.enums === String ? "UNKNOWN" : 0;
                object.message = null;
                object.conversationId = "";
                object.error = "";
                object.conversation = null;
            }
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                object.version = message.version;
            if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                object.requestId = message.requestId;
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                object.type = options.enums === String ? $root.learning.EventType[message.type] === undefined ? message.type : $root.learning.EventType[message.type] : message.type;
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                object.message = $root.learning.ChatMessage.toObject(message.message, options, q + 1);
            if (message.conversationId != null && Object.hasOwnProperty.call(message, "conversationId"))
                object.conversationId = message.conversationId;
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                object.error = message.error;
            if (message.conversation != null && Object.hasOwnProperty.call(message, "conversation"))
                object.conversation = $root.learning.Conversation.toObject(message.conversation, options, q + 1);
            return object;
        };

        /**
         * Converts this Envelope to JSON.
         * @function toJSON
         * @memberof learning.Envelope
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Envelope.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Envelope
         * @function getTypeUrl
         * @memberof learning.Envelope
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Envelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/learning.Envelope";
        };

        return Envelope;
    })();

    return learning;
})();

export { $root as default };
