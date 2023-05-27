import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeReadingDialogComponent } from './qrcode-reading-dialog.component';

describe('QrcodeReadingDialogComponent', () => {
  let component: QrcodeReadingDialogComponent;
  let fixture: ComponentFixture<QrcodeReadingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeReadingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrcodeReadingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
