import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLibraryComponent } from './admin-library.component';

describe('AdminLibraryComponent', () => {
  let component: AdminLibraryComponent;
  let fixture: ComponentFixture<AdminLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
