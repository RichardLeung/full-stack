// This is a generated file - do not edit.
//
// Generated from learning.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

/// v1: field numbers are permanent. Reserve removed numbers in future revisions.
class EventType extends $pb.ProtobufEnum {
  static const EventType UNKNOWN =
      EventType._(0, _omitEnumNames ? '' : 'UNKNOWN');
  static const EventType HELLO = EventType._(1, _omitEnumNames ? '' : 'HELLO');
  static const EventType SEND_MESSAGE =
      EventType._(2, _omitEnumNames ? '' : 'SEND_MESSAGE');
  static const EventType MESSAGE_CREATED =
      EventType._(3, _omitEnumNames ? '' : 'MESSAGE_CREATED');
  static const EventType ACK = EventType._(4, _omitEnumNames ? '' : 'ACK');
  static const EventType ERROR = EventType._(5, _omitEnumNames ? '' : 'ERROR');
  static const EventType CONVERSATION_CHANGED =
      EventType._(6, _omitEnumNames ? '' : 'CONVERSATION_CHANGED');

  static const $core.List<EventType> values = <EventType>[
    UNKNOWN,
    HELLO,
    SEND_MESSAGE,
    MESSAGE_CREATED,
    ACK,
    ERROR,
    CONVERSATION_CHANGED,
  ];

  static final $core.List<EventType?> _byValue =
      $pb.ProtobufEnum.$_initByValueList(values, 6);
  static EventType? valueOf($core.int value) =>
      value < 0 || value >= _byValue.length ? null : _byValue[value];

  const EventType._(super.value, super.name);
}

class MessageKind extends $pb.ProtobufEnum {
  static const MessageKind TEXT =
      MessageKind._(0, _omitEnumNames ? '' : 'TEXT');
  static const MessageKind AUDIO =
      MessageKind._(1, _omitEnumNames ? '' : 'AUDIO');
  static const MessageKind IMAGE =
      MessageKind._(2, _omitEnumNames ? '' : 'IMAGE');

  static const $core.List<MessageKind> values = <MessageKind>[
    TEXT,
    AUDIO,
    IMAGE,
  ];

  static final $core.List<MessageKind?> _byValue =
      $pb.ProtobufEnum.$_initByValueList(values, 2);
  static MessageKind? valueOf($core.int value) =>
      value < 0 || value >= _byValue.length ? null : _byValue[value];

  const MessageKind._(super.value, super.name);
}

const $core.bool _omitEnumNames =
    $core.bool.fromEnvironment('protobuf.omit_enum_names');
