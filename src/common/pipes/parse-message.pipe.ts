import { Injectable, ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class MessageDto {
  readonly value: string;
  readonly headers: any;

  constructor(partial: Partial<MessageDto>) {
    Object.assign(this, partial);
  }
}

@Injectable()
export class ParseMessagePipe implements PipeTransform<any, MessageDto> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(rawMessage: any, metadata: ArgumentMetadata): MessageDto {
    const { value, headers } = rawMessage;

    const parsedMessage = new MessageDto({ value, headers });

    return parsedMessage;
  }
}
