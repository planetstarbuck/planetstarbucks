import { TestBed } from '@angular/core/testing';

import { NewNotificationsService } from './new-notifications.service';

describe('NewNotificationsService', () => {
  let service: NewNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
