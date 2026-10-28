// This is a generated file - do not edit.
//
// Generated from learning.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports
// ignore_for_file: unused_import

import 'dart:convert' as $convert;
import 'dart:core' as $core;
import 'dart:typed_data' as $typed_data;

@$core.Deprecated('Use eventTypeDescriptor instead')
const EventType$json = {
  '1': 'EventType',
  '2': [
    {'1': 'UNKNOWN', '2': 0},
    {'1': 'HELLO', '2': 1},
    {'1': 'SEND_MESSAGE', '2': 2},
    {'1': 'MESSAGE_CREATED', '2': 3},
    {'1': 'ACK', '2': 4},
    {'1': 'ERROR', '2': 5},
    {'1': 'CONVERSATION_CHANGED', '2': 6},
  ],
};

/// Descriptor for `EventType`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List eventTypeDescriptor = $convert.base64Decode(
    'CglFdmVudFR5cGUSCwoHVU5LTk9XThAAEgkKBUhFTExPEAESEAoMU0VORF9NRVNTQUdFEAISEw'
    'oPTUVTU0FHRV9DUkVBVEVEEAMSBwoDQUNLEAQSCQoFRVJST1IQBRIYChRDT05WRVJTQVRJT05f'
    'Q0hBTkdFRBAG');

@$core.Deprecated('Use messageKindDescriptor instead')
const MessageKind$json = {
  '1': 'MessageKind',
  '2': [
    {'1': 'TEXT', '2': 0},
    {'1': 'AUDIO', '2': 1},
    {'1': 'IMAGE', '2': 2},
  ],
};

/// Descriptor for `MessageKind`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List messageKindDescriptor = $convert.base64Decode(
    'CgtNZXNzYWdlS2luZBIICgRURVhUEAASCQoFQVVESU8QARIJCgVJTUFHRRAC');

@$core.Deprecated('Use mediaDescriptor instead')
const Media$json = {
  '1': 'Media',
  '2': [
    {'1': 'id', '3': 1, '4': 1, '5': 9, '10': 'id'},
    {'1': 'mime_type', '3': 2, '4': 1, '5': 9, '10': 'mimeType'},
    {'1': 'original_name', '3': 3, '4': 1, '5': 9, '10': 'originalName'},
    {'1': 'size', '3': 4, '4': 1, '5': 13, '10': 'size'},
    {'1': 'duration_ms', '3': 5, '4': 1, '5': 13, '10': 'durationMs'},
  ],
};

/// Descriptor for `Media`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List mediaDescriptor = $convert.base64Decode(
    'CgVNZWRpYRIOCgJpZBgBIAEoCVICaWQSGwoJbWltZV90eXBlGAIgASgJUghtaW1lVHlwZRIjCg'
    '1vcmlnaW5hbF9uYW1lGAMgASgJUgxvcmlnaW5hbE5hbWUSEgoEc2l6ZRgEIAEoDVIEc2l6ZRIf'
    'CgtkdXJhdGlvbl9tcxgFIAEoDVIKZHVyYXRpb25Ncw==');

@$core.Deprecated('Use chatMessageDescriptor instead')
const ChatMessage$json = {
  '1': 'ChatMessage',
  '2': [
    {'1': 'id', '3': 1, '4': 1, '5': 9, '10': 'id'},
    {'1': 'conversation_id', '3': 2, '4': 1, '5': 9, '10': 'conversationId'},
    {'1': 'client_message_id', '3': 3, '4': 1, '5': 9, '10': 'clientMessageId'},
    {
      '1': 'kind',
      '3': 4,
      '4': 1,
      '5': 14,
      '6': '.learning.MessageKind',
      '10': 'kind'
    },
    {'1': 'text', '3': 5, '4': 1, '5': 9, '10': 'text'},
    {'1': 'media_id', '3': 6, '4': 1, '5': 9, '10': 'mediaId'},
    {'1': 'created_at', '3': 7, '4': 1, '5': 9, '10': 'createdAt'},
    {
      '1': 'media',
      '3': 8,
      '4': 1,
      '5': 11,
      '6': '.learning.Media',
      '10': 'media'
    },
  ],
};

