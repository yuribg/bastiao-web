import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BastiaoReaderComponent } from './bastiao-reader.component';

describe('BastiaoReaderComponent', () => {
  let component: BastiaoReaderComponent;
  let fixture: ComponentFixture<BastiaoReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BastiaoReaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BastiaoReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
