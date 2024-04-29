import { Inject, Injectable, Scope, Logger } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends Logger {
  constructor(@Inject(INQUIRER) parentClass: object) {
    super(parentClass?.constructor?.name);
  }
}
