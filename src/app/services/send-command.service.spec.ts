import { TestBed } from '@angular/core/testing';

import { SendCommandService } from './send-command.service';

describe('SendCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendCommandService = TestBed.get(SendCommandService);
    expect(service).toBeTruthy();
  });
});
