import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends Logger {
  public constructor(@Inject(INQUIRER) parentClass: object) {
    super(parentClass?.constructor?.name);
  }
}
