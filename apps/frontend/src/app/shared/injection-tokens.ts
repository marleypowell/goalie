import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

/**
 * Injection token for the window object.
 */
export const WINDOW = new InjectionToken<Window>('An abstraction over global window object', {
  factory: (): Window => {
    const { defaultView } = inject(DOCUMENT);

    if (!defaultView) {
      throw new Error('Window is not available');
    }

    return defaultView;
  },
});