/// Descriptor for `ChatMessage`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List chatMessageDescriptor = $convert.base64Decode(
    'CgtDaGF0TWVzc2FnZRIOCgJpZBgBIAEoCVICaWQSJwoPY29udmVyc2F0aW9uX2lkGAIgASgJUg'
    '5jb252ZXJzYXRpb25JZBIqChFjbGllbnRfbWVzc2FnZV9pZBgDIAEoCVIPY2xpZW50TWVzc2Fn'
    'ZUlkEikKBGtpbmQYBCABKA4yFS5sZWFybmluZy5NZXNzYWdlS2luZFIEa2luZBISCgR0ZXh0GA'
    'UgASgJUgR0ZXh0EhkKCG1lZGlhX2lkGAYgASgJUgdtZWRpYUlkEh0KCmNyZWF0ZWRfYXQYByAB'
    'KAlSCWNyZWF0ZWRBdBIlCgVtZWRpYRgIIAEoCzIPLmxlYXJuaW5nLk1lZGlhUgVtZWRpYQ==');

@$core.Deprecated('Use conversationDescriptor instead')
const Conversation$json = {
  '1': 'Conversation',
  '2': [
    {'1': 'id', '3': 1, '4': 1, '5': 9, '10': 'id'},
    {'1': 'title', '3': 2, '4': 1, '5': 9, '10': 'title'},
    {'1': 'updated_at', '3': 3, '4': 1, '5': 9, '10': 'updatedAt'},
  ],
};

/// Descriptor for `Conversation`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List conversationDescriptor = $convert.base64Decode(
    'CgxDb252ZXJzYXRpb24SDgoCaWQYASABKAlSAmlkEhQKBXRpdGxlGAIgASgJUgV0aXRsZRIdCg'
    'p1cGRhdGVkX2F0GAMgASgJUgl1cGRhdGVkQXQ=');

@$core.Deprecated('Use envelopeDescriptor instead')
const Envelope$json = {
  '1': 'Envelope',
  '2': [
    {'1': 'version', '3': 1, '4': 1, '5': 13, '10': 'version'},
    {'1': 'request_id', '3': 2, '4': 1, '5': 9, '10': 'requestId'},
    {
      '1': 'type',
      '3': 3,
      '4': 1,
      '5': 14,
      '6': '.learning.EventType',
      '10': 'type'
    },
    {
      '1': 'message',
      '3': 4,
      '4': 1,
      '5': 11,
      '6': '.learning.ChatMessage',
      '10': 'message'
    },
    {'1': 'conversation_id', '3': 5, '4': 1, '5': 9, '10': 'conversationId'},
    {'1': 'error', '3': 6, '4': 1, '5': 9, '10': 'error'},
    {
      '1': 'conversation',
      '3': 7,
      '4': 1,
      '5': 11,
      '6': '.learning.Conversation',
      '10': 'conversation'
    },
  ],
};

/// Descriptor for `Envelope`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List envelopeDescriptor = $convert.base64Decode(
    'CghFbnZlbG9wZRIYCgd2ZXJzaW9uGAEgASgNUgd2ZXJzaW9uEh0KCnJlcXVlc3RfaWQYAiABKA'
    'lSCXJlcXVlc3RJZBInCgR0eXBlGAMgASgOMhMubGVhcm5pbmcuRXZlbnRUeXBlUgR0eXBlEi8K'
    'B21lc3NhZ2UYBCABKAsyFS5sZWFybmluZy5DaGF0TWVzc2FnZVIHbWVzc2FnZRInCg9jb252ZX'
    'JzYXRpb25faWQYBSABKAlSDmNvbnZlcnNhdGlvbklkEhQKBWVycm9yGAYgASgJUgVlcnJvchI6'
    'Cgxjb252ZXJzYXRpb24YByABKAsyFi5sZWFybmluZy5Db252ZXJzYXRpb25SDGNvbnZlcnNhdG'
    'lvbg==');
